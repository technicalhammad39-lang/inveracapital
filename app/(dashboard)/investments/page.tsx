import React from 'react';
import { getUserInvestments } from '@/app/actions/investmentActions';
import { getAllInvestmentPlans, getGlobalStrategyAllocation } from '@/app/actions/dashboardActions';
import { getWalletData } from '@/app/actions/walletActions';
import InvestmentsClient from '@/components/dashboard/InvestmentsClient';

export default async function InvestmentsPage() {
  const [resInvestments, plans, globalAllocations, resWallet] = await Promise.all([
    getUserInvestments(),
    getAllInvestmentPlans(),
    getGlobalStrategyAllocation(),
    getWalletData()
  ]);

  const userInvestments = resInvestments.success && resInvestments.investments ? resInvestments.investments : [];
  const wallet = resWallet.success ? resWallet.data : null;

  return (
    <InvestmentsClient 
      dbPlans={plans ? JSON.parse(JSON.stringify(plans)) : []} 
      dbUserInvestments={userInvestments ? JSON.parse(JSON.stringify(userInvestments)) : []} 
      globalAllocationData={globalAllocations}
      dbWallet={wallet ? JSON.parse(JSON.stringify(wallet)) : null}
    />
  );
}
