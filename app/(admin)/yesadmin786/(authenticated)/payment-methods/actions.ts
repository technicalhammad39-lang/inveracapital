'use server';

import prisma from '@/lib/prisma';

export async function createPaymentMethod(data: any) {
  try {
    const pm = await prisma.paymentMethod.create({
      data: {
        name: data.name,
        type: data.type,
        // currency: data.currency,
        // address: data.address,
        // network: data.network,
        instructions: data.instructions,
        minDeposit: Number(data.minDeposit),
        maxDeposit: Number(data.maxDeposit),
        processingTime: data.processingTime,
        isActive: data.isActive
      }
    });
    return { success: true, pm };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function togglePaymentMethodStatus(id: string, currentStatus: boolean) {
  try {
    const pm = await prisma.paymentMethod.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    return { success: true, newStatus: pm.isActive };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    await prisma.paymentMethod.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
