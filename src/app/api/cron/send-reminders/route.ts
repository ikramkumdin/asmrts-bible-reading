import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

// Verify cron secret (for security)
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel sends it in Authorization header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = request.nextUrl.searchParams.get('secret');
    
    // Check both Authorization header and secret query param
    const isValid = 
      (authHeader === `Bearer ${CRON_SECRET}`) ||
      (cronSecret === CRON_SECRET) ||
      (process.env.VERCEL === '1' && !CRON_SECRET); // Allow in Vercel if no secret set (for testing)
    
    if (CRON_SECRET && !isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const frequency = request.nextUrl.searchParams.get('frequency') as 'daily' | 'weekly' | null;
    
    if (!frequency || (frequency !== 'daily' && frequency !== 'weekly')) {
      return NextResponse.json(
        { error: 'Invalid frequency. Use ?frequency=daily or ?frequency=weekly' },
        { status: 400 }
      );
    }

    // Get subscriptions from Firestore
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not initialized' },
        { status: 500 }
      );
    }

    const subscriptionsRef = collection(db, 'book_subscriptions');
    const q = query(subscriptionsRef, where('frequency', '==', frequency));
    const snapshot = await getDocs(q);

    const subscriptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Processing subscriptions

    const results = {
      total: subscriptions.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send emails for each subscription
    for (const subscription of subscriptions) {
      try {
        const emailData = {
          email: subscription.email,
          bookId: subscription.bookId,
          bookTitle: subscription.bookTitle,
          asmrModel: subscription.asmrModel,
          deliveryType: subscription.deliveryType,
        };

        // Call internal API to send email
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.asmrbible.app'}/api/send-book-reminder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (response.ok) {
          // Update last sent timestamp
          const subscriptionDocRef = doc(db, 'book_subscriptions', subscription.id);
          await updateDoc(subscriptionDocRef, {
            lastSentAt: new Date().toISOString(),
          });
          results.sent++;
        } else {
          const errorText = await response.text();
          results.failed++;
          results.errors.push(`${subscription.email}: ${errorText}`);
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${subscription.email}: ${error.message || 'Unknown error'}`);
        console.error(`Error sending email to ${subscription.email}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      frequency,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process cron job',
      },
      { status: 500 }
    );
  }
}

