'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getActiveInvestmentPlans() {
  try {
    const plans = await prisma.investmentPlan.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { minAmount: 'asc' }
    });
    return { success: true, plans };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserInvestments() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    const investments = await prisma.userInvestment.findMany({
      where: { userId: user.id },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, investments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function purchaseInvestmentPlan(planId: string, amount: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const numAmount = Number(amount);
    if (numAmount <= 0) throw new Error('Invalid amount');

    const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
    if (!plan || plan.status !== 'ACTIVE') throw new Error('Invalid or inactive plan');
    
    if (numAmount < Number(plan.minAmount) || numAmount > Number(plan.maxAmount)) {
      throw new Error(`Amount must be between ${plan.minAmount} and ${plan.maxAmount}`);
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet || Number(wallet.balance) < numAmount) {
      throw new Error('Insufficient wallet balance');
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: numAmount } }
      }),
      prisma.userInvestment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          amount: numAmount,
          startDate,
          endDate,
          status: 'ACTIVE'
        }
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEBIT',
          amount: numAmount,
          description: `Investment in ${plan.name}`,
          status: 'COMPLETED'
        }
      })
    ]);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
