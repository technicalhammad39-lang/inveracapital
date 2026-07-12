import React from 'react';
import prisma from '@/lib/prisma';
import WithdrawalsClient from './WithdrawalsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminWithdrawalsPage() {
  const withdrawalsData = await prisma.withdrawal.findMany({
    include: {
      user: { select: { email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const mappedWithdrawals = withdrawalsData.map(w => ({
    id: w.id,
    user: w.user,
    amount: Number(w.amount),
    method: w.method,
    destinationAddress: w.destinationAddress,
    status: w.status,
    createdAt: w.createdAt.toISOString()
  }));

  return <WithdrawalsClient withdrawals={mappedWithdrawals} />;
}
