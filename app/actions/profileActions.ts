'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
      }
    });

    if (!dbUser || !dbUser.profile) throw new Error('Profile not found');

    return {
      success: true,
      profile: {
        firstName: dbUser.profile.firstName,
        lastName: dbUser.profile.lastName,
        phone: dbUser.profile.phone || '',
        country: dbUser.profile.country || '',
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export async function updateProfile(data: { firstName: string, lastName: string, phone: string, country: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const parsedData = updateProfileSchema.parse(data);

    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        phone: parsedData.phone,
        country: parsedData.country
      }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBankAccounts() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const banks = await prisma.bankAccount.findMany({ where: { userId: user.id } });
    return { success: true, banks };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addBankAccount(data: { bankName: string; accountName: string; accountNumber: string; iban?: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const bank = await prisma.bankAccount.create({
      data: {
        userId: user.id,
        bankName: data.bankName,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        iban: data.iban || null
      }
    });
    return { success: true, bank };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBankAccount(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    await prisma.bankAccount.delete({ where: { id, userId: user.id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCryptoWallets() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const wallets = await prisma.cryptoWallet.findMany({ where: { userId: user.id } });
    return { success: true, wallets };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addCryptoWallet(data: { name: string; network: string; address: string; currency: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const wallet = await prisma.cryptoWallet.create({
      data: {
        userId: user.id,
        name: data.name,
        network: data.network,
        address: data.address,
        currency: data.currency
      }
    });
    return { success: true, wallet };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCryptoWallet(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    await prisma.cryptoWallet.delete({ where: { id, userId: user.id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProfileCompletionStatus() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    const banks = await prisma.bankAccount.count({ where: { userId: user.id } });
    const cryptos = await prisma.cryptoWallet.count({ where: { userId: user.id } });
    const authUser = await prisma.user.findUnique({ where: { id: user.id }, select: { is2FAEnabled: true } });

    const checks = {
      hasBasicInfo: !!(profile?.firstName && profile?.lastName),
      hasContactInfo: !!(profile?.phone && profile?.country),
      hasFiatMethod: banks > 0,
      hasCryptoMethod: cryptos > 0,
      has2FA: !!authUser?.is2FAEnabled
    };

    const completed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const percentage = Math.round((completed / total) * 100);

    return { success: true, status: checks, percentage };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
