'use client';

import { useState } from 'react';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement actual email subscription logic
      console.log('Subscribing email:', email);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset subscription status after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section id="email-signup" className="bg-yellow-400 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Get ASMR- Relaxing Bible Reading in your inbox
        </h2>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
          
          {isSubscribed && (
            <div className="text-green-700 bg-green-100 border border-green-200 rounded-lg p-3 mb-4">
              Thank you for subscribing! Check your email for confirmation.
            </div>
          )}
        </form>
        
        <p className="text-sm text-gray-700 mt-6">
          By subscribing, I agree to{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">
            Terms of Use
          </a>{' '}
          and acknowledge its{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
            Information Collection Notice
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </section>
  );
} 