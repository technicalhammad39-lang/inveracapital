import React from 'react';
import prisma from '@/lib/prisma';
import PaymentMethodsClient from './PaymentMethodsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPaymentMethodsPage() {
  const methods = await prisma.paymentMethod.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <PaymentMethodsClient methods={methods} />;
}
