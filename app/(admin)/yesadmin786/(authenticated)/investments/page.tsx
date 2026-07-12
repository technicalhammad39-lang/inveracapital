import React from 'react';
import prisma from '@/lib/prisma';
import InvestmentsClient from './InvestmentsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminInvestmentsPage() {
  const plansData = await prisma.investmentPlan.findMany({
    include: {
      _count: {
        select: { investments: { where: { status: 'ACTIVE' } } }
      },
      investments: {
        where: { status: 'ACTIVE' },
        select: { amount: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  const mappedPlans = plansData.map(plan => {
    const totalTVL = plan.investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    return {
      id: plan.id,
      name: plan.name,
      minAmount: Number(plan.minAmount),
      maxAmount: Number(plan.maxAmount),
      roiPercent: Number(plan.dailyRoi) * 100,
      durationDays: plan.durationDays,
      status: plan.status,
      _count: plan._count,
      totalTVL
    };
  });

  return <InvestmentsClient plans={mappedPlans} />;
}
