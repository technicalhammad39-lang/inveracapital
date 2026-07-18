import React from 'react';
import { getAllInvestmentPlansAdmin } from '@/app/actions/adminPlanActions';
import PlansAdminClient from '@/components/admin/PlansAdminClient';

export default async function PlansAdminPage() {
  const res = await getAllInvestmentPlansAdmin();
  const plans = res.success ? res.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Investment Plans</h1>
        <p className="text-text-secondary mt-1">Manage platform investment plans, ROI, and display settings.</p>
      </div>

      <PlansAdminClient initialPlans={plans ? JSON.parse(JSON.stringify(plans)) : []} />
    </div>
  );
}
