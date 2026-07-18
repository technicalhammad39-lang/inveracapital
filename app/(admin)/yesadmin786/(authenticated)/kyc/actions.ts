// @ts-nocheck
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySuperAdmin } from '@/app/actions/adminActions';

export async function updateKycStatus(kycId: string, newStatus: string) {
  try {
    const admin = await verifySuperAdmin();
    
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
    
    // Log Audit for admin
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_KYC_STATUS',
        targetType: 'KYC',
        targetId: kycId,
        newData: { status: newStatus }
      }
    });

    revalidatePath('/yesadmin786/kyc');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
