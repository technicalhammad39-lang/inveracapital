'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleUserStatus(userId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus as any }
    });
    revalidatePath('/yesadmin786/users');
    return { success: true, newStatus };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete cascading references if necessary, or just rely on Prisma's onDelete: Cascade
    // Because we used Cascade in Prisma, deleting the user deletes their wallets, etc.
    await prisma.user.delete({
      where: { id: userId }
    });
    revalidatePath('/yesadmin786/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
