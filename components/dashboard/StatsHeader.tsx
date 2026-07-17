import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getWalletMetrics, getActiveAllocations, getReferralEarnings } from '@/app/actions/dashboardActions';
import StatsHeaderClient from '@/components/dashboard/StatsHeaderClient';

export default async function StatsHeader() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [wallet, activeInvestments, referralEarnings] = await Promise.all([
    getWalletMetrics(),
    getActiveAllocations(),
    getReferralEarnings()
  ]);

  const activeInvestmentsTotal = activeInvestments.reduce((sum, inv) => sum + inv.principal, 0);
  const portfolioValue = (wallet?.balance ? Number(wallet.balance) : 0) + activeInvestmentsTotal;
  const todayRoi = activeInvestments.reduce((sum, inv) => sum + (inv.principal * inv.dailyRoiRaw), 0);
  const totalProfit = wallet?.totalProfit ? Number(wallet.totalProfit) : 0;

  return (
    <StatsHeaderClient 
      portfolioValue={portfolioValue}
      todayRoi={todayRoi}
      totalProfit={totalProfit}
      referralEarnings={referralEarnings}
    />
  );
}
