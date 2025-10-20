// Email service for handling subscriptions
export interface SubscriptionData {
  email: string;
  asmrModel: 'aria' | 'heartsease';
  deliveryType: 'unfinished' | 'whole';
  frequency: 'daily' | 'weekly';
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

// Send actual email using EmailJS (free service)
export async function subscribeToEmail(data: SubscriptionData): Promise<EmailResponse> {
  try {
    // Check if EmailJS is available
    if (typeof window === 'undefined') {
      return {
        success: false,
        message: 'Email service not available on server side'
      };
    }

    // Import EmailJS dynamically
    const emailjs = await import('@emailjs/browser');
    
    // EmailJS configuration (you'll need to set these up)
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

    // Template parameters
    const templateParams = {
      to_email: data.email,
      asmr_model: data.asmrModel === 'aria' ? 'Aria (Soft & Gentle)' : 'Heartsease (Warm & Soothing)',
      delivery_type: data.deliveryType === 'unfinished' ? 'Unfinished Chapters Only' : 'Complete Chapters',
      frequency: data.frequency === 'daily' ? 'Daily' : 'Weekly',
      from_name: 'ASMR Audio Bible',
      reply_to: 'noreply@asmraudiobible.com'
    };

    // Send email
    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('Email sent successfully:', result);
    
    return {
      success: true,
      message: `Successfully subscribed ${data.email} with ${data.asmrModel} voice, ${data.deliveryType} chapters, ${data.frequency} frequency`
    };
    
  } catch (error) {
    console.error('Email subscription error:', error instanceof Error ? error.message : String(error));
    
    // Fallback: Try alternative email service
    try {
      await sendEmailViaAPI(data);
      return {
        success: true,
        message: 'Subscription successful via alternative service'
      };
    } catch (fallbackError) {
      console.error('Fallback email service failed:', fallbackError);
      return {
        success: false,
        message: 'Failed to send email. Please check your email service configuration.'
      };
    }
  }
}

// Alternative email service using a simple API
async function sendEmailViaAPI(data: SubscriptionData): Promise<void> {
  // Using a free email service like EmailJS or Resend
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: data.email,
      subject: 'Welcome to ASMR Audio Bible!',
      template: 'subscription',
      data: {
        asmrModel: data.asmrModel,
        deliveryType: data.deliveryType,
        frequency: data.frequency
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send email via API');
  }
}

// Save subscription to localStorage (temporary solution)
export function saveSubscriptionLocally(data: SubscriptionData): void {
  try {
    const subscriptions = getLocalSubscriptions();
    subscriptions.push({
      ...data,
      id: Date.now().toString(),
      subscribedAt: new Date().toISOString()
    });
    localStorage.setItem('email_subscriptions', JSON.stringify(subscriptions));
  } catch (error) {
    console.error('Failed to save subscription locally:', error);
  }
}

// Get subscriptions from localStorage
export function getLocalSubscriptions(): Array<SubscriptionData & { id: string; subscribedAt: string }> {
  try {
    const stored = localStorage.getItem('email_subscriptions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get local subscriptions:', error);
    return [];
  }
}

// Remove subscription from localStorage
export function removeSubscriptionLocally(email: string): void {
  try {
    const subscriptions = getLocalSubscriptions();
    const filtered = subscriptions.filter(sub => sub.email !== email);
    localStorage.setItem('email_subscriptions', JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove subscription:', error);
  }
}

// Check if email is already subscribed
export function isEmailSubscribed(email: string): boolean {
  const subscriptions = getLocalSubscriptions();
  return subscriptions.some(sub => sub.email === email);
}
