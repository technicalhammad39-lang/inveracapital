'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getWalletData() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: user.id, balance: 0 }
      });
    }

    // Get referral total
    const referrals = await prisma.referralCommission.findMany({
      where: { toUserId: user.id }
    });
    const referralWallet = referrals.reduce((sum, comm) => sum + Number(comm.amount), 0);

    // Locked balance (amount locked in active plans)
    const activeInvestments = await prisma.userInvestment.findMany({
      where: { userId: user.id, status: 'ACTIVE' }
    });
    const lockedBalance = activeInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);

    return {
      success: true,
      data: {
        main: Number(wallet.balance),
        investment: lockedBalance, // Invera architecture locks investments
        referral: referralWallet,
        bonus: 0,
        locked: lockedBalance,
        totalDeposited: Number(wallet.totalDeposited),
        totalWithdrawn: Number(wallet.totalWithdrawn),
        totalProfit: Number(wallet.totalProfit)
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import { z } from 'zod';

const depositSchema = z.object({
  amount: z.string().refine(val => Number(val) > 0, 'Amount must be greater than 0'),
  methodId: z.string().min(1, 'Method is required')
});

const withdrawalSchema = z.object({
  amount: z.string().refine(val => Number(val) > 0, 'Amount must be greater than 0'),
  method: z.string().min(1, 'Method is required'),
  address: z.string().min(5, 'Address is required and must be valid')
});

export async function getPaymentMethods() {
  try {
    const methods = await prisma.paymentMethod.findMany({
      where: { isActive: true }
    });
    return { success: true, methods };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function requestDeposit(amount: string, methodId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const parsed = depositSchema.parse({ amount, methodId });
    const numAmount = Number(parsed.amount);

    await prisma.deposit.create({
      data: {
        userId: user.id,
        amount: numAmount,
        paymentMethodId: parsed.methodId,
        status: 'PENDING'
      }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllTransactions() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const deposits = await prisma.deposit.findMany({ where: { userId: user.id } });
    const withdrawals = await prisma.withdrawal.findMany({ where: { userId: user.id } });
    const investments = await prisma.userInvestment.findMany({ where: { userId: user.id } });
    const lotteries = await prisma.lotteryTicket.findMany({ where: { userId: user.id } });
    const referrals = await prisma.referralCommission.findMany({ where: { toUserId: user.id } });

    const transactions = [
      ...deposits.map(d => ({
        id: `DEP-${d.id.substring(0, 6)}`,
        type: 'Deposit',
        amount: Number(d.amount),
        date: d.createdAt.toISOString(),
        status: d.status,
        gateway: 'Deposit Gateway',
        fee: 0,
        recipient: 'Main Wallet'
      })),
      ...withdrawals.map(w => ({
        id: `WTH-${w.id.substring(0, 6)}`,
        type: 'Withdrawal',
        amount: Number(w.amount),
        date: w.createdAt.toISOString(),
        status: w.status,
        gateway: 'Withdrawal Gateway',
        fee: 0,
        recipient: 'External Wallet'
      })),
      ...investments.map(i => ({
        id: `INV-${i.id.substring(0, 6)}`,
        type: 'Transfer',
        amount: Number(i.amount),
        date: i.createdAt.toISOString(),
        status: 'COMPLETED',
        gateway: 'Main to Investment',
        fee: 0,
        recipient: 'Investment Wallet'
      })),
      ...lotteries.map(l => ({
        id: `LOT-${l.id.substring(0, 6)}`,
        type: 'Lottery Entry',
        amount: Number(l.amount || 0),
        date: l.createdAt.toISOString(),
        status: 'COMPLETED',
        gateway: 'Ticket Purchase',
        fee: 0,
        recipient: 'Weekly Draw Pool'
      })),
      ...referrals.map(r => ({
        id: `REF-${r.id.substring(0, 6)}`,
        type: 'Referral Commission',
        amount: Number(r.amount),
        date: r.createdAt.toISOString(),
        status: 'COMPLETED',
        gateway: 'Referral System',
        fee: 0,
        recipient: 'Referral Wallet'
      }))
    ];

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { success: true, data: transactions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function requestWithdrawal(amount: string, method: string, address: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const parsed = withdrawalSchema.parse({ amount, method, address });
    const numAmount = Number(parsed.amount);

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet || Number(wallet.balance) < numAmount) {
      throw new Error('Insufficient available balance');
    }

    await prisma.$transaction([
      // Deduct from wallet immediately to prevent double spending
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: numAmount } }
      }),
      // Create withdrawal request
      prisma.withdrawal.create({
        data: {
          userId: user.id,
          amount: numAmount,
          method: method,
          walletAddress: address,
          status: 'PENDING'
        }
      })
    ]);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
