'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateDepositStatus(depositId: string, newStatus: string) {
  try {
    const deposit = await prisma.deposit.findUnique({ where: { id: depositId } });
    if (!deposit) return { success: false, error: 'Deposit not found' };
    if (deposit.status !== 'PENDING') return { success: false, error: 'Deposit is already processed' };

    // Use a transaction to ensure wallet is updated if approved
    await prisma.$transaction(async (tx) => {
      await tx.deposit.update({
        where: { id: depositId },
        data: { status: newStatus as any }
      });

      if (newStatus === 'APPROVED') {
        const wallet = await tx.wallet.findUnique({ where: { userId: deposit.userId } });
        if (wallet) {
          await tx.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: deposit.amount } }
          });
          
          await tx.walletTransaction.create({
            data: {
              walletId: wallet.id,
              type: 'CREDIT',
              amount: deposit.amount,
              status: 'COMPLETED',
              description: `Deposit Approved via ${deposit.method}`
            }
          });
        }
      }
      
      // Log activity
      await tx.activityLog.create({
        data: {
          userId: deposit.userId,
          action: `Deposit ${newStatus} for ${deposit.amount}`,
          ipAddress: 'System',
          userAgent: 'Admin Panel'
        }
      });
    });

    revalidatePath('/yesadmin786/deposits');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
