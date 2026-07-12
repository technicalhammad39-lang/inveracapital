'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateSystemSetting(key: string, value: string) {
  try {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, description: `System setting for ${key}` }
    });
    revalidatePath('/yesadmin786/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
