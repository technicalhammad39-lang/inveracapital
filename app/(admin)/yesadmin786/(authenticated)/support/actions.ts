'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function resolveTicket(ticketId: string) {
  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'RESOLVED' }
    });
    revalidatePath('/yesadmin786/support');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function closeTicket(ticketId: string) {
  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'CLOSED' }
    });
    revalidatePath('/yesadmin786/support');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function replyToTicket(ticketId: string, adminId: string, message: string) {
  try {
    await prisma.ticketMessage.create({
      data: {
        ticketId,
        userId: adminId,
        message
      }
    });
    
    // Auto-update ticket status to in-progress if it was open
    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId }});
    if (ticket && ticket.status === 'OPEN') {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'IN_PROGRESS', assignedTo: adminId }
      });
    }

    revalidatePath('/yesadmin786/support');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
