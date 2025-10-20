import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, template, data } = body;
    
    console.log('📧 Email API called with:', { to, subject, template });
    console.log('📧 Environment variables check:', {
      hasResend: !!process.env.RESEND_API_KEY,
      hasSendGrid: !!process.env.SENDGRID_API_KEY,
      hasSMTP: !!process.env.SMTP_HOST
    });

    // For now, we'll use a simple email service
    // You can replace this with SendGrid, Mailchimp, Resend, etc.
    
    // Option 1: Using Resend (recommended for production)
    if (process.env.RESEND_API_KEY) {
      const resend = await import('resend');
      const resendClient = new resend.Resend(process.env.RESEND_API_KEY);
      
      const emailContent = generateEmailContent(template, data);
      
      const result = await resendClient.emails.send({
        from: 'ASMR Audio Bible <noreply@asmraudiobible.com>',
        to: [to],
        subject: subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully',
        id: result.data?.id 
      });
    }

    // Option 2: Using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = await import('@sendgrid/mail');
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);
      
      const emailContent = generateEmailContent(template, data);
      
      const msg = {
        to: to,
        from: 'noreply@asmraudiobible.com',
        subject: subject,
        html: emailContent.html,
        text: emailContent.text,
      };

      await sgMail.default.send(msg);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully via SendGrid' 
      });
    }

    // Option 3: Using Nodemailer with SMTP
    if (process.env.SMTP_HOST) {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const emailContent = generateEmailContent(template, data);
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@asmraudiobible.com',
        to: to,
        subject: subject,
        html: emailContent.html,
        text: emailContent.text,
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully via SMTP' 
      });
    }

    // Fallback: Just log the email (for development)
    console.log('Email would be sent:', {
      to,
      subject,
      template,
      data
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Email logged (no email service configured)' 
    });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}

function generateEmailContent(template: string, data: Record<string, any>) {
  if (template === 'subscription') {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to ASMR Audio Bible</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .preference { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎧 Welcome to ASMR Audio Bible!</h1>
              <p>Your spiritual journey begins now</p>
            </div>
            <div class="content">
              <h2>Thank you for subscribing!</h2>
              <p>We're excited to have you join our community of peaceful Bible listeners. Here are your subscription preferences:</p>
              
              <div class="preference">
                <strong>🎤 ASMR Voice:</strong> ${data.asmrModel === 'aria' ? 'Aria (Soft & Gentle)' : 'Heartsease (Warm & Soothing)'}
              </div>
              
              <div class="preference">
                <strong>📖 Chapter Delivery:</strong> ${data.deliveryType === 'unfinished' ? 'Unfinished Chapters Only' : 'Complete Chapters'}
              </div>
              
              <div class="preference">
                <strong>📅 Frequency:</strong> ${data.frequency === 'daily' ? 'Daily' : 'Weekly'}
              </div>
              
              <p>You'll receive your first email soon with a beautiful ASMR Bible chapter to help you relax and connect with God's Word.</p>
              
              <a href="https://asmrts-bible-reading.vercel.app" class="button">Start Listening Now</a>
              
              <p>If you have any questions or need to update your preferences, just reply to this email.</p>
            </div>
            <div class="footer">
              <p>ASMR Audio Bible - Bringing peace through God's Word</p>
              <p>You can unsubscribe at any time by replying to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Welcome to ASMR Audio Bible!

Thank you for subscribing! We're excited to have you join our community of peaceful Bible listeners.

Your subscription preferences:
- ASMR Voice: ${data.asmrModel === 'aria' ? 'Aria (Soft & Gentle)' : 'Heartsease (Warm & Soothing)'}
- Chapter Delivery: ${data.deliveryType === 'unfinished' ? 'Unfinished Chapters Only' : 'Complete Chapters'}
- Frequency: ${data.frequency === 'daily' ? 'Daily' : 'Weekly'}

You'll receive your first email soon with a beautiful ASMR Bible chapter to help you relax and connect with God's Word.

Visit https://asmrts-bible-reading.vercel.app to start listening now.

If you have any questions or need to update your preferences, just reply to this email.

ASMR Audio Bible - Bringing peace through God's Word
You can unsubscribe at any time by replying to this email.
    `;

    return { html, text };
  }

  return {
    html: '<p>Welcome to ASMR Audio Bible!</p>',
    text: 'Welcome to ASMR Audio Bible!'
  };
}
