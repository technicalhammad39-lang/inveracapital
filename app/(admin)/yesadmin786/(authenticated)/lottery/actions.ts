'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createLottery(data: any) {
  try {
    await prisma.lottery.create({
      data: {
        name: data.name,
        entryFee: data.ticketPrice,
        prizePool: data.prizePool,
        maxParticipants: data.maxTickets,
        status: data.status === 'ACTIVE' ? 'OPEN' : 'OPEN',
        drawDate: new Date(data.drawDate)
      }
    });
    revalidatePath('/yesadmin786/lottery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleLotteryStatus(lotteryId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'OPEN' ? 'COMPLETED' : 'OPEN';
    await prisma.lottery.update({
      where: { id: lotteryId },
      data: { status: newStatus as any }
    });
    revalidatePath('/yesadmin786/lottery');
    return { success: true, newStatus };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLottery(lotteryId: string) {
  try {
    await prisma.lottery.delete({
      where: { id: lotteryId }
    });
    revalidatePath('/yesadmin786/lottery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
