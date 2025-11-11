import { NextRequest, NextResponse } from 'next/server';
import { sendBookReminderEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, bookId, bookTitle, asmrModel, deliveryType } = body;

    if (!email || !bookId || !bookTitle) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendBookReminderEmail(
      email,
      bookId,
      bookTitle,
      asmrModel || 'aria',
      deliveryType || 'unfinished'
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Reminder email sent successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || 'Failed to send reminder email',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Send book reminder error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to send reminder email',
      },
      { status: 500 }
    );
  }
}

