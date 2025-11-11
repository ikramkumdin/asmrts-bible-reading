import { NextRequest, NextResponse } from 'next/server';
import { removeBookSubscriptionFromFirestore } from '@/lib/subscriptionService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const bookId = searchParams.get('bookId');
    const token = searchParams.get('token');

    if (!email || !bookId || !token) {
      return NextResponse.redirect(
        new URL('/unsubscribe?error=missing_params', request.url)
      );
    }

    // Verify token (simple hash for now - you can make this more secure)
    const expectedToken = Buffer.from(`${email}-${bookId}-unsubscribe`).toString('base64');
    if (token !== expectedToken) {
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid_token', request.url)
      );
    }

    // Remove subscription
    await removeBookSubscriptionFromFirestore(email, bookId);

    // Also remove from localStorage if user is on the site
    return NextResponse.redirect(
      new URL(`/unsubscribe?success=true&email=${encodeURIComponent(email)}&bookId=${bookId}`, request.url)
    );
  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    return NextResponse.redirect(
      new URL('/unsubscribe?error=server_error', request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, bookId } = body;

    if (!email || !bookId) {
      return NextResponse.json(
        { success: false, message: 'Missing email or bookId' },
        { status: 400 }
      );
    }

    await removeBookSubscriptionFromFirestore(email, bookId);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to unsubscribe',
      },
      { status: 500 }
    );
  }
}

