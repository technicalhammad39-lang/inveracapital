import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export default async function ReferralRedirect({ params }: { params: { code: string } }) {
  const code = params.code;

  if (code) {
    // Basic validation to see if the link exists
    const link = await prisma.referralLink.findUnique({
      where: { code }
    });

    if (link) {
      // Increment clicks (optional, but good for tracking)
      await prisma.referralLink.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } }
      });

      // Set cookie to persist during registration
      const cookieStore = await cookies();
      cookieStore.set('invera_ref', code, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    }
  }

  // Redirect to register page
  redirect(`/register${code ? `?ref=${code}` : ''}`);
}
