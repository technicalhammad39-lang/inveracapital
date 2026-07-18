'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getLotteries() {
  try {
    const lotteries = await prisma.lottery.findMany({
      where: { 
        status: { in: ['UPCOMING', 'LIVE', 'CLOSED', 'OPEN'] }
      },
      include: {
        _count: {
          select: { entries: true }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const formatted = lotteries.map(l => ({
      id: l.id,
      name: l.name,
      prize: Number(l.prizePool),
      fee: Number(l.entryFee),
      participants: l._count.entries,
      maxParticipants: l.maxParticipants,
      status: l.status,
      description: l.description,
      drawDate: l.drawDate,
      featured: l.featured,
      bannerImage: l.bannerImage,
      promoBanner: l.promoBanner,
      color: l.featured ? '#00ff88' : '#3b82f6',
      glow: l.featured ? 'rgba(0,255,136,0.15)' : 'rgba(59,130,246,0.1)'
    }));

    return { success: true, lotteries: formatted };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserLotteryEntries() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const entries = await prisma.lotteryEntry.findMany({
      where: { userId: user.id },
      include: {
        lottery: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = entries.map(e => ({
      id: e.id,
      ticketNum: e.ticketNum,
      pool: e.lottery.name,
      fee: Number(e.lottery.entryFee),
      date: e.createdAt.toLocaleDateString(),
      status: e.status,
      drawDate: e.lottery.drawDate ? e.lottery.drawDate.toLocaleDateString() : 'TBA',
      drawStatus: e.drawStatus
    }));

    return { success: true, entries: formatted };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function purchaseTicket(lotteryId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch Lottery and validate
      const lottery = await tx.lottery.findUnique({
        where: { id: lotteryId },
        include: { _count: { select: { entries: true } } }
      });

      if (!lottery) throw new Error('Lottery not found');
      if (lottery.status !== 'LIVE' && lottery.status !== 'OPEN') throw new Error('Lottery is not currently active');
      if (lottery._count.entries >= lottery.maxParticipants) throw new Error('Lottery is full');

      // 2. Validate User Wallet
      const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
      if (!wallet) throw new Error('Wallet not found');

      if (Number(wallet.balance) < Number(lottery.entryFee)) {
        throw new Error('Insufficient balance in Main Wallet');
      }

      // 3. Generate Unique Ticket
      const dateStr = new Date().getFullYear().toString();
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const ticketNum = `TKT-${dateStr}-${randomStr}`;

      // 4. Deduct Balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: lottery.entryFee }
        }
      });

      // 5. Create Wallet Transaction
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: lottery.entryFee,
          type: 'DEBIT',
          status: 'COMPLETED',
          description: `Purchased Ticket for ${lottery.name}`,
          reference: `LOTTERY_${lottery.id}`
        }
      });

      // 6. Create Lottery Entry
      const entry = await tx.lotteryEntry.create({
        data: {
          lotteryId: lottery.id,
          userId: user.id,
          ticketNum,
          status: 'ACTIVE',
          drawStatus: 'PENDING'
        }
      });

      // 7. Platform Activity Feed Log
      await tx.activityLog.create({
        data: {
          userId: user.id,
          action: 'LOTTERY_PURCHASE',
          amount: lottery.entryFee,
          type: 'LOTTERY',
          status: 'SUCCESS',
        }
      });

      // 8. Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Lottery Ticket Purchased',
          message: `You successfully purchased a ticket (${ticketNum}) for ${lottery.name}. Good luck!`,
          link: '/lottery'
        }
      });

      return entry;
    });

    revalidatePath('/lottery');
    return { success: true, ticket: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLotteryWinners() {
  try {
    const winners = await prisma.lotteryWinner.findMany({
      include: {
        user: { include: { profile: true } },
        lottery: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const formatted = winners.map(w => ({
      name: w.user.profile?.firstName ? `${w.user.profile.firstName} ${w.user.profile.lastName}` : w.user.username || w.user.email.split('@')[0],
      amount: Number(w.prizeAmount),
      pool: w.lottery.name,
      date: w.createdAt.toLocaleDateString(),
      ticket: `TKT-${w.id.substring(0, 6).toUpperCase()}`,
      color: w.place === 1 ? '#00ff88' : w.place === 2 ? '#3b82f6' : '#a855f7',
      avatar: w.user.profile?.avatarUrl || (w.user.username || w.user.email).substring(0, 2).toUpperCase()
    }));

    return { success: true, winners: formatted };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
