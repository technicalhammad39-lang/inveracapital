'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Ensure user is admin
async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role?.name !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getAllInvestmentPlansAdmin() {
  try {
    await checkAdmin();
    const plans = await prisma.investmentPlan.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    return { success: true, data: plans };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createInvestmentPlan(data: any) {
  try {
    await checkAdmin();
    const newPlan = await prisma.investmentPlan.create({
      data: {
        name: data.name,
        description: data.description,
        dailyRoi: data.dailyRoi,
        durationDays: data.durationDays,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        fixedAmount: data.fixedAmount,
        status: data.status || 'ACTIVE',
        displayOrder: data.displayOrder || 0,
        badge: data.badge,
        icon: data.icon || 'briefcase',
        gradientColor: data.gradientColor || '#00ff88',
        theme: data.theme || 'dark',
        planImage: data.planImage,
        features: data.features || [],
        riskLevel: data.riskLevel || 'Medium',
        expectedReturn: data.expectedReturn || 'Variable',
        visibility: data.visibility ?? true
      }
    });
    return { success: true, data: newPlan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateInvestmentPlan(id: string, data: any) {
  try {
    await checkAdmin();
    const updatedPlan = await prisma.investmentPlan.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        dailyRoi: data.dailyRoi,
        durationDays: data.durationDays,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        fixedAmount: data.fixedAmount,
        status: data.status,
        displayOrder: data.displayOrder,
        badge: data.badge,
        icon: data.icon,
        gradientColor: data.gradientColor,
        theme: data.theme,
        planImage: data.planImage,
        features: data.features,
        riskLevel: data.riskLevel,
        expectedReturn: data.expectedReturn,
        visibility: data.visibility
      }
    });
    return { success: true, data: updatedPlan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteInvestmentPlan(id: string) {
  try {
    await checkAdmin();
    await prisma.investmentPlan.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
