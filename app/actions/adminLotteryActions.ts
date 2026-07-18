'use server';

import prisma from '@/lib/prisma';
import { verifySuperAdmin } from './adminActions';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function getAdminLotteries() {
  await verifySuperAdmin();
  try {
    const lotteries = await prisma.lottery.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { entries: true, winners: true }
        }
      }
    });
    return { success: true, lotteries };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createLottery(data: any) {
  const admin = await verifySuperAdmin();
  try {
    const lottery = await prisma.lottery.create({
      data: {
        name: data.name,
        prizePool: new Prisma.Decimal(data.prizePool),
        entryFee: new Prisma.Decimal(data.entryFee),
        maxParticipants: parseInt(data.maxParticipants),
        status: data.status,
        description: data.description,
        rules: data.rules,
        winnerDistribution: data.winnerDistribution,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        drawDate: data.drawDate ? new Date(data.drawDate) : null,
        featured: data.featured || false,
        bannerImage: data.bannerImage,
        promoBanner: data.promoBanner
      }
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE_LOTTERY',
        targetType: 'Lottery',
        targetId: lottery.id,
        newData: JSON.parse(JSON.stringify(lottery))
      }
    });

    revalidatePath('/yesadmin786/lottery');
    revalidatePath('/lottery');
    return { success: true, lottery };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLottery(id: string, data: any) {
  const admin = await verifySuperAdmin();
  try {
    const oldLottery = await prisma.lottery.findUnique({ where: { id } });
    if (!oldLottery) throw new Error('Lottery not found');

    const lottery = await prisma.lottery.update({
      where: { id },
      data: {
        name: data.name,
        prizePool: new Prisma.Decimal(data.prizePool),
        entryFee: new Prisma.Decimal(data.entryFee),
        maxParticipants: parseInt(data.maxParticipants),
        status: data.status,
        description: data.description,
        rules: data.rules,
        winnerDistribution: data.winnerDistribution,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        drawDate: data.drawDate ? new Date(data.drawDate) : null,
        featured: data.featured || false,
        bannerImage: data.bannerImage,
        promoBanner: data.promoBanner
      }
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_LOTTERY',
        targetType: 'Lottery',
        targetId: lottery.id,
        oldData: JSON.parse(JSON.stringify(oldLottery)),
        newData: JSON.parse(JSON.stringify(lottery))
      }
    });

    revalidatePath('/yesadmin786/lottery');
    revalidatePath('/lottery');
    return { success: true, lottery };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLottery(id: string) {
  const admin = await verifySuperAdmin();
  try {
    const lottery = await prisma.lottery.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE_LOTTERY',
        targetType: 'Lottery',
        targetId: id,
        oldData: JSON.parse(JSON.stringify(lottery))
      }
    });

    revalidatePath('/yesadmin786/lottery');
    revalidatePath('/lottery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLotteryEntriesAdmin(lotteryId: string) {
  await verifySuperAdmin();
  try {
    const entries = await prisma.lotteryEntry.findMany({
      where: { lotteryId },
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, entries };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
