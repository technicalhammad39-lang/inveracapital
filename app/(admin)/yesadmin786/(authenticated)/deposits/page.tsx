import React from 'react';
import prisma from '@/lib/prisma';
import DepositsClient from './DepositsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDepositsPage() {
  const depositsData = await prisma.deposit.findMany({
    include: {
      user: { select: { email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const mappedDeposits = depositsData.map(dep => ({
    id: dep.id,
    user: dep.user,
    amount: Number(dep.amount),
    method: dep.method,
    transactionId: dep.transactionId,
    status: dep.status,
    createdAt: dep.createdAt.toISOString()
  }));

  return <DepositsClient deposits={mappedDeposits} />;
}
