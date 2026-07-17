'use server';

import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_invera_capital_enterprise_secret_key_2026';
const key = new TextEncoder().encode(JWT_SECRET);

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');
  
  try {
    const { payload } = await jwtVerify(token, key);
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return payload;
  } catch (err) {
    throw new Error('Unauthorized');
  }
}

export async function getSmtpSettings() {
  try {
    await verifyAdmin();
    const settings = await prisma.smtpSetting.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
    return settings;
  } catch (err) {
    return null;
  }
}

export async function saveSmtpSettings(data: any) {
  try {
    await verifyAdmin();
    
    // Invalidate old settings by making them inactive, and create new one
    await prisma.smtpSetting.updateMany({
      data: { isActive: false }
    });

    await prisma.smtpSetting.create({
      data: {
        host: data.host,
        port: data.port,
        user: data.user,
        password: data.password,
        encryption: data.encryption,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        isActive: true
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Save SMTP Error:', error);
    return { error: error.message || 'Failed to save SMTP settings.' };
  }
}

export async function testSmtpSettings() {
  try {
    const admin = await verifyAdmin();
    
    // Test the sendEmail function which naturally pulls from active SmtpSetting
    const res = await sendEmail({
      to: admin.email as string || 'admin@inveracapital.com', // fallback
      subject: 'SMTP Configuration Test - Invera Capital',
      templateName: 'DEFAULT',
      templateData: { body: 'This is a test email to verify your newly configured SMTP settings are working perfectly.' }
    });

    if (!res.success) {
      return { error: res.error || 'Failed to send test email. Please check your credentials.' };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to test SMTP.' };
  }
}
