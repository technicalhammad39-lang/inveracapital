import React from 'react';
import { getReferralStats, getNetworkTree, getLeaderboard } from '@/app/actions/referralActions';
import ReferralsClient from '@/components/dashboard/ReferralsClient';

export default async function ReferralsPage() {
  const [resStats, resTree, resLeaderboard] = await Promise.all([
    getReferralStats(),
    getNetworkTree(),
    getLeaderboard()
  ]);

  const stats = resStats.success && resStats.stats ? resStats.stats : null;
  const treeData = resTree.success && resTree.treeData ? resTree.treeData : null;
  const leaderboard = resLeaderboard.success && resLeaderboard.leaderboard ? resLeaderboard.leaderboard : null;

  return <ReferralsClient dbStats={stats} dbTree={treeData} dbLeaderboard={leaderboard || []} />;
}
