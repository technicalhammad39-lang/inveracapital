import React from 'react';
import prisma from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settingsData = await prisma.setting.findMany();

  return <SettingsClient settings={settingsData} />;
}
