'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getPortfolioChartData() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    // Get current wallet balance
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    const currentBalance = Number(wallet?.balance || 0);

    // Get active investments
    const activeInvestments = await prisma.userInvestment.findMany({
      where: { userId: user.id, status: 'ACTIVE' }
    });
    const totalInvested = activeInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    
    const currentTotalPortfolio = currentBalance + totalInvested;

    // Generate last 6 days of data based on real current total portfolio.
    // If they have no data, return empty or zeros.
    // In a real application, we'd query daily snapshots. Here we calculate backwards 
    // based on daily ROI of active investments to simulate real historical data.
    const chartData = [];
    let portfolioValueForDay = currentTotalPortfolio;
    
    // Total daily ROI across all active investments
    const dailyRoiAmount = activeInvestments.reduce((sum, inv) => {
      // Assuming plan is not joined here, so we approximate or we could include plan.
      // Since we don't have plan include, we will just use 1% as average for the chart or fetch plan.
      return sum;
    }, 0);

    // Actually, let's fetch investments with plan included to get accurate daily ROI
    const investmentsWithPlan = await prisma.userInvestment.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      include: { plan: true }
    });
    const totalDailyRoiAmount = investmentsWithPlan.reduce((sum, inv) => {
      return sum + (Number(inv.amount) * Number(inv.plan.dailyRoi));
    }, 0);

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const name = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      
      chartData.push({
        name,
        value: portfolioValueForDay
      });
      // For previous day, subtract the daily ROI amount
      portfolioValueForDay = Math.max(0, portfolioValueForDay - totalDailyRoiAmount);
    }

    return chartData;
  } catch (error) {
    console.error('getPortfolioChartData Error:', error);
    return [];
  }
}

export async function getWalletMetrics() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
      select: { id: true, balance: true, totalProfit: true }
    });
    return wallet;
  } catch (error) {
    console.error('getWalletMetrics Error:', error);
    return null;
  }
}

export async function getActiveAllocations() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const activeInvestments = await prisma.userInvestment.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      include: { plan: true }
    });

    return activeInvestments.map(inv => ({
      id: inv.id,
      name: inv.plan.name,
      rate: `${Number(inv.plan.dailyRoi) * 100}%`,
      dailyRoiRaw: Number(inv.plan.dailyRoi),
      principal: Number(inv.amount),
      earned: Number(inv.totalEarned),
      startDate: inv.startDate.toISOString(),
      endDate: inv.endDate.toISOString()
    }));
  } catch (error) {
    console.error('getActiveAllocations Error:', error);
    return [];
  }
}

export async function getReferralEarnings() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const referralCommissions = await prisma.referralCommission.findMany({
      where: { toUserId: user.id },
      select: { amount: true }
    });
    return referralCommissions.reduce((sum, comm) => sum + Number(comm.amount), 0);
  } catch (error) {
    console.error('getReferralEarnings Error:', error);
    return 0;
  }
}

export async function getRecentLedgers() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) return [];

    const recentLedgers = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, type: true, amount: true, description: true, createdAt: true, status: true }
    });

    return recentLedgers.map(l => ({
      id: l.id,
      type: l.type,
      amount: Number(l.amount),
      description: l.description,
      date: l.createdAt.toISOString(),
      status: l.status
    }));
  } catch (error) {
    console.error('getRecentLedgers Error:', error);
    return [];
  }
}

export async function getGlobalStrategyAllocation() {
  try {
    const allocations = await prisma.userInvestment.groupBy({
      by: ['planId'],
      _sum: {
        amount: true
      },
      where: {
        status: {
          in: ['ACTIVE', 'COMPLETED'] // or just ACTIVE depending on logic
        }
      }
    });

    if (!allocations || allocations.length === 0) return [];

    const planIds = allocations.map(a => a.planId);
    const plans = await prisma.investmentPlan.findMany({
      where: { id: { in: planIds } },
      select: { id: true, name: true, gradientColor: true }
    });

    return allocations.map(alloc => {
      const plan = plans.find(p => p.id === alloc.planId);
      return {
        name: plan?.name || 'Unknown Plan',
        value: Number(alloc._sum.amount || 0),
        color: plan?.gradientColor || '#00ff88'
      };
    });
  } catch (error) {
    console.error('getGlobalStrategyAllocation Error:', error);
    return [];
  }
}

export async function getAllInvestmentPlans() {
  try {
    const plans = await prisma.investmentPlan.findMany({
      where: { visibility: true, status: 'ACTIVE' },
      orderBy: { displayOrder: 'asc' }
    });

    return plans.map(p => ({
      ...p,
      dailyRoi: Number(p.dailyRoi),
      minAmount: Number(p.minAmount),
      maxAmount: Number(p.maxAmount),
      fixedAmount: p.fixedAmount ? Number(p.fixedAmount) : null,
      features: Array.isArray(p.features) ? p.features : typeof p.features === 'string' ? JSON.parse(p.features) : []
    }));
  } catch (error) {
    console.error('getAllInvestmentPlans Error:', error);
    return [];
  }
}
