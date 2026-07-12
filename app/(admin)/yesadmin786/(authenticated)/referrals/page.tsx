import React from 'react';
import prisma from '@/lib/prisma';
import ReferralsClient from './ReferralsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminReferralsPage() {
  const referralsData = await prisma.referralCommission.findMany({
    include: {
      toUser: { select: { email: true } },
      fromUser: { select: { email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const mappedReferrals = referralsData.map(ref => ({
    id: ref.id,
    toUser: ref.toUser,
    fromUser: ref.fromUser,
    amount: Number(ref.amount),
    level: ref.level,
    createdAt: ref.createdAt.toISOString()
  }));

  return <ReferralsClient referrals={mappedReferrals} />;
}
