import React from 'react';
import prisma from '@/lib/prisma';
import FinanceClient from './FinanceClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminFinancePage() {
  const settingsData = await prisma.setting.findMany();

  return <FinanceClient settings={settingsData ? JSON.parse(JSON.stringify(settingsData)) : []} />;
}
