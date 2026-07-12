import React from 'react';
import prisma from '@/lib/prisma';
import KycClient from './KycClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminKycPage() {
  const kycData = await prisma.kYC.findMany({
    include: {
      user: { select: { email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const mappedKyc = kycData.map(k => ({
    id: k.id,
    user: k.user,
    documentType: k.documentType,
    documentUrl: k.documentUrl,
    status: k.status,
    verifiedAt: k.verifiedAt ? k.verifiedAt.toISOString() : null,
    createdAt: k.createdAt.toISOString()
  }));

  return <KycClient kycRecords={mappedKyc} />;
}
