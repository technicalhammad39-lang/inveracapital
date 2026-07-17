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

    // Monthly growth logic
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentCommissions = await prisma.referralCommission.findMany({
      where: {
        toUserId: user.id,
        createdAt: { gte: sixMonthsAgo }
      }
    });

    // We can group by month for the chart
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

// Helper for Recursive Tree
async function getDownline(userId: string, currentLevel: number, maxLevel: number): Promise<any[]> {
  if (currentLevel > maxLevel) return [];

  const link = await prisma.referralLink.findUnique({
    where: { userId },
    include: {
      referredUsers: {
        include: {
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
    const earnings = user.commissionsGiven.reduce((sum, c) => sum + Number(c.amount), 0);
    
    const grandChildren = await getDownline(user.id, currentLevel + 1, maxLevel);
    
    children.push({
      name: user.username || user.email.split('@')[0],
      level: currentLevel,
      active,
      team: grandChildren.length,
      earnings,
      joined: user.createdAt.toLocaleDateString(),
      children: grandChildren.length > 0 ? grandChildren : undefined
    });
  }

  return children;
}

export async function getNetworkTree() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const children = await getDownline(user.id, 1, 3); // Load up to 3 levels deep

    // We also need the user's total team size and earnings from these users for the root node
    const activeInvestments = await prisma.userInvestment.count({
      where: { userId: user.id, status: 'ACTIVE' }
    });

    const totalCommissions = await prisma.referralCommission.aggregate({
      where: { toUserId: user.id },
      _sum: { amount: true }
    });

    const treeData = {
      name: user.username || 'You',
      level: 0,
      active: activeInvestments > 0,
      team: children.length,
      earnings: totalCommissions._sum.amount ? Number(totalCommissions._sum.amount) : 0,
      joined: 'System Root',
      children
    };

    return { success: true, treeData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLeaderboard() {
  try {
    const users = await prisma.user.findMany({
      include: {
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
      const earnings = u.commissionsEarned.reduce((sum, c) => sum + Number(c.amount), 0);
      let tier = 'Starter';
      let rate = '1%';
      if (team >= 50 || earnings >= 10000) { tier = 'Diamond Partner'; rate = '12%'; }
      else if (team >= 20 || earnings >= 5000) { tier = 'Gold Partner'; rate = '7%'; }
      else if (team >= 5 || earnings >= 1000) { tier = 'Silver Partner'; rate = '5%'; }
      
      return {
        name: u.username || u.email.split('@')[0],
        team,
        earnings,
        tier,
        rate
      };
    })
    .filter(u => u.earnings > 0 || u.team > 0)
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 10)
    .map((u, i) => ({
      ...u,
      rank: i === 0 ? '🥇 1st' : i === 1 ? '🥈 2nd' : i === 2 ? '🥉 3rd' : `${i + 1}th`
    }));

    return { success: true, leaderboard };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
