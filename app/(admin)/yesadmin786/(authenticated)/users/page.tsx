// @ts-nocheck
import React from 'react';
import prisma from '@/lib/prisma';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminUsersPage() {
  const [usersData, totalUsers] = await Promise.all([
    prisma.user.findMany({
      include: {
        profile: true,
        wallet: true,
        kyc: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);

  const mappedUsers = usersData.map(u => ({
    id: u.id,
    email: u.email,
    username: u.profile?.username || null,
    status: u.status,
    kycStatus: u.kyc?.status || 'UNVERIFIED',
    balance: Number(u.wallet?.balance) || 0,
    createdAt: u.createdAt.toISOString()
  }));

  return <UsersClient initialUsers={mappedUsers} totalUsers={totalUsers} />;
}
