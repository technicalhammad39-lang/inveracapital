// @ts-nocheck
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateKycStatus(kycId: string, newStatus: string) {
  try {
    const kyc = await prisma.kYC.findUnique({ where: { id: kycId } });
    if (!kyc) return { success: false, error: 'KYC record not found' };

    await prisma.kYC.update({
      where: { id: kycId },
      data: { 
        status: newStatus as any,
        updatedAt: newStatus === 'APPROVED' ? new Date() : null
      }
    });

    // Also update the User's overall status if approved
    if (newStatus === 'APPROVED') {
      // (Optional) you can add a 'kycVerified' boolean to the User profile, or rely on the KYC table
      await prisma.activityLog.create({
        data: {
          userId: kyc.userId,
          action: `KYC Document Approved`,
          ipAddress: 'System',
          userAgent: 'Admin Panel'
        }
      });
    } else if (newStatus === 'REJECTED') {
      await prisma.activityLog.create({
        data: {
          userId: kyc.userId,
          action: `KYC Document Rejected`,
          ipAddress: 'System',
          userAgent: 'Admin Panel'
        }
      });
    }

    revalidatePath('/yesadmin786/kyc');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
