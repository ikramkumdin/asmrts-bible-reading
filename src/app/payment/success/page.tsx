'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'pending' | 'error'>('pending');
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [isPro, setIsPro] = useState(false);

  // Check if user is Pro whenever user data changes
  useEffect(() => {
    if (user) {
      import('@/utils/proCheck').then(({ isProUser }) => {
        setIsPro(isProUser(user));
      });
    }
  }, [user]);

  useEffect(() => {
    // Check payment status from URL params
    const orderId = searchParams.get('order_id');
    const statusParam = searchParams.get('status');
    const returnUrl = searchParams.get('returnUrl') || '/bible';

    if (orderId) {
      // Payment was successful
      if (statusParam === 'paid' || !statusParam) {
        setStatus('success');
        setIsLoading(false);
        
        // Refresh user data multiple times to ensure webhook has processed
        let attempts = 0;
        const maxAttempts = 10; // Increased to 10 attempts
        
        const refreshInterval = setInterval(async () => {
          attempts++;
          await refreshUser();
          setRefreshAttempts(attempts);
          
          // Check if user is now Pro after refresh
          // We need to wait a bit for state to update
          setTimeout(async () => {
            const { isProUser } = await import('@/utils/proCheck');
            // Get fresh user from auth - we'll check in the next effect
          }, 200);
          
          // If we've tried enough times, redirect anyway
          if (attempts >= maxAttempts) {
            clearInterval(refreshInterval);
            // Redirect to the page they came from
            setTimeout(() => {
              window.location.href = returnUrl;
            }, 1000);
          }
        }, 1000);
        
        // Fallback redirect after 12 seconds
        setTimeout(() => {
          clearInterval(refreshInterval);
          window.location.href = returnUrl;
        }, 12000);
        
        // Cleanup on unmount
        return () => {
          clearInterval(refreshInterval);
        };
      } else {
        setStatus('pending');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [searchParams, refreshUser]);

  // Redirect immediately if user becomes Pro
  useEffect(() => {
    if (isPro && status === 'success') {
      const returnUrl = searchParams.get('returnUrl') || '/bible';
      // Small delay to show success message
      setTimeout(() => {
        window.location.href = returnUrl;
      }, 1500);
    }
  }, [isPro, status, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {isLoading ? (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto" />
              <h1 className="text-2xl font-bold text-gray-900">Processing Payment...</h1>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
            </div>
          ) : status === 'success' ? (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-4">
                  Thank you for upgrading to Pro. Your subscription is now active.
                </p>
                {isPro ? (
                  <p className="text-sm text-green-600 font-semibold mb-4">
                    ✓ Pro status confirmed! Redirecting...
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mb-2">
                    Activating your Pro subscription... ({refreshAttempts}/10)
                  </p>
                )}
              </div>
              <div className="pt-4 space-y-2">
                <Link
                  href={searchParams.get('returnUrl') || '/bible'}
                  className="inline-block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold"
                >
                  {isPro ? 'Continue to Bible Reading' : 'Continue Anyway'}
                </Link>
                {!isPro && (
                  <button
                    onClick={async () => {
                      await refreshUser();
                      // Force a re-check after a moment
                      setTimeout(() => {
                        window.location.reload();
                      }, 500);
                    }}
                    className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Refresh Status
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-12 h-12 text-yellow-600 animate-spin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing</h1>
                <p className="text-gray-600">
                  Your payment is being processed. You'll receive an email confirmation once it's complete.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/bible"
                  className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Continue to Bible Reading
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

