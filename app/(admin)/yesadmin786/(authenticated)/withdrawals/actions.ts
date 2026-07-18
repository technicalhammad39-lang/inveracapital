// @ts-nocheck
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySuperAdmin } from '@/app/actions/adminActions';

export async function updateWithdrawalStatus(withdrawalId: string, newStatus: string, adminNotes?: string) {
  try {
    const admin = await verifySuperAdmin();
    
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal) return { success: false, error: 'Withdrawal not found' };
    if (withdrawal.status !== 'PENDING') return { success: false, error: 'Withdrawal is already processed' };

    await prisma.$transaction(async (tx) => {
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: newStatus as any }
      });

      if (newStatus === 'REJECTED') {
        // Refund the wallet if rejected
        const wallet = await tx.wallet.findUnique({ where: { userId: withdrawal.userId } });
        if (wallet) {
          await tx.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: withdrawal.amount } }
          });
          
          await tx.walletTransaction.create({
            data: {
              walletId: wallet.id,
              type: 'CREDIT',
              amount: withdrawal.amount,
              status: 'COMPLETED',
              description: `Withdrawal Rejected - Refund (${adminNotes || 'No reason provided'})`
            }
          });
        }
      } else if (newStatus === 'COMPLETED') {
         // It was already deducted when they requested it, so we just log the completion
         const wallet = await tx.wallet.findUnique({ where: { userId: withdrawal.userId } });
         if (wallet) {
           await tx.walletTransaction.create({
             data: {
               walletId: wallet.id,
               type: 'DEBIT',
               amount: withdrawal.amount,
               status: 'COMPLETED',
               description: `Withdrawal Processed via ${withdrawal.method}`
             }
           });
         }
      }
      
      // Log activity for user
      await tx.activityLog.create({
        data: {
          userId: withdrawal.userId,
          action: `Withdrawal ${newStatus} for ${withdrawal.amount}`,
          ipAddress: 'System',
          userAgent: 'Admin Panel'
        }
      });
      
      // Log Audit for admin
      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'UPDATE_WITHDRAWAL_STATUS',
          targetType: 'Withdrawal',
          targetId: withdrawalId,
          newData: { status: newStatus, notes: adminNotes }
        }
      });
    });

    revalidatePath('/yesadmin786/withdrawals');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
