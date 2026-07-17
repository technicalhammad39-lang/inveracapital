import React from 'react';
import { getUserInvestments } from '@/app/actions/investmentActions';
import { getAllInvestmentPlans, getGlobalStrategyAllocation } from '@/app/actions/dashboardActions';
import InvestmentsClient from '@/components/dashboard/InvestmentsClient';

export default async function InvestmentsPage() {
  const [resInvestments, plans, globalAllocations] = await Promise.all([
    getUserInvestments(),
    getAllInvestmentPlans(),
    getGlobalStrategyAllocation()
  ]);

  const userInvestments = resInvestments.success && resInvestments.investments ? resInvestments.investments : [];

  return (
    <InvestmentsClient 
      dbPlans={plans} 
      dbUserInvestments={userInvestments} 
      globalAllocationData={globalAllocations}
    />
  );
}
