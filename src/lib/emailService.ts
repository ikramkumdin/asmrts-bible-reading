// Email service for handling subscriptions
export interface SubscriptionData {
  email: string;
  asmrModel: 'aria' | 'heartsease';
  deliveryType: 'unfinished' | 'whole';
  frequency: 'daily' | 'weekly';
  calculatedCost?: number; // Calculated subscription cost
  receiptAmount?: number; // Actual amount from receipt/payment
  isNew?: boolean; // Flag to indicate if this is a new subscription
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

// Send actual email using server-side API route (recommended for production)
export async function subscribeToEmail(data: SubscriptionData): Promise<EmailResponse> {
  try {
    // Sending email via API route
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

export interface DailyReminderData {
  email: string;
  asmrModel: 'aria' | 'heartsease';
  deliveryType: 'unfinished' | 'whole';
  chapterLabel?: string; // e.g., John Chapter 3
  progressPercent?: number; // 0-100
  quoteText?: string;
  quoteRef?: string;
  buttonUrl?: string;
  ctaText?: string;
}

// Alternative email service using a simple API
async function sendEmailViaAPI(data: SubscriptionData): Promise<void> {
  // Calling /api/send-email
  
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

  // API response received
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('📧 API error response:', errorText);
    throw new Error(`Failed to send email via API: ${response.status} ${errorText}`);
  }
  
  const result = await response.json();
  // Email sent successfully
}

// Send a single daily reminder email now (client helper)
export async function sendDailyReminderEmail(reminder: DailyReminderData): Promise<EmailResponse> {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: reminder.email,
      subject: 'Your daily ASMR Bible reminder',
      template: 'dailyReminder',
      data: {
        asmrModel: reminder.asmrModel,
        deliveryType: reminder.deliveryType,
        chapterLabel: reminder.chapterLabel,
        progressPercent: reminder.progressPercent,
        quoteText: reminder.quoteText,
        quoteRef: reminder.quoteRef,
        buttonUrl: reminder.buttonUrl,
        ctaText: reminder.ctaText,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, message: `Failed to send reminder: ${errorText}` };
  }

  return { success: true, message: 'Reminder email sent' };
}

// Calculate subscription cost based on preferences
export function calculateSubscriptionCost(
  asmrModel: 'aria' | 'heartsease',
  deliveryType: 'unfinished' | 'whole',
  frequency: 'daily' | 'weekly'
): number {
  // Base pricing structure
  const basePrice = 9.99; // Base monthly price
  const asmrModelPrice = asmrModel === 'aria' ? 0 : 2.00; // Heartsease costs $2 more
  const deliveryTypePrice = deliveryType === 'whole' ? 3.00 : 0; // Whole chapters cost $3 more
  const frequencyMultiplier = frequency === 'daily' ? 1.5 : 1.0; // Daily costs 50% more
  
  const calculatedCost = (basePrice + asmrModelPrice + deliveryTypePrice) * frequencyMultiplier;
  return Math.round(calculatedCost * 100) / 100; // Round to 2 decimal places
}

// Save subscription to localStorage (temporary solution)
export function saveSubscriptionLocally(data: SubscriptionData): void {
  try {
    const subscriptions = getLocalSubscriptions();
    const calculatedCost = data.calculatedCost ?? calculateSubscriptionCost(
      data.asmrModel,
      data.deliveryType,
      data.frequency
    );
    
    subscriptions.push({
      ...data,
      calculatedCost,
      isNew: data.isNew ?? true, // Default to new if not specified
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

// Book-specific subscription interfaces
export interface BookSubscriptionData {
  email: string;
  bookId: string;
  bookTitle: string;
  asmrModel: 'aria' | 'heartsease';
  deliveryType: 'unfinished' | 'whole';
  frequency: 'daily' | 'weekly';
  subscribedAt: string;
  id: string;
}

// Save book subscription to localStorage
export function saveBookSubscription(data: Omit<BookSubscriptionData, 'id' | 'subscribedAt'>): void {
  try {
    const subscriptions = getBookSubscriptions();
    const newSubscription: BookSubscriptionData = {
      ...data,
      id: `${data.email}-${data.bookId}-${Date.now()}`,
      subscribedAt: new Date().toISOString()
    };
    
    // Remove existing subscription for this book and email if exists
    const filtered = subscriptions.filter(
      sub => !(sub.email === data.email && sub.bookId === data.bookId)
    );
    
    filtered.push(newSubscription);
    localStorage.setItem('book_subscriptions', JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to save book subscription locally:', error);
  }
}

// Get book subscriptions from localStorage
export function getBookSubscriptions(): BookSubscriptionData[] {
  try {
    const stored = localStorage.getItem('book_subscriptions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get book subscriptions:', error);
    return [];
  }
}

// Get book subscriptions for a specific user email
export function getBookSubscriptionsByEmail(email: string): BookSubscriptionData[] {
  const subscriptions = getBookSubscriptions();
  return subscriptions.filter(sub => sub.email === email);
}

// Get book subscriptions for a specific book
export function getBookSubscriptionsByBook(bookId: string): BookSubscriptionData[] {
  const subscriptions = getBookSubscriptions();
  return subscriptions.filter(sub => sub.bookId === bookId);
}

// Check if a book is subscribed by email
export function isBookSubscribed(email: string, bookId: string): boolean {
  const subscriptions = getBookSubscriptions();
  return subscriptions.some(sub => sub.email === email && sub.bookId === bookId);
}

// Remove book subscription
export function removeBookSubscription(email: string, bookId: string): void {
  try {
    const subscriptions = getBookSubscriptions();
    const filtered = subscriptions.filter(
      sub => !(sub.email === email && sub.bookId === bookId)
    );
    localStorage.setItem('book_subscriptions', JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove book subscription:', error);
  }
}

// Subscribe to a book and send confirmation email
export async function subscribeToBook(
  email: string,
  bookId: string,
  bookTitle: string,
  asmrModel: 'aria' | 'heartsease' = 'aria',
  deliveryType: 'unfinished' | 'whole' = 'unfinished',
  frequency: 'daily' | 'weekly' = 'weekly'
): Promise<EmailResponse> {
  try {
    // Save subscription locally
    saveBookSubscription({
      email,
      bookId,
      bookTitle,
      asmrModel,
      deliveryType,
      frequency
    });

    // Save subscription to Firestore (for cron job)
    if (typeof window === 'undefined') {
      // Server-side: import and save directly
      const { saveBookSubscriptionToFirestore } = await import('@/lib/subscriptionService');
      await saveBookSubscriptionToFirestore({
        email,
        bookId,
        bookTitle,
        asmrModel,
        deliveryType,
        frequency
      });
    } else {
      // Client-side: call API to save to Firestore
      try {
        await fetch('/api/save-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            bookId,
            bookTitle,
            asmrModel,
            deliveryType,
            frequency
          })
        });
      } catch (error) {
        console.warn('Failed to save subscription to Firestore:', error);
        // Continue anyway - local storage is saved
      }
    }

    // Track book subscription event
    if (typeof window !== 'undefined') {
      const { trackBookSubscription } = await import('@/lib/firebaseConfig');
      trackBookSubscription(bookId, bookTitle, frequency, asmrModel);
    }

    // Send confirmation email
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: `You're subscribed to ${bookTitle} - ASMR Audio Bible`,
        template: 'bookSubscription',
        data: {
          bookTitle,
          bookId,
          asmrModel,
          deliveryType,
          frequency
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, message: `Failed to send email: ${errorText}` };
    }

    return { 
      success: true, 
      message: `Successfully subscribed to ${bookTitle} with ${frequency} emails` 
    };
  } catch (error) {
    console.error('Book subscription error:', error);
    return {
      success: false,
      message: 'Failed to subscribe to book. Please try again.'
    };
  }
}

// Unsubscribe from a book
export async function unsubscribeFromBook(
  email: string,
  bookId: string
): Promise<EmailResponse> {
  try {
    // Get book title before removing
    const subscriptions = getBookSubscriptions();
    const subscription = subscriptions.find(sub => sub.email === email && sub.bookId === bookId);
    const bookTitle = subscription?.bookTitle || bookId;
    
    // Remove from local storage
    removeBookSubscription(email, bookId);
    
    // Remove from Firestore
    if (typeof window === 'undefined') {
      // Server-side: import and remove directly
      const { removeBookSubscriptionFromFirestore } = await import('@/lib/subscriptionService');
      await removeBookSubscriptionFromFirestore(email, bookId);
    } else {
      // Client-side: call API to remove from Firestore
      try {
        await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, bookId })
        });
      } catch (error) {
        console.warn('Failed to remove subscription from Firestore:', error);
        // Continue anyway - local storage is removed
      }
    }
    
    // Track book unsubscription event
    if (typeof window !== 'undefined') {
      const { trackBookUnsubscription } = await import('@/lib/firebaseConfig');
      trackBookUnsubscription(bookId, bookTitle);
    }
    
    return {
      success: true,
      message: 'Successfully unsubscribed from book'
    };
  } catch (error) {
    console.error('Book unsubscription error:', error);
    return {
      success: false,
      message: 'Failed to unsubscribe from book. Please try again.'
    };
  }
}

// Send book-specific reminder email
export async function sendBookReminderEmail(
  email: string,
  bookId: string,
  bookTitle: string,
  asmrModel: 'aria' | 'heartsease',
  deliveryType: 'unfinished' | 'whole',
  chapterLabel?: string,
  progressPercent?: number,
  quoteText?: string,
  quoteRef?: string
): Promise<EmailResponse> {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      subject: `Your ${bookTitle} reading reminder - ASMR Audio Bible`,
      template: 'bookReminder',
      data: {
        bookTitle,
        bookId,
        asmrModel,
        deliveryType,
        chapterLabel: chapterLabel || `${bookTitle} Chapter 1`,
        progressPercent: progressPercent || 0,
        quoteText: quoteText || `"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."`,
        quoteRef: quoteRef || 'Jeremiah 29:11',
        buttonUrl: `https://www.asmrbible.app/bible/${bookId}`,
        ctaText: `Continue Reading ${bookTitle}`
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, message: `Failed to send reminder: ${errorText}` };
  }

  return { success: true, message: 'Book reminder email sent' };
}
