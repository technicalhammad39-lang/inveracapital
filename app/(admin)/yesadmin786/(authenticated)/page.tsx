import React from 'react';
import prisma from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardOverview() {
  const [
    totalUsers,
    activeUsers,
    verifiedUsers,
    pendingKyc,
    totalDeposits,
    totalWithdrawals,
    totalInvestments,
    activeInvestments,
    lotteries,
    referralPayouts,
    totalProfit,
    pendingSupport,
    recentActivity,
    transactions
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.kYC.count({ where: { status: 'APPROVED' } }),
    prisma.kYC.count({ where: { status: 'PENDING' } }),
    prisma.deposit.aggregate({ _sum: { amount: true }, where: { status: 'APPROVED' } }),
    prisma.withdrawal.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
    prisma.userInvestment.aggregate({ _sum: { amount: true } }),
    prisma.userInvestment.count({ where: { status: 'ACTIVE' } }),
    prisma.lottery.aggregate({ _sum: { prizePool: true } }), // Simplified for revenue
    prisma.referralCommission.aggregate({ _sum: { amount: true } }),
    prisma.wallet.aggregate({ _sum: { totalProfit: true } }),
    prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } }
    }),
    prisma.walletTransaction.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        status: 'COMPLETED'
      }
    })
  ]);

  // Aggregate transactions by day for the chart
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const revenueMap: Record<string, { revenue: number; profit: number }> = {};
  
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    revenueMap[days[d.getDay()]] = { revenue: 0, profit: 0 };
  }

  transactions.forEach(tx => {
    const dayName = days[tx.createdAt.getDay()];
    if (revenueMap[dayName]) {
      const amount = Number(tx.amount) || 0;
      if (tx.type === 'CREDIT') revenueMap[dayName].revenue += amount;
      if (tx.description?.toLowerCase().includes('profit') || tx.description?.toLowerCase().includes('roi')) {
        revenueMap[dayName].profit += amount;
      }
    }
  });

  const revenueData = Object.keys(revenueMap).map(key => ({
    name: key,
    revenue: revenueMap[key].revenue,
    profit: revenueMap[key].profit
  }));

  const stats = {
    totalUsers,
    activeUsers,
    verifiedUsers,
    pendingKyc,
    totalDeposits: Number(totalDeposits._sum.amount) || 0,
    totalWithdrawals: Number(totalWithdrawals._sum.amount) || 0,
    totalInvestments: Number(totalInvestments._sum.amount) || 0,
    activeInvestments,
    lotteryRevenue: Number(lotteries._sum.prizePool) || 0,
    referralPayouts: Number(referralPayouts._sum.amount) || 0,
    totalProfit: Number(totalProfit._sum.amount) || 0,
    pendingSupport
  };

  const activityFeed = recentActivity.map(act => ({
    id: act.id,
    user: act.user?.email?.split('@')[0] || 'Unknown',
    action: act.action,
    time: act.createdAt.toISOString(),
    status: 'completed'
  }));

  // Fallback activity if empty
  if (activityFeed.length === 0) {
    activityFeed.push({
      id: 'mock-1',
      user: 'admin',
      action: 'System Initialized',
      time: new Date().toISOString(),
      status: 'completed'
    });
  }

  return <DashboardClient stats={stats} activityFeed={activityFeed} revenueData={revenueData} />;
}
