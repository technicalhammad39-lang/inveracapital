'use server';

import prisma from '@/lib/prisma';
import { RewardType } from '@prisma/client';

export async function createReward(data: any) {
  try {
    const reward = await prisma.reward.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type as RewardType,
        amount: Number(data.amount),
        condition: data.condition,
        isActive: data.isActive
      }
    });
    return { success: true, reward };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleRewardStatus(id: string, currentStatus: boolean) {
  try {
    const reward = await prisma.reward.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    return { success: true, newStatus: reward.isActive };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReward(id: string) {
  try {
    await prisma.reward.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
