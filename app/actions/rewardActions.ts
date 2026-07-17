'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getRewardsData() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    // Make sure basic rewards exist
    const count = await prisma.reward.count();
    if (count === 0) {
      await prisma.reward.createMany({
        data: [
          { name: 'Day 1 Login', description: 'Daily login bonus', type: 'DAILY_LOGIN', amount: 1, condition: '1' },
          { name: 'Day 2 Login', description: 'Daily login bonus', type: 'DAILY_LOGIN', amount: 1.5, condition: '2' },
          { name: 'Day 3 Login', description: 'Daily login bonus', type: 'DAILY_LOGIN', amount: 2, condition: '3' },
          { name: 'Day 4 Login', description: 'Daily login bonus', type: 'DAILY_LOGIN', amount: 2.5, condition: '4' },
          { name: 'Day 5 Login', description: 'Daily login bonus', type: 'DAILY_LOGIN', amount: 3, condition: '5' },
          { name: 'Day 6 Login', description: 'Daily login bonus', type: 'DAILY_LOGIN', amount: 5, condition: '6' },
          { name: 'Day 7 Login', description: 'Daily login bonus', type: 'DAILY_LOGIN', amount: 10, condition: '7' },
          { name: 'Seed Fund deploy', description: 'Deploy at least $5,000 into Wealth Builder Pro.', type: 'MILESTONE', amount: 250, condition: '{"target": 5000, "category": "Investment"}' },
          { name: 'Lottery enthusiast', description: 'Secure at least 10 entries in Mega Lottery draws.', type: 'MILESTONE', amount: 50, condition: '{"target": 10, "category": "Lottery"}' },
          { name: 'Network builder', description: 'Invite 5 active stakers to your Level 1 node.', type: 'MILESTONE', amount: 150, condition: '{"target": 5, "category": "Referral"}' },
          { name: 'High roller VIP', description: 'Achieve total network volume of $100k.', type: 'MILESTONE', amount: 1000, condition: '{"target": 100000, "category": "VIP"}' }
        ]
      });
    }

    const allRewards = await prisma.reward.findMany({ where: { isActive: true } });
    const userRewards = await prisma.userReward.findMany({ where: { userId: user.id } });
    
    // For milestones we need to calculate current progress dynamically
    const investments = await prisma.userInvestment.aggregate({ where: { userId: user.id, status: 'ACTIVE' }, _sum: { amount: true } });
    const lotteryEntries = await prisma.lotteryEntry.count({ where: { userId: user.id } });
    const refLink = await prisma.referralLink.findUnique({ where: { userId: user.id }, include: { referredUsers: { include: { investments: { where: { status: 'ACTIVE' } } } } } });
    
    const activeRefs = refLink ? refLink.referredUsers.filter(ru => ru.investments.length > 0).length : 0;
    
    // Simplified network volume based on active refs for demo purposes
    const networkVolume = activeRefs * 5000;

    const milestones = allRewards
      .filter(r => r.type === 'MILESTONE')
      .map(r => {
        const cond = JSON.parse(r.condition || '{}');
        let current = 0;
        if (cond.category === 'Investment') current = Number(investments._sum.amount || 0);
        if (cond.category === 'Lottery') current = lotteryEntries;
        if (cond.category === 'Referral') current = activeRefs;
        if (cond.category === 'VIP') current = networkVolume;
        
        return {
          id: r.id,
          title: r.name,
          desc: r.description,
          reward: Number(r.amount),
          current,
          target: cond.target,
          category: cond.category,
          isClaimed: userRewards.some(ur => ur.rewardId === r.id)
        };
      });

    const dailyRewards = allRewards.filter(r => r.type === 'DAILY_LOGIN');
    const claimedDays = userRewards
      .filter(ur => dailyRewards.some(dr => dr.id === ur.rewardId))
      .map(ur => {
        const r = dailyRewards.find(dr => dr.id === ur.rewardId);
        return Number(r?.condition);
      });

    // Determine current day based on last claimed day
    const lastClaimed = claimedDays.length > 0 ? Math.max(...claimedDays) : 0;
    const currentDay = lastClaimed >= 7 ? 1 : lastClaimed + 1; // cycle restarts at 7

    const dailyClaimedMap = claimedDays.reduce((acc: any, day) => {
      acc[day] = true;
      return acc;
    }, {});

    return { 
      success: true, 
      milestones,
      daily: {
        claimed: dailyClaimedMap,
        currentDay,
        amounts: dailyRewards.sort((a,b) => Number(a.condition) - Number(b.condition)).map(r => Number(r.amount)),
        ids: dailyRewards.sort((a,b) => Number(a.condition) - Number(b.condition)).map(r => r.id)
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function claimReward(rewardId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new Error('Reward not found');

    const existing = await prisma.userReward.findFirst({
      where: { userId: user.id, rewardId: reward.id }
    });

    if (existing) throw new Error('Reward already claimed');

    // If it's a daily login reward, enforce 24-hour cooldown
    if (reward.type === 'DAILY_LOGIN') {
      const lastDailyClaim = await prisma.userReward.findFirst({
        where: { 
          userId: user.id, 
          reward: { type: 'DAILY_LOGIN' } 
        },
        orderBy: { claimedAt: 'desc' }
      });

      if (lastDailyClaim) {
        const hoursSinceLastClaim = (Date.now() - new Date(lastDailyClaim.claimedAt).getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastClaim < 24) {
          throw new Error('You must wait 24 hours between daily claims.');
        }
      }
    }

    const amount = Number(reward.amount);

    // Execute in transaction: 
    // 1. Create UserReward
    // 2. Add to Wallet balance
    // 3. Create WalletTransaction
    // 4. Create Notification
    await prisma.$transaction(async (tx) => {
      await tx.userReward.create({
        data: {
          userId: user.id,
          rewardId: reward.id
        }
      });

      // Update wallet
      const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
      if (!wallet) throw new Error('Wallet not found');

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: Number(wallet.balance) + amount }
      });

      // Create transaction record
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: amount,
          type: 'CREDIT',
          status: 'COMPLETED',
          description: `Reward Claim: ${reward.name}`
        }
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Reward Claimed',
          message: `You have successfully claimed $${amount} for ${reward.name}.`
        }
      });
    });

    return { success: true, amount };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
