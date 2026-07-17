// @ts-nocheck
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_invera_capital_enterprise_secret_key_2026';
const key = new TextEncoder().encode(JWT_SECRET);

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');
  
  try {
    const { payload } = await jwtVerify(token, key);
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return payload;
  } catch (err) {
    throw new Error('Unauthorized');
  }
}

export async function createLottery(data: any) {
  try {
    const admin = await verifySuperAdmin();
    
    await prisma.$transaction(async (tx) => {
      const lottery = await tx.lottery.create({
        data: {
          name: data.name,
          entryFee: data.ticketPrice,
          prizePool: data.prizePool,
          maxParticipants: data.maxTickets,
          status: data.status === 'ACTIVE' ? 'OPEN' : 'OPEN',
          drawDate: new Date(data.drawDate)
        }
      });
      
      await tx.auditLog.create({
        data: {
          adminId: admin.userId || admin.id || "system_user",
targetType: "Lottery",
targetId: "system",

          action: 'LOTTERY_CREATED',
          oldData: `Admin ${admin.email} created lottery ${data.name}.`
        }
      });
    });

    revalidatePath('/yesadmin786/lottery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleLotteryStatus(lotteryId: string, currentStatus: string) {
  try {
    const admin = await verifySuperAdmin();
    const newStatus = currentStatus === 'OPEN' ? 'COMPLETED' : 'OPEN';
    
    await prisma.$transaction(async (tx) => {
      await tx.lottery.update({
        where: { id: lotteryId },
        data: { status: newStatus as any }
      });
      
      await tx.auditLog.create({
        data: {
          adminId: admin.userId || admin.id || "system_user",
targetType: "Lottery",
targetId: "system",

          action: 'LOTTERY_STATUS_TOGGLED',
          oldData: `Admin ${admin.email} changed lottery ${lotteryId} status to ${newStatus}.`
        }
      });
    });

    revalidatePath('/yesadmin786/lottery');
    return { success: true, newStatus };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLottery(lotteryId: string) {
  try {
    const admin = await verifySuperAdmin();
    
    await prisma.$transaction(async (tx) => {
      await tx.lottery.delete({
        where: { id: lotteryId }
      });
      
      await tx.auditLog.create({
        data: {
          adminId: admin.userId || admin.id || "system_user",
targetType: "Lottery",
targetId: "system",

          action: 'LOTTERY_DELETED',
          oldData: `Admin ${admin.email} deleted lottery ${lotteryId}.`
        }
      });
    });

    revalidatePath('/yesadmin786/lottery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
