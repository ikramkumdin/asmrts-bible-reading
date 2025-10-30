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
      try {
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
          message: 'Email sent successfully via Resend',
          id: result.data?.id 
        });
      } catch (error) {
        console.error('Resend error:', error);
        // Continue to next option
      }
    }

    // Option 2: Using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      try {
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
      } catch (error) {
        console.error('SendGrid error:', error);
        // Continue to next option
      }
    }

    // Option 3: Using Nodemailer with SMTP
    if (process.env.SMTP_HOST) {
      try {
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
      } catch (error) {
        console.error('SMTP error:', error);
        // Continue to fallback
      }
    }

    // Fallback: Just log the email (for development)
    console.log('📧 No email service configured. Email would be sent:', {
      to,
      subject,
      template,
      data
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email logged (no email service configured). Please set up RESEND_API_KEY, SENDGRID_API_KEY, or SMTP credentials in Vercel.' 
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

  if (template === 'dailyReminder') {
    const progress = typeof data.progressPercent === 'number' ? Math.min(100, Math.max(0, data.progressPercent)) : 0;
    const chapterLabel = data.chapterLabel || 'Your Chapter';
    const ctaText = data.ctaText || `Continue Reading ${chapterLabel}`;
    const buttonUrl = data.buttonUrl || 'https://asmrts-bible-reading.vercel.app/bible';
    const quoteText = data.quoteText || '“For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.”';
    const quoteRef = data.quoteRef || 'John 3:16';
    const deliveryHint = data.deliveryType === 'unfinished' 
      ? "You haven't finished this chapter yet. Pick up where you left off."
      : 'Enjoy a complete, soothing chapter today.';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Daily ASMR Bible Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #2d3748; background: #f7fafc; }
            .container { max-width: 640px; margin: 0 auto; padding: 20px; }
            .card { background: #ffffff; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.06); padding: 24px; }
            .title { font-size: 18px; font-weight: 700; color: #1a202c; margin: 0 0 8px; }
            .subtitle { color: #4a5568; margin: 0 0 16px; }
            .progress-wrap { margin: 16px 0; }
            .progress-bar { height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
            .progress { height: 8px; background: #68d391; width: ${progress}%; }
            .progress-label { text-align: right; color: #718096; font-size: 12px; margin-top: 6px; }
            .quote { background: #f7fafc; border-left: 4px solid #a0aec0; padding: 14px 16px; border-radius: 6px; color: #2d3748; font-style: italic; }
            .quote-ref { text-align: right; color: #718096; font-size: 12px; margin-top: 8px; }
            .button { margin-top: 20px; display: inline-block; background: #48bb78; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 700; }
            .features { display: flex; gap: 24px; justify-content: center; color: #4a5568; margin-top: 24px; font-size: 14px; }
            .footer { text-align: center; color: #a0aec0; font-size: 12px; margin-top: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="title">Continue Reading: ${chapterLabel}</div>
              <p class="subtitle">${deliveryHint}</p>

              <div class="progress-wrap">
                <div class="progress-bar">
                  <div class="progress"></div>
                </div>
                <div class="progress-label">${progress}% completed</div>
              </div>

              <div class="quote">${quoteText}</div>
              <div class="quote-ref">- ${quoteRef}</div>

              <a class="button" href="${buttonUrl}">${ctaText}</a>

              <div class="features">
                <div>🎧 ASMR Audio</div>
                <div>📝 Take Notes</div>
              </div>
              <div class="footer">You're receiving this email because you're subscribed to daily reading reminders.</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Daily ASMR Bible Reminder\n\nContinue Reading: ${chapterLabel}\n${deliveryHint}\n\nProgress: ${progress}% completed\n\n${quoteText}\n- ${quoteRef}\n\nOpen: ${buttonUrl}\n`;

    return { html, text };
  }

  return {
    html: '<p>Welcome to ASMR Audio Bible!</p>',
    text: 'Welcome to ASMR Audio Bible!'
  };
}
