import React from 'react';
import prisma from '@/lib/prisma';
import LotteryClient from './LotteryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLotteryPage() {
  const lotteriesData = await prisma.lottery.findMany({
    include: {
      _count: {
        select: { entries: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const mappedLotteries = lotteriesData.map(l => ({
    id: l.id,
    name: l.name,
    ticketPrice: Number(l.entryFee),
    prizePool: Number(l.prizePool),
    maxTickets: l.maxParticipants,
    status: l.status,
    drawDate: l.drawDate ? l.drawDate.toISOString() : null,
    _count: l._count
  }));

  return <LotteryClient lotteries={mappedLotteries} />;
}
