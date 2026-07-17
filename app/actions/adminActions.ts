// @ts-nocheck
'use server';

import prisma from '@/lib/prisma';
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

export async function getUsersList() {
  try {
    await verifySuperAdmin();
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        wallet: true,
        kyc: true,
        role: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, users };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'BANNED') {
  try {
    const admin = await verifySuperAdmin();
    // Assuming admin.id is in the payload, but if not we might need to look it up.
    // Let's assume we can fetch it, or just use a generic system ID for now if payload.id is missing.
    const adminId = admin.sub || admin.id || 'system';

    await prisma.user.update({
      where: { id: userId },
      data: { status }
    });
    
    // Log Audit
    await prisma.auditLog.create({
      data: {
        adminId: adminId,
        action: 'USER_STATUS_CHANGE',
        targetType: 'User',
        targetId: userId,
        newData: { status }
      }
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function manuallyAdjustWallet(userId: string, amount: string, reason: string) {
  try {
    const admin = await verifySuperAdmin();
    const adminId = admin.sub || admin.id || 'system';
    const numAmount = Number(amount);
    
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');

    const previousBalance = wallet.balance;

    await prisma.$transaction([
      prisma.wallet.update({
        where: { userId },
        data: { balance: { increment: numAmount } }
      }),
      prisma.auditLog.create({
        data: {
          adminId: adminId,
          action: 'MANUAL_BALANCE_ADJUSTMENT',
          targetType: 'Wallet',
          targetId: wallet.id,
          newData: { increment: numAmount, reason }
        }
      })
    ]);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAuditLogs() {
  try {
    await verifySuperAdmin();
    const logs = await prisma.auditLog.findMany({
      include: { admin: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return { success: true, logs };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
