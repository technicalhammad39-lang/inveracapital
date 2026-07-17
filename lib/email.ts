import nodemailer from 'nodemailer';
import prisma from './prisma';
import { getEmailTemplate } from './emailTemplates';

// Dynamic transporter cache to prevent querying DB on every single email if settings haven't changed
let cachedTransporter: nodemailer.Transporter | null = null;
let lastTransporterUpdate = 0;

export async function getTransporter() {
  const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

  if (cachedTransporter && Date.now() - lastTransporterUpdate < CACHE_TTL) {
    return cachedTransporter;
  }

  const smtpSetting = await prisma.smtpSetting.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' }
  });

  if (!smtpSetting) {
    throw new Error("No active SMTP settings found in the database. Please configure SMTP in the Admin Panel.");
  }

  cachedTransporter = nodemailer.createTransport({
    host: smtpSetting.host,
    port: smtpSetting.port,
    secure: smtpSetting.encryption === 'ssl' || smtpSetting.port === 465,
    auth: {
      user: smtpSetting.user,
      pass: smtpSetting.password,
    }
  });

  lastTransporterUpdate = Date.now();
  return cachedTransporter;
}

export async function sendEmail({
  to,
  subject,
  templateName,
  templateData
}: {
  to: string,
  subject: string,
  templateName: string,
  templateData?: any
}) {
  try {
    const transporter = await getTransporter();
    
    const smtpSetting = await prisma.smtpSetting.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (!smtpSetting) throw new Error("No active SMTP settings.");

    const htmlContent = getEmailTemplate(templateName, templateData);

    const info = await transporter.sendMail({
      from: `"${smtpSetting.senderName}" <${smtpSetting.senderEmail}>`,
      to,
      subject,
      html: htmlContent,
    });

    // Log the successful send to the DB
    await prisma.emailLog.create({
      data: {
        to,
        subject,
        body: htmlContent,
        status: 'SENT',
        sentAt: new Date()
      }
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Email Sending Failed:", error);
    
    // Log the failure to the DB
    await prisma.emailLog.create({
      data: {
        to,
        subject,
        body: `Failed attempting to send template: ${templateName}`,
        status: 'FAILED',
        error: error.message || 'Unknown error'
      }
    });

    return { success: false, error: error.message };
  }
}
