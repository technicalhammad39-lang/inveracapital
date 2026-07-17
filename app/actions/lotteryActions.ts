'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getLotteries() {
  try {
    const lotteries = await prisma.lottery.findMany({
      where: { status: 'OPEN' },
      include: {
        _count: {
          select: { entries: true }
        }
      }
    });

    const formatted = lotteries.map(l => ({
      id: l.id,
      name: l.name,
      prize: Number(l.prizePool),
      fee: Number(l.entryFee),
      participants: l._count.entries,
      maxParticipants: l.maxParticipants,
      color: l.name.includes('Mega') ? '#00ff88' : l.name.includes('VIP') ? '#a855f7' : '#3b82f6',
      glow: l.name.includes('Mega') ? 'rgba(0,255,136,0.15)' : l.name.includes('VIP') ? 'rgba(168,85,247,0.1)' : 'rgba(59,130,246,0.1)'
    }));

    // If no lotteries in DB, return default mock array so UI doesn't break
    if (formatted.length === 0) {
      return { success: true, lotteries: [
        {
          id: 'daily',
          name: 'Daily Speed Draw',
          prize: 5000,
          fee: 10,
          participants: 142,
          maxParticipants: 300,
          color: '#3b82f6',
          glow: 'rgba(59,130,246,0.1)'
        },
        {
          id: 'mega',
          name: 'Mega Weekly Draw',
          prize: 50000,
          fee: 50,
          participants: 1245,
          maxParticipants: 5000,
          color: '#00ff88',
          glow: 'rgba(0,255,136,0.15)'
        },
        {
          id: 'vip',
          name: 'VIP Monthly Draw',
          prize: 250000,
          fee: 250,
          participants: 89,
          maxParticipants: 1000,
          color: '#a855f7',
          glow: 'rgba(168,85,247,0.1)'
        }
      ]};
    }

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
      id: e.ticketNum,
      pool: e.lottery.name,
      date: e.createdAt.toLocaleDateString(),
      status: e.lottery.status
    }));

    return { success: true, entries: formatted };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLotteryWinners() {
  try {
    const winners = await prisma.lotteryWinner.findMany({
      include: {
        user: true,
        lottery: true
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    });

    const formatted = winners.map(w => ({
      name: w.user.username || w.user.email.split('@')[0],
      amount: Number(w.prizeAmount),
      pool: w.lottery.name,
      date: w.createdAt.toLocaleDateString(),
      ticket: `TKT-${w.id.substring(0, 6).toUpperCase()}`,
      color: w.place === 1 ? '#00ff88' : w.place === 2 ? '#3b82f6' : '#a855f7',
      avatar: (w.user.username || w.user.email).substring(0, 2).toUpperCase()
    }));

    return { success: true, winners: formatted };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function buyLotteryTicket(lotteryId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    let targetLotteryId = lotteryId;

    // Handle mock IDs if real lotteries don't exist
    if (['daily', 'mega', 'vip'].includes(lotteryId)) {
       const existing = await prisma.lottery.findFirst({ where: { status: 'OPEN' } });
       if (!existing) {
         // Create mock lotteries
         const newLottery = await prisma.lottery.create({
           data: {
             name: lotteryId === 'daily' ? 'Daily Speed Draw' : lotteryId === 'mega' ? 'Mega Weekly Draw' : 'VIP Monthly Draw',
             prizePool: lotteryId === 'daily' ? 5000 : lotteryId === 'mega' ? 50000 : 250000,
             entryFee: lotteryId === 'daily' ? 10 : lotteryId === 'mega' ? 50 : 250,
             maxParticipants: lotteryId === 'daily' ? 300 : lotteryId === 'mega' ? 5000 : 1000,
             status: 'OPEN'
           }
         });
         targetLotteryId = newLottery.id;
       } else {
         targetLotteryId = existing.id;
       }
    }

    const lottery = await prisma.lottery.findUnique({ where: { id: targetLotteryId } });
    if (!lottery) throw new Error('Lottery not found');

    const ticketNum = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newEntry = await prisma.lotteryEntry.create({
      data: {
        lotteryId: targetLotteryId,
        userId: user.id,
        ticketNum
      }
    });

    return { success: true, ticket: newEntry };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
