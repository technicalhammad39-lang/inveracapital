// @ts-nocheck
'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_invera_capital_enterprise_secret_key_2026';
const key = new TextEncoder().encode(JWT_SECRET);

export async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');
  
  try {
    const { payload } = await jwtVerify(token, key);
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    
    const adminId = payload.id || payload.sub;
    if (!adminId) throw new Error('Unauthorized: No admin ID in token');

    const adminUser = await prisma.user.findUnique({
      where: { id: adminId as string }
    });

    if (!adminUser) {
      throw new Error('Invalid Admin Session. Foreign Key violation prevented. Please sign out and sign in again.');
    }

    return adminUser;
  } catch (err: any) {
    throw new Error(err.message || 'Unauthorized');
  }
}

import { SignJWT } from 'jose';

export async function adminLogin(email: string, role: string, password?: string) {
  try {
    // Check against real admin credentials as requested
    if (email !== 'invera@admin.com' || password !== 'HammadCEO.786') {
      return { success: false, error: 'Invalid admin credentials' };
    }

    // Ensure this admin actually exists in the DB to satisfy Foreign Keys like AuditLog
    let adminUser = await prisma.user.findUnique({ where: { email } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email,
          username: 'invera_ceo',
          status: 'ACTIVE',
          profile: {
            create: { firstName: 'Hammad', lastName: 'CEO' }
          }
        }
      });
    }

    const token = await new SignJWT({ 
      id: adminUser.id, 
      email, 
      role: 'SUPER_ADMIN' 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(key);

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return { success: true };
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
    await prisma.user.update({
      where: { id: userId },
      data: { status }
    });
    
    // Log Audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
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

export async function manuallyAdjustWallet(userId: string, amount: string, reason: string, type: 'add' | 'deduct' = 'add', field: 'balance' | 'totalProfit' = 'balance') {
  try {
    const admin = await verifySuperAdmin();
    
    let numAmount = Number(amount);
    if (type === 'deduct') numAmount = -Math.abs(numAmount);
    else numAmount = Math.abs(numAmount);
    
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error('Wallet not found');

    const updateData: any = {};
    updateData[field] = { increment: numAmount };

    await prisma.$transaction([
      prisma.wallet.update({
        where: { userId },
        data: updateData
      }),
      prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'MANUAL_BALANCE_ADJUSTMENT',
          targetType: 'Wallet',
          targetId: wallet.id,
          newData: { increment: numAmount, field, type, reason }
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
