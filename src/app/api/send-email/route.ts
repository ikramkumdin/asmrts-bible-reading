import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, template, data } = body;
    
    // Email API called

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

    // Fallback: No email service configured
    
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

// Generate unsubscribe URL
function generateUnsubscribeUrl(email: string, bookId?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.asmrbible.app';
  const token = Buffer.from(`${email}-${bookId || 'all'}-unsubscribe`).toString('base64');
  if (bookId) {
    return `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&bookId=${encodeURIComponent(bookId)}&token=${token}`;
  }
  return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
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
              
              <a href="https://www.asmrbible.app" class="button">Start Listening Now</a>
              
              <p>If you have any questions or need to update your preferences, just reply to this email.</p>
            </div>
            <div class="footer">
              <p>ASMR Audio Bible - Bringing peace through God's Word</p>
              <p><a href="${generateUnsubscribeUrl(data.email || '')}" style="color: #667eea; text-decoration: underline;">Unsubscribe from all emails</a></p>
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

Visit https://www.asmrbible.app to start listening now.

If you have any questions or need to update your preferences, just reply to this email.

ASMR Audio Bible - Bringing peace through God's Word
Unsubscribe: ${generateUnsubscribeUrl(data.email || '')}
    `;

    return { html, text };
  }

  if (template === 'dailyReminder') {
    const progress = typeof data.progressPercent === 'number' ? Math.min(100, Math.max(0, data.progressPercent)) : 0;
    const chapterLabel = data.chapterLabel || 'Your Chapter';
    const ctaText = data.ctaText || `Continue Reading ${chapterLabel}`;
    const buttonUrl = data.buttonUrl || 'https://www.asmrbible.app/bible';
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
              <div class="footer">
                <p>You're receiving this email because you're subscribed to daily reading reminders.</p>
                <p><a href="${generateUnsubscribeUrl(data.email || '')}" style="color: #667eea; text-decoration: underline;">Unsubscribe from all emails</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Daily ASMR Bible Reminder\n\nContinue Reading: ${chapterLabel}\n${deliveryHint}\n\nProgress: ${progress}% completed\n\n${quoteText}\n- ${quoteRef}\n\nOpen: ${buttonUrl}\n`;

    return { html, text };
  }

  if (template === 'bookSubscription') {
    const bookTitle = data.bookTitle || 'Your Book';
    const asmrModel = data.asmrModel === 'aria' ? 'Aria (Soft & Gentle)' : 'Heartsease (Warm & Soothing)';
    const deliveryType = data.deliveryType === 'unfinished' ? 'Unfinished Chapters Only' : 'Complete Chapters';
    const frequency = data.frequency === 'daily' ? 'Daily' : 'Weekly';
    const bookUrl = `https://www.asmrbible.app/bible/${data.bookId}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Book Subscription Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f7fafc; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .card { background: #ffffff; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.06); padding: 30px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -30px -30px 30px -30px; }
            .book-title { font-size: 24px; font-weight: 700; color: #1a202c; margin: 20px 0; }
            .preference { background: #f7fafc; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .button { background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: 600; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h1>📖 Book Subscription Confirmed!</h1>
                <p>You're all set to receive ${frequency.toLowerCase()} updates</p>
              </div>
              
              <div class="book-title">${bookTitle}</div>
              
              <p>Thank you for subscribing to <strong>${bookTitle}</strong>! You'll receive ${frequency.toLowerCase()} email reminders to help you stay connected with God's Word through our soothing ASMR narration.</p>
              
              <div class="preference">
                <strong>🎤 ASMR Voice:</strong> ${asmrModel}
              </div>
              
              <div class="preference">
                <strong>📖 Chapter Delivery:</strong> ${deliveryType}
              </div>
              
              <div class="preference">
                <strong>📅 Email Frequency:</strong> ${frequency}
              </div>
              
              <p>Your first email will arrive ${frequency === 'daily' ? 'tomorrow' : 'next week'} with a beautiful chapter from ${bookTitle} to help you relax and connect with God's Word.</p>
              
              <div style="text-align: center;">
                <a href="${bookUrl}" class="button">Start Reading ${bookTitle} Now</a>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">You can manage your book subscriptions anytime by visiting your account settings.</p>
            </div>
            <div class="footer">
              <p>ASMR Audio Bible - Bringing peace through God's Word</p>
              <p><a href="${generateUnsubscribeUrl(data.email || '', data.bookId)}" style="color: #667eea; text-decoration: underline;">Unsubscribe from ${data.bookTitle || 'this book'}</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Book Subscription Confirmed!

Thank you for subscribing to ${bookTitle}! You'll receive ${frequency.toLowerCase()} email reminders to help you stay connected with God's Word through our soothing ASMR narration.

Your preferences:
- ASMR Voice: ${asmrModel}
- Chapter Delivery: ${deliveryType}
- Email Frequency: ${frequency}

Your first email will arrive ${frequency === 'daily' ? 'tomorrow' : 'next week'} with a beautiful chapter from ${bookTitle}.

Start reading: ${bookUrl}

You can manage your book subscriptions anytime by visiting your account settings.

ASMR Audio Bible - Bringing peace through God's Word
Unsubscribe from ${data.bookTitle || 'this book'}: ${generateUnsubscribeUrl(data.email || '', data.bookId)}
    `;

    return { html, text };
  }

  if (template === 'bookReminder') {
    const bookTitle = data.bookTitle || 'Your Book';
    const chapterLabel = data.chapterLabel || `${bookTitle} Chapter 1`;
    const progress = typeof data.progressPercent === 'number' ? Math.min(100, Math.max(0, data.progressPercent)) : 0;
    const quoteText = data.quoteText || `"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."`;
    const quoteRef = data.quoteRef || 'Jeremiah 29:11';
    const buttonUrl = data.buttonUrl || `https://www.asmrbible.app/bible/${data.bookId}`;
    const ctaText = data.ctaText || `Continue Reading ${bookTitle}`;
    const deliveryHint = data.deliveryType === 'unfinished' 
      ? "You haven't finished this chapter yet. Pick up where you left off."
      : 'Enjoy a complete, soothing chapter today.';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${bookTitle} Reading Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #2d3748; background: #f7fafc; }
            .container { max-width: 640px; margin: 0 auto; padding: 20px; }
            .card { background: #ffffff; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.06); padding: 24px; }
            .book-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .book-title { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
            .chapter-label { font-size: 16px; opacity: 0.9; margin: 0; }
            .title { font-size: 18px; font-weight: 700; color: #1a202c; margin: 0 0 8px; }
            .subtitle { color: #4a5568; margin: 0 0 16px; }
            .progress-wrap { margin: 16px 0; }
            .progress-bar { height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
            .progress { height: 8px; background: #68d391; width: ${progress}%; }
            .progress-label { text-align: right; color: #718096; font-size: 12px; margin-top: 6px; }
            .quote { background: #f7fafc; border-left: 4px solid #667eea; padding: 14px 16px; border-radius: 6px; color: #2d3748; font-style: italic; margin: 20px 0; }
            .quote-ref { text-align: right; color: #718096; font-size: 12px; margin-top: 8px; }
            .button { margin-top: 20px; display: inline-block; background: #667eea; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; }
            .features { display: flex; gap: 24px; justify-content: center; color: #4a5568; margin-top: 24px; font-size: 14px; }
            .footer { text-align: center; color: #a0aec0; font-size: 12px; margin-top: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="book-header">
                <div class="book-title">${bookTitle}</div>
                <div class="chapter-label">${chapterLabel}</div>
              </div>
              
              <div class="title">Continue Your Reading Journey</div>
              <p class="subtitle">${deliveryHint}</p>

              <div class="progress-wrap">
                <div class="progress-bar">
                  <div class="progress"></div>
                </div>
                <div class="progress-label">${progress}% completed</div>
              </div>

              <div class="quote">${quoteText}</div>
              <div class="quote-ref">- ${quoteRef}</div>

              <div style="text-align: center;">
                <a class="button" href="${buttonUrl}">${ctaText}</a>
              </div>

              <div class="features">
                <div>🎧 ASMR Audio</div>
                <div>📝 Take Notes</div>
                <div>📖 ${bookTitle}</div>
              </div>
              <div class="footer">
                <p>You're receiving this email because you're subscribed to ${bookTitle} reading reminders.
Unsubscribe from ${bookTitle}: ${generateUnsubscribeUrl(data.email || '', data.bookId)}</p>
                <p><a href="${generateUnsubscribeUrl(data.email || '', data.bookId)}" style="color: #667eea; text-decoration: underline;">Unsubscribe from ${bookTitle}</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
${bookTitle} Reading Reminder

${chapterLabel}
${deliveryHint}

Progress: ${progress}% completed

${quoteText}
- ${quoteRef}

Continue reading: ${buttonUrl}

You're receiving this email because you're subscribed to ${bookTitle} reading reminders.
Unsubscribe from ${bookTitle}: ${generateUnsubscribeUrl(data.email || '', data.bookId)}
    `;

    return { html, text };
  }

  return {
    html: '<p>Welcome to ASMR Audio Bible!</p>',
    text: 'Welcome to ASMR Audio Bible!'
  };
}
