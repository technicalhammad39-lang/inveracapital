import React from 'react';
import prisma from '@/lib/prisma';
import RewardsClient from './RewardsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminRewardsPage() {
  const rewards = await prisma.reward.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <RewardsClient rewards={rewards ? JSON.parse(JSON.stringify(rewards)) : []} />;
}
