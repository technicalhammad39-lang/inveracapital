import React from 'react';
import { getReferralStats, getInteractiveNetworkTree, getGlobalLeaderboard, getCommissionLogs } from '@/app/actions/referralActions';
import ReferralsClient from '@/components/dashboard/ReferralsClient';

export default async function ReferralsPage() {
  const [resStats, resTree, resLeaderboard, resLogs] = await Promise.all([
    getReferralStats(),
    getInteractiveNetworkTree(),
    getGlobalLeaderboard(),
    getCommissionLogs()
  ]);

  const stats = resStats.success && resStats.stats ? resStats.stats : null;
  const treeData = resTree.success && resTree.treeData ? resTree.treeData : null;
  const leaderboard = resLeaderboard.success && resLeaderboard.leaderboard ? resLeaderboard.leaderboard : null;
  const logs = resLogs.success && resLogs.logs ? resLogs.logs : null;

  return <ReferralsClient 
    dbStats={stats ? JSON.parse(JSON.stringify(stats)) : null} 
    dbTree={treeData ? JSON.parse(JSON.stringify(treeData)) : null} 
    dbLeaderboard={leaderboard ? JSON.parse(JSON.stringify(leaderboard)) : []} 
    dbLogs={logs ? JSON.parse(JSON.stringify(logs)) : []} 
  />;
}
