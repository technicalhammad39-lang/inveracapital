'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getReferralStats() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const referralLink = await prisma.referralLink.findUnique({
      where: { userId: user.id },
      include: {
        referredUsers: {
          include: {
            investments: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      }
    });

    const totalTeam = referralLink ? referralLink.referredUsers.length : 0;
    const activeTeam = referralLink ? referralLink.referredUsers.filter(u => u.investments.length > 0).length : 0;

    const commissions = await prisma.referralCommission.aggregate({
      where: { toUserId: user.id },
      _sum: { amount: true }
    });

    const totalCommissions = commissions._sum.amount ? Number(commissions._sum.amount) : 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentCommissions = await prisma.referralCommission.findMany({
      where: {
        toUserId: user.id,
        createdAt: { gte: sixMonthsAgo }
      }
    });

    const monthlyCommissions = recentCommissions.reduce((acc: any, curr) => {
      const month = curr.createdAt.toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += Number(curr.amount);
      return acc;
    }, {});

    const commissionHistory = Object.keys(monthlyCommissions).map(name => ({
      name,
      amount: monthlyCommissions[name]
    }));

    return { 
      success: true, 
      stats: {
        code: referralLink?.code || '',
        totalTeam,
        activeTeam,
        totalCommissions,
        commissionHistory
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// Interactive Network Tree Logic
// ----------------------------------------------------------------------

async function getDownlineRecursive(userId: string, currentLevel: number, maxLevel: number): Promise<any[]> {
  if (currentLevel > maxLevel) return [];

  const link = await prisma.referralLink.findUnique({
    where: { userId },
    include: {
      referredUsers: {
        include: {
          profile: true,
          investments: { where: { status: 'ACTIVE' } },
          commissionsGiven: { where: { toUserId: userId } },
        }
      }
    }
  });

  if (!link || link.referredUsers.length === 0) return [];

  const children = [];
  for (const user of link.referredUsers) {
    const active = user.investments.length > 0;
    const totalInvested = user.investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const earnings = user.commissionsGiven.reduce((sum, c) => sum + Number(c.amount), 0);
    
    const grandChildren = await getDownlineRecursive(user.id, currentLevel + 1, maxLevel);
    
    children.push({
      id: user.id,
      name: user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : user.username || user.email.split('@')[0],
      avatar: user.profile?.avatarUrl || (user.username || user.email).substring(0, 2).toUpperCase(),
      level: currentLevel,
      active,
      teamSize: grandChildren.length,
      earnings,
      totalInvested,
      joined: user.createdAt.toLocaleDateString(),
      children: grandChildren.length > 0 ? grandChildren : undefined
    });
  }

  return children;
}

export async function getInteractiveNetworkTree() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const children = await getDownlineRecursive(user.id, 1, 3); // Load up to 3 levels deep

    return { success: true, treeData: children };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// Commission Logs
// ----------------------------------------------------------------------

export async function getCommissionLogs() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const logs = await prisma.referralCommission.findMany({
      where: { toUserId: user.id },
      include: {
        fromUser: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to latest 50 for performance
    });

    const formattedLogs = logs.map(log => ({
      id: log.id,
      sourceUser: log.fromUser.profile?.firstName 
        ? `${log.fromUser.profile.firstName} ${log.fromUser.profile.lastName}` 
        : log.fromUser.username || log.fromUser.email.split('@')[0],
      amount: Number(log.amount),
      level: log.level,
      date: log.createdAt.toLocaleString()
    }));

    return { success: true, logs: formattedLogs };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// Global Leaderboard
// ----------------------------------------------------------------------

export async function getGlobalLeaderboard() {
  try {
    // Top 10 users by total commission earned
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        commissionsEarned: true,
        referralLink: {
          include: {
            referredUsers: {
              include: { investments: { where: { status: 'ACTIVE' } } }
            }
          }
        }
      }
    });

    const leaderboard = users.map((u) => {
      const team = u.referralLink ? u.referralLink.referredUsers.filter(ru => ru.investments.length > 0).length : 0;
      const networkSize = u.referralLink ? u.referralLink.referredUsers.length : 0;
      const earnings = u.commissionsEarned.reduce((sum, c) => sum + Number(c.amount), 0);
      
      let tier = 'Starter';
      let rate = '1%';
      if (team >= 50 || earnings >= 10000) { tier = 'Diamond Partner'; rate = '12%'; }
      else if (team >= 20 || earnings >= 5000) { tier = 'Gold Partner'; rate = '7%'; }
      else if (team >= 5 || earnings >= 1000) { tier = 'Silver Partner'; rate = '5%'; }
      
      return {
        id: u.id,
        name: u.profile?.firstName ? `${u.profile.firstName} ${u.profile.lastName}` : u.username || u.email.split('@')[0],
        avatar: u.profile?.avatarUrl || (u.username || u.email).substring(0, 2).toUpperCase(),
        team,
        networkSize,
        earnings,
        tier,
        rate
      };
    })
    .filter(u => u.earnings > 0 || u.team > 0)
    .sort((a, b) => b.earnings - a.earnings) // Sort by earnings
    .slice(0, 10) // Top 10
    .map((u, i) => ({
      ...u,
      rank: i === 0 ? '🥇 1st' : i === 1 ? '🥈 2nd' : i === 2 ? '🥉 3rd' : `${i + 1}th`
    }));

    return { success: true, leaderboard };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
