'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    const success = searchParams.get('success');
    const email = searchParams.get('email');
    const bookId = searchParams.get('bookId');

    if (success === 'true') {
      setStatus('success');
      setMessage(`You have been successfully unsubscribed from ${bookId || 'this book'}.`);
      
      // Also remove from localStorage
      if (typeof window !== 'undefined' && email && bookId) {
        try {
          const subscriptions = JSON.parse(localStorage.getItem('book_subscriptions') || '[]');
          const filtered = subscriptions.filter(
            (sub: any) => !(sub.email === email && sub.bookId === bookId)
          );
          localStorage.setItem('book_subscriptions', JSON.stringify(filtered));
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
      }
    } else if (error) {
      setStatus('error');
      switch (error) {
        case 'missing_params':
          setMessage('Missing required parameters. Please use the unsubscribe link from your email.');
          break;
        case 'invalid_token':
          setMessage('Invalid unsubscribe link. Please contact support if you continue to receive emails.');
          break;
        default:
          setMessage('An error occurred while unsubscribing. Please try again or contact support.');
      }
    } else {
      setStatus('error');
      setMessage('Invalid unsubscribe request.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          {status === 'success' ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribed Successfully</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">
                You will no longer receive email reminders for this book.
              </p>
            </>
          ) : status === 'error' ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribe Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing...</h1>
              <p className="text-gray-600">Please wait while we process your unsubscribe request.</p>
            </>
          )}

          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center font-semibold"
            >
              Return to Home
            </Link>
            <Link
              href="/bible"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Browse Bible Books
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            If you continue to receive emails, please contact{' '}
            <a href="mailto:support@asmrbible.app" className="text-purple-600 hover:underline">
              support@asmrbible.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}

