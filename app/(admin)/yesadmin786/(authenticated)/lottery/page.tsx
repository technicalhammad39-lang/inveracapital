import React from 'react';
import { getAdminLotteries } from '@/app/actions/adminLotteryActions';
import LotteryAdminClient from './LotteryAdminClient';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Lottery Management | Invera Capital Admin',
};

export default async function AdminLotteryPage() {
  const { success, lotteries, error } = await getAdminLotteries();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Lottery Events</h1>
        <p className="text-text-secondary">Manage prize pools, ticket pricing, and draw schedules.</p>
      </div>

      {error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl">
          {error}
        </div>
      ) : (
        <LotteryAdminClient initialLotteries={lotteries ? JSON.parse(JSON.stringify(lotteries)) : []} />
      )}
    </div>
  );
}
