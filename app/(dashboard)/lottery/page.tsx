import React from 'react';
import { getLotteries, getUserLotteryEntries, getLotteryWinners } from '@/app/actions/lotteryActions';
import LotteryClient from '@/components/dashboard/LotteryClient';

export default async function LotteryPage() {
  const [resLotteries, resEntries, resWinners] = await Promise.all([
    getLotteries(),
    getUserLotteryEntries(),
    getLotteryWinners()
  ]);

  const lotteries = resLotteries.success && resLotteries.lotteries ? resLotteries.lotteries : null;
  const entries = resEntries.success && resEntries.entries ? resEntries.entries : null;
  const winners = resWinners.success && resWinners.winners ? resWinners.winners : null;

  return <LotteryClient 
    dbLotteries={lotteries ? JSON.parse(JSON.stringify(lotteries)) : null} 
    dbEntries={entries ? JSON.parse(JSON.stringify(entries)) : null} 
    dbWinners={winners ? JSON.parse(JSON.stringify(winners)) : null} 
  />;
}
