'use client';

import { useState } from 'react';
import { Mail, Headphones, BookOpen, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { subscribeToEmail, saveSubscriptionLocally, isEmailSubscribed, type SubscriptionData, sendDailyReminderEmail } from '@/lib/emailService';
import { trackEmailSubscription } from '@/lib/firebaseConfig';

interface SubscriptionPreferences {
  email: string;
  asmrModel: 'aria' | 'heartsease';
  deliveryType: 'unfinished' | 'whole';
  frequency: 'daily' | 'weekly';
}

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [asmrModel, setAsmrModel] = useState<'aria' | 'heartsease'>('aria');
  const [deliveryType, setDeliveryType] = useState<'unfinished' | 'whole'>('unfinished');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check if email is already subscribed
    if (isEmailSubscribed(email)) {
      setError('This email is already subscribed!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const subscriptionData: SubscriptionData = {
        email,
        asmrModel,
        deliveryType,
        frequency
      };

      // Subscribe to email service
      const result = await subscribeToEmail(subscriptionData);
      
             if (result.success) {
               // Save to local storage as backup
               saveSubscriptionLocally(subscriptionData);

               // Track email subscription event
               trackEmailSubscription(asmrModel, deliveryType, frequency);

               // If daily, trigger the first reminder immediately
               if (frequency === 'daily') {
                 void sendDailyReminderEmail({
                   email,
                   asmrModel,
                   deliveryType,
                   chapterLabel: 'John Chapter 3',
                   progressPercent: 40,
                   quoteText: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
                   quoteRef: 'John 3:16',
                   buttonUrl: 'https://www.asmrbible.app/bible',
                   ctaText: 'Continue Reading',
                 });
               }

               setIsSubscribed(true);
               setEmail('');
               setShowPreferences(false);

               // Reset subscription status after 5 seconds
               setTimeout(() => {
                 setIsSubscribed(false);
               }, 5000);
             } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="email-signup" className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Mail className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-4xl font-bold">
              Get ASMR Bible Reading in Your Inbox
            </h2>
          </div>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Subscribe to receive personalized Bible chapters with your preferred ASMR voice and delivery settings. 
              Choose how you want to experience God's Word.
            </p>
            <div className="mt-4 text-sm text-gray-300">
              <span className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full">
                Default: Aria voice, Unfinished chapters, Daily delivery
              </span>
            </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {/* Email Input */}
            <div className="mb-8">
              <label htmlFor="email" className="block text-lg font-semibold text-white mb-4">
                <Mail className="w-5 h-5 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
                required
              />
            </div>

            {/* Preferences Toggle */}
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex items-center gap-3 text-white hover:text-yellow-400 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  {showPreferences ? 'Hide' : 'Customize'} Your Preferences
                </span>
              </button>
            </div>

            {/* Preferences Panel */}
            {showPreferences && (
              <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">Subscription Preferences</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* ASMR Model Selection */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      <Headphones className="w-4 h-4 inline mr-2" />
                      ASMR Voice
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="asmrModel"
                          value="aria"
                          checked={asmrModel === 'aria'}
                          onChange={(e) => setAsmrModel(e.target.value as 'aria')}
                          className="w-4 h-4 text-yellow-400"
                        />
                        <span className="text-white">Aria - Soft & Gentle</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="asmrModel"
                          value="heartsease"
                          checked={asmrModel === 'heartsease'}
                          onChange={(e) => setAsmrModel(e.target.value as 'heartsease')}
                          className="w-4 h-4 text-yellow-400"
                        />
                        <span className="text-white">Heartsease - Warm & Soothing</span>
                      </label>
                    </div>
                  </div>

                  {/* Delivery Type */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Chapter Delivery
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="deliveryType"
                          value="unfinished"
                          checked={deliveryType === 'unfinished'}
                          onChange={(e) => setDeliveryType(e.target.value as 'unfinished')}
                          className="w-4 h-4 text-yellow-400"
                        />
                        <span className="text-white">Unfinished Chapters Only</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="deliveryType"
                          value="whole"
                          checked={deliveryType === 'whole'}
                          onChange={(e) => setDeliveryType(e.target.value as 'whole')}
                          className="w-4 h-4 text-yellow-400"
                        />
                        <span className="text-white">Complete Chapters</span>
                      </label>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      <Settings className="w-4 h-4 inline mr-2" />
                      Frequency
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="frequency"
                          value="daily"
                          checked={frequency === 'daily'}
                          onChange={(e) => setFrequency(e.target.value as 'daily')}
                          className="w-4 h-4 text-yellow-400"
                        />
                        <span className="text-white">Daily</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="frequency"
                          value="weekly"
                          checked={frequency === 'weekly'}
                          onChange={(e) => setFrequency(e.target.value as 'weekly')}
                          className="w-4 h-4 text-yellow-400"
                        />
                        <span className="text-white">Weekly</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-12 py-4 rounded-2xl text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                <CheckCircle className="w-5 h-5" />
                Subscribe
                  </>
                )}
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">Subscription Error</span>
                </div>
                <p className="text-red-200 mt-2">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {isSubscribed && (
              <div className="mt-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Thank you for subscribing!</span>
                </div>
                <p className="text-green-200 mt-2">
                  You'll receive {frequency} emails with {asmrModel} voice and {deliveryType} chapters.
                </p>
              </div>
            )}
          </form>
          
          {/* Terms */}
          <div className="text-center mt-8">
            <p className="text-gray-300 text-sm">
              By subscribing, I agree to{' '}
              <a href="/terms" className="text-yellow-400 hover:text-yellow-300 underline">
                Terms of Use
              </a>{' '}
              and acknowledge the{' '}
              <a href="/privacy" className="text-yellow-400 hover:text-yellow-300 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} /* Force refresh */
