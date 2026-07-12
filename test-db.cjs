const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function testConnection() {
  console.log("Testing connection to PostgreSQL...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:HammadBhai.786@localhost:5000/invera_capital' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany();
    const roles = await prisma.role.findMany();
    console.log("✅ Connection Successful!");
    console.log(`Found ${users.length} users and ${roles.length} roles in the database.`);
    
    if (users.length > 0) {
      console.log(`Admin User: ${users[0].email}`);
    }
  } catch (error) {
    console.error("❌ Connection Failed:");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
