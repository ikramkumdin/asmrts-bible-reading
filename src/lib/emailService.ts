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

// Send actual email using server-side API route (recommended for production)
export async function subscribeToEmail(data: SubscriptionData): Promise<EmailResponse> {
  try {
    console.log('📧 Attempting to send email via API route...');
    await sendEmailViaAPI(data);
    return {
      success: true,
      message: `Successfully subscribed ${data.email} with ${data.asmrModel} voice, ${data.deliveryType} chapters, ${data.frequency} frequency`
    };
  } catch (error) {
    console.error('Email subscription error:', error instanceof Error ? error.message : String(error));
    return {
      success: false,
      message: 'Failed to send email. Please check your email service configuration.'
    };
  }
}

// Alternative email service using a simple API
async function sendEmailViaAPI(data: SubscriptionData): Promise<void> {
  console.log('📧 Calling /api/send-email with data:', data);
  
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

  console.log('📧 API response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('📧 API error response:', errorText);
    throw new Error(`Failed to send email via API: ${response.status} ${errorText}`);
  }
  
  const result = await response.json();
  console.log('📧 API success response:', result);
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
