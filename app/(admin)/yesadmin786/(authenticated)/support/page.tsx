import React from 'react';
import prisma from '@/lib/prisma';
import SupportClient from './SupportClient';
import { verifySessionToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSupportPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return redirect('/yesadmin786');
  
  const payload = await verifySessionToken(token);
  if (!payload || !payload.userId) return redirect('/yesadmin786');

  const currentAdminId = payload.userId as string;

  const ticketsData = await prisma.supportTicket.findMany({
    include: {
      user: { select: { email: true } },
      messages: { orderBy: { createdAt: 'asc' } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Map to raw data
  const mappedTickets = ticketsData.map(t => ({
    id: t.id,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    createdAt: t.createdAt.toISOString(),
    user: t.user,
    messages: t.messages.map(m => ({
      id: m.id,
      message: m.message,
      userId: m.userId,
      createdAt: m.createdAt.toISOString()
    }))
  }));

  return <SupportClient tickets={mappedTickets} currentAdminId={currentAdminId} />;
}
