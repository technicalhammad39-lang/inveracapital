'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateAvatar(userId: string, avatarUrl: string | null) {
  try {
    await prisma.profile.update({
      where: { userId },
      data: { avatarUrl }
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
