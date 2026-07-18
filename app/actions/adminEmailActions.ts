'use server';

import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { verifySuperAdmin } from './adminActions';

export async function getSmtpSettings() {
  try {
    await verifySuperAdmin();
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
    const admin = await verifySuperAdmin();
    
    // Invalidate old settings by making them inactive, and create new one
    await prisma.smtpSetting.updateMany({
      data: { isActive: false }
    });

    const newSetting = await prisma.smtpSetting.create({
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

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_SMTP_SETTINGS',
        targetType: 'Settings',
        targetId: newSetting.id,
        newData: JSON.parse(JSON.stringify(newSetting))
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
    const admin = await verifySuperAdmin();
    
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
