import React from 'react';
import { getRewardsData } from '@/app/actions/rewardActions';
import RewardsClient from '@/components/dashboard/RewardsClient';

export default async function RewardsPage() {
  const resRewards = await getRewardsData();
  const dbData = resRewards.success ? resRewards : null;

  return <RewardsClient dbData={dbData ? JSON.parse(JSON.stringify(dbData)) : null} />;
}
