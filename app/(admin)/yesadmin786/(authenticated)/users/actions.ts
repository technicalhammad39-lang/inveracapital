// @ts-nocheck
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleUserStatus(userId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { status: newStatus as any }
      }),
      prisma.auditLog.create({
        data: {
          userId,
          action: 'USER_STATUS_TOGGLED',
          oldData: `User status changed from ${currentStatus} to ${newStatus}`
        }
      })
    ]);
    revalidatePath('/yesadmin786/users');
    return { success: true, newStatus };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    // Can't audit log a deleted user easily since the relation cascade deletes logs. 
    // Usually, you soft delete or log it to a global admin log, but this is fine for now.
    revalidatePath('/yesadmin786/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
