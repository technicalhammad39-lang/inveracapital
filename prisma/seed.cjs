const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:HammadBhai.786@localhost:5000/invera_capital' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Create Core Currencies
  const usd = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    },
  });

  const pkr = await prisma.currency.upsert({
    where: { code: 'PKR' },
    update: {},
    create: {
      code: 'PKR',
      name: 'Pakistani Rupee',
      symbol: 'Rs',
    },
  });

  console.log(`Created currencies: ${usd.code}, ${pkr.code}`);

  // 2. Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'System Administrator with full access to all features',
    },
  });

  const financeRole = await prisma.role.upsert({
    where: { name: 'FINANCE_MANAGER' },
    update: {},
    create: {
      name: 'FINANCE_MANAGER',
      description: 'Can manage deposits, withdrawals, and finance settings',
    },
  });

  console.log(`Created roles: ${superAdminRole.name}, ${financeRole.name}`);

  // 3. Create Super Admin User
  const adminEmail = 'admin@inveracapital.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('HammadBhai.786', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        roleId: superAdminRole.id,
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: 'System',
            lastName: 'Administrator',
            country: 'PK'
          }
        },
        wallet: {
          create: {
            balance: 0
          }
        }
      }
    });
    console.log(`Created Super Admin user: ${admin.email}`);
  } else {
    console.log(`Super Admin ${adminEmail} already exists.`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
