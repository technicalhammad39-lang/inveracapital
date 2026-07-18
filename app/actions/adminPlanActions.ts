'use server';

import prisma from '@/lib/prisma';
import { verifySuperAdmin } from './adminActions';

export async function getAllInvestmentPlansAdmin() {
  try {
    await verifySuperAdmin();
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
    const admin = await verifySuperAdmin();
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

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE_INVESTMENT_PLAN',
        targetType: 'InvestmentPlan',
        targetId: newPlan.id,
        newData: JSON.parse(JSON.stringify(newPlan))
      }
    });

    return { success: true, data: newPlan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateInvestmentPlan(id: string, data: any) {
  try {
    const admin = await verifySuperAdmin();
    const oldPlan = await prisma.investmentPlan.findUnique({ where: { id } });
    if (!oldPlan) throw new Error('Investment plan not found');
    
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
    
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_INVESTMENT_PLAN',
        targetType: 'InvestmentPlan',
        targetId: updatedPlan.id,
        oldData: JSON.parse(JSON.stringify(oldPlan)),
        newData: JSON.parse(JSON.stringify(updatedPlan))
      }
    });

    return { success: true, data: updatedPlan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteInvestmentPlan(id: string) {
  try {
    const admin = await verifySuperAdmin();
    const deletedPlan = await prisma.investmentPlan.delete({ where: { id } });
    
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE_INVESTMENT_PLAN',
        targetType: 'InvestmentPlan',
        targetId: deletedPlan.id,
        oldData: JSON.parse(JSON.stringify(deletedPlan))
      }
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
