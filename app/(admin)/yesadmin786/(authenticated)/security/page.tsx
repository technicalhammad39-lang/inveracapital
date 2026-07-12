import React from 'react';
import prisma from '@/lib/prisma';
import SecurityClient from './SecurityClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSecurityPage() {
  const logsData = await prisma.auditLog.findMany({
    include: {
      admin: { select: { email: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 100 // Limit to recent 100 for performance
  });

  const mappedLogs = logsData.map(log => ({
    id: log.id,
    admin: log.admin,
    action: log.action,
    targetType: log.targetType,
    targetId: log.targetId,
    createdAt: log.createdAt.toISOString()
  }));

  return <SecurityClient logs={mappedLogs} />;
}
