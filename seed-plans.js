const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPlans() {
  await prisma.investmentPlan.createMany({
    data: [
      {
        name: 'Institutional Alpha',
        description: 'Premium institutional grade fund for large capital allocators.',
        dailyRoi: 0.0125,
        durationDays: 30,
        minAmount: 10000,
        maxAmount: 1000000,
        fixedAmount: null,
        status: 'ACTIVE',
        displayOrder: 1,
        badge: 'Most Popular',
        icon: 'briefcase',
        gradientColor: '#00ff88',
        theme: 'dark',
        features: JSON.stringify(['Dedicated Account Manager', 'Priority Support', 'Capital Protection']),
        riskLevel: 'Low',
        expectedReturn: 'Fixed',
        visibility: true
      },
      {
        name: 'Wealth Builder Pro',
        description: 'Accelerated growth fund for active investors.',
        dailyRoi: 0.0150,
        durationDays: 14,
        minAmount: 500,
        maxAmount: 50000,
        fixedAmount: null,
        status: 'ACTIVE',
        displayOrder: 2,
        badge: 'High Yield',
        icon: 'trending-up',
        gradientColor: '#3b82f6',
        theme: 'dark',
        features: JSON.stringify(['Weekly Payouts', 'Compounding Enabled', 'Flexible Withdrawals']),
        riskLevel: 'Medium',
        expectedReturn: 'Variable',
        visibility: true
      },
      {
        name: 'Elite VIP Fund',
        description: 'Exclusive fund for VIP members with maximum returns.',
        dailyRoi: 0.0200,
        durationDays: 60,
        minAmount: 50000,
        maxAmount: 5000000,
        fixedAmount: null,
        status: 'ACTIVE',
        displayOrder: 3,
        badge: 'VIP Only',
        icon: 'star',
        gradientColor: '#a855f7',
        theme: 'dark',
        features: JSON.stringify(['Daily Payouts', 'Concierge Service', 'Private Events Access']),
        riskLevel: 'Low',
        expectedReturn: 'Fixed',
        visibility: true
      }
    ]
  });
  console.log('Plans seeded!');
}

seedPlans()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
