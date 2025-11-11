import { NextRequest, NextResponse } from 'next/server';
import { saveBookSubscriptionToFirestore } from '@/lib/subscriptionService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, bookId, bookTitle, asmrModel, deliveryType, frequency } = body;

    if (!email || !bookId || !bookTitle) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await saveBookSubscriptionToFirestore({
      email,
      bookId,
      bookTitle,
      asmrModel: asmrModel || 'aria',
      deliveryType: deliveryType || 'unfinished',
      frequency: frequency || 'weekly',
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription saved successfully',
    });
  } catch (error: any) {
    console.error('Save subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to save subscription',
      },
      { status: 500 }
    );
  }
}

