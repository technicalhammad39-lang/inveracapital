'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function broadcastAnnouncement(title: string, message: string, link?: string) {
  try {
    // Get all active users
    const users = await prisma.user.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true }
    });

    if (users.length === 0) return { success: false, error: 'No active users found to broadcast to.' };

    // Create notifications in bulk
    const notifications = users.map(u => ({
      userId: u.id,
      title,
      message,
      link: link || null,
      isRead: false
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    revalidatePath('/yesadmin786/content');
    return { success: true, count: users.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
