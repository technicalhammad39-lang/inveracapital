'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createInvestmentPlan(data: any) {
  try {
    await prisma.investmentPlan.create({
      data: {
        name: data.name,
        dailyRoi: data.roiPercent / 100, // Convert percentage to decimal
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        durationDays: data.durationDays,
        status: data.status || 'ACTIVE'
      }
    });
    revalidatePath('/yesadmin786/investments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function togglePlanStatus(planId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await prisma.investmentPlan.update({
      where: { id: planId },
      data: { status: newStatus as any }
    });
    revalidatePath('/yesadmin786/investments');
    return { success: true, newStatus };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePlan(planId: string) {
  try {
    await prisma.investmentPlan.delete({
      where: { id: planId }
    });
    revalidatePath('/yesadmin786/investments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
