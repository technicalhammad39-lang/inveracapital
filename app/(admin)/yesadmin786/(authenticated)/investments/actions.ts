// @ts-nocheck
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_invera_capital_enterprise_secret_key_2026';
const key = new TextEncoder().encode(JWT_SECRET);

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');
  
  try {
    const { payload } = await jwtVerify(token, key);
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return payload;
  } catch (err) {
    throw new Error('Unauthorized');
  }
}

export async function createInvestmentPlan(data: any) {
  try {
    const admin = await verifySuperAdmin();
    
    await prisma.$transaction(async (tx) => {
      const plan = await tx.investmentPlan.create({
        data: {
          name: data.name,
          dailyRoi: data.roiPercent / 100, // Convert percentage to decimal
          minAmount: data.minAmount,
          maxAmount: data.maxAmount,
          durationDays: data.durationDays,
          status: data.status || 'ACTIVE'
        }
      });
      
      await tx.auditLog.create({
        data: {
          adminId: admin.id || "system_user",
targetType: "InvestmentPlan",
targetId: "system",

          action: 'INVESTMENT_PLAN_CREATED',
          oldData: `Admin ${admin.email} created plan ${data.name}.`
        }
      });
    });

    revalidatePath('/yesadmin786/investments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function togglePlanStatus(planId: string, currentStatus: string) {
  try {
    const admin = await verifySuperAdmin();
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'; // Note: Schema uses PAUSED
    
    await prisma.$transaction(async (tx) => {
      await tx.investmentPlan.update({
        where: { id: planId },
        data: { status: newStatus as any }
      });
      
      await tx.auditLog.create({
        data: {
          adminId: admin.id || "system_user",
targetType: "InvestmentPlan",
targetId: "system",

          action: 'INVESTMENT_PLAN_TOGGLED',
          oldData: `Admin ${admin.email} changed plan ${planId} status to ${newStatus}.`
        }
      });
    });

    revalidatePath('/yesadmin786/investments');
    return { success: true, newStatus };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePlan(planId: string) {
  try {
    const admin = await verifySuperAdmin();
    
    await prisma.$transaction(async (tx) => {
      await tx.investmentPlan.delete({
        where: { id: planId }
      });
      
      await tx.auditLog.create({
        data: {
          adminId: admin.id || "system_user",
targetType: "InvestmentPlan",
targetId: "system",

          action: 'INVESTMENT_PLAN_DELETED',
          oldData: `Admin ${admin.email} deleted plan ${planId}.`
        }
      });
    });

    revalidatePath('/yesadmin786/investments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
