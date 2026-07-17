export function getEmailTemplate(templateName: string, data?: any): string {
  const baseColors = {
    bg: '#050505',
    card: '#141414',
    brand: '#00ff88',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0a0',
    border: 'rgba(255, 255, 255, 0.1)',
  };

  const header = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${baseColors.bg}; color: ${baseColors.textPrimary}; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: ${baseColors.card}; border: 1px solid ${baseColors.border}; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .header { text-align: center; padding: 40px 20px; border-bottom: 1px solid ${baseColors.border}; background: linear-gradient(180deg, rgba(0,255,136,0.05) 0%, transparent 100%); }
        .logo { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: ${baseColors.brand}; color: ${baseColors.bg}; font-weight: 900; font-size: 24px; border-radius: 12px; margin-bottom: 16px; }
        .brand-name { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; color: ${baseColors.textPrimary}; }
        .content { padding: 40px; }
        .h1 { font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 20px; color: ${baseColors.textPrimary}; }
        .p { font-size: 16px; line-height: 1.6; color: ${baseColors.textSecondary}; margin-bottom: 24px; }
        .btn { display: inline-block; padding: 14px 28px; background-color: ${baseColors.brand}; color: ${baseColors.bg}; text-decoration: none; font-weight: 700; border-radius: 8px; text-align: center; }
        .footer { padding: 32px 40px; text-align: center; border-top: 1px solid ${baseColors.border}; font-size: 13px; color: ${baseColors.textSecondary}; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">I</div>
          <h1 class="brand-name">INVERA</h1>
        </div>
        <div class="content">
  `;

  const footer = `
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Invera Capital. All rights reserved.</p>
          <p>Institutional Grade Digital Assets.</p>
          <p style="margin-top: 16px;"><a href="#" style="color: ${baseColors.brand}; text-decoration: none;">Support</a> &bull; <a href="#" style="color: ${baseColors.brand}; text-decoration: none;">Privacy Policy</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  let innerContent = '';

  switch (templateName) {
    case 'WELCOME':
      innerContent = `
        <h2 class="h1">Welcome to Invera Capital, ${data?.firstName || 'Valued Client'}</h2>
        <p class="p">Your institutional digital asset account has been successfully created. We are thrilled to welcome you to the platform designed for the modern financial frontier.</p>
        <p class="p">Please verify your email address to unlock full access to portfolio management, secure deposits, and our advanced trading suite.</p>
        <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
          <a href="${data?.verificationLink || '#'}" class="btn">Verify Email Address</a>
        </div>
        <p class="p">If you did not create this account, please disregard this email.</p>
      `;
      break;

    case 'PASSWORD_RESET':
      innerContent = `
        <h2 class="h1">Reset Your Password</h2>
        <p class="p">We received a request to reset the password for your Invera Capital account.</p>
        <p class="p">Click the button below to choose a new password. This link will expire in 1 hour for your security.</p>
        <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
          <a href="${data?.resetLink || '#'}" class="btn">Reset Password</a>
        </div>
        <p class="p">If you did not request a password reset, please contact our security team immediately or ignore this email.</p>
      `;
      break;
      
    case 'NEWSLETTER':
      innerContent = `
        <h2 class="h1">${data?.title || 'Invera Update'}</h2>
        <div style="font-size: 16px; line-height: 1.6; color: ${baseColors.textSecondary};">
          ${data?.body || ''}
        </div>
      `;
      break;

    default:
      innerContent = `
        <h2 class="h1">Notification</h2>
        <p class="p">You have a new alert from Invera Capital.</p>
      `;
  }

  return header + innerContent + footer;
}
