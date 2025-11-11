'use client';

import { BookOpen, ArrowRight, CheckCircle, Plus, X, Mail, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTracking } from '@/contexts/TrackingContext';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import Link from 'next/link';
import { 
  isBookSubscribed, 
  subscribeToBook, 
  unsubscribeFromBook,
  type BookSubscriptionData 
} from '@/lib/emailService';

interface BibleBook {
  id: string;
  title: string;
  description: string;
  chapters?: number;
  progress?: number;
  status: 'completed' | 'available' | 'in-progress';
  action: 'arrow' | 'read' | 'resume';
  isSelected: boolean;
}

interface BibleBookCardProps {
  book: BibleBook;
  onSubscriptionChange?: (bookId: string, isSubscribed: boolean) => void;
}

export default function BibleBookCard({ book, onSubscriptionChange }: BibleBookCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { getBookProgress } = useTracking();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly'>('weekly');
  const [selectedAsmrModel, setSelectedAsmrModel] = useState<'aria' | 'heartsease'>('aria');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<'unfinished' | 'whole'>('unfinished');
  
  useEffect(() => {
    setIsClient(true);
    if (isAuthenticated && user?.email) {
      checkSubscriptionStatus();
    }
  }, [isAuthenticated, user, book.id]);
  
  const checkSubscriptionStatus = () => {
    if (user?.email) {
      const subscribed = isBookSubscribed(user.email, book.id);
      setIsSubscribed(subscribed);
    }
  };
  
  // Get book progress from tracking system
  const bookProgress = isClient ? getBookProgress(book.id) : null;

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const handleToggleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!user?.email) {
      alert('Please ensure you have an email address associated with your account.');
      return;
    }

    if (isSubscribed) {
      // Unsubscribe
      setIsLoading(true);
      try {
        const result = await unsubscribeFromBook(user.email, book.id);
        if (result.success) {
          setIsSubscribed(false);
          onSubscriptionChange?.(book.id, false);
        } else {
          alert(result.message || 'Failed to unsubscribe. Please try again.');
        }
      } catch (error) {
        console.error('Unsubscribe error:', error);
        alert('Failed to unsubscribe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Show frequency selection modal
      setShowFrequencyModal(true);
    }
  };

  const handleSubscribe = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      const result = await subscribeToBook(
        user.email,
        book.id,
        book.title,
        selectedAsmrModel,
        selectedDeliveryType,
        selectedFrequency
      );
      
      if (result.success) {
        setIsSubscribed(true);
        setShowFrequencyModal(false);
        onSubscriptionChange?.(book.id, true);
      } else {
        alert(result.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAction = () => {
    switch (book.action) {
      case 'read':
        return (
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            Read Now
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      case 'resume':
        return (
          <div className="text-blue-600 flex items-center gap-2 cursor-pointer hover:text-blue-700">
            Resume
            <ArrowRight className="w-4 h-4" />
          </div>
        );
      default:
        return <ArrowRight className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderProgress = () => {
    // Always show basic chapter count to avoid hydration issues
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <BookOpen className="w-4 h-4" />
        <span>{book.chapters || 'Multiple'} chapters</span>
      </div>
    );
  };

  const CardContent = () => (
    <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{book.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{book.description}</p>
          
          {renderProgress()}
        </div>
        
        {/* Toggle Switch */}
        <div className="ml-4" onClick={handleToggleClick}>
          <div className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
            isSubscribed ? 'bg-yellow-500' : 'bg-gray-300'
          } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
              isSubscribed ? 'translate-x-6' : 'translate-x-0.5'
            } flex items-center justify-center`}>
              {isSubscribed ? (
                <CheckCircle className="w-3 h-3 text-yellow-600" />
              ) : (
                <Plus className="w-3 h-3 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end">
        {renderAction()}
      </div>
    </div>
  );

  return (
    <>
      {isAuthenticated ? (
        <Link href={`/bible/${book.id.toLowerCase()}`}>
          <CardContent />
        </Link>
      ) : (
        <div onClick={handleCardClick}>
          <CardContent />
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-xl w-full">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-200 hover:bg-gray-50 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <LoginForm
              onLoginSuccess={() => {
                setShowLoginModal(false);
                checkSubscriptionStatus();
              }}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Frequency Selection Modal */}
      {showFrequencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowFrequencyModal(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-200 hover:bg-gray-50 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to {book.title}</h3>
              <p className="text-gray-600">Choose your email preferences for this book</p>
            </div>

            {/* Frequency Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Email Frequency
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedFrequency('daily')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedFrequency === 'daily'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">Daily</div>
                  <div className="text-xs mt-1">Every day</div>
                </button>
                <button
                  onClick={() => setSelectedFrequency('weekly')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedFrequency === 'weekly'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">Weekly</div>
                  <div className="text-xs mt-1">Once a week</div>
                </button>
              </div>
            </div>

            {/* ASMR Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">ASMR Voice</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedAsmrModel('aria')}
                  className={`p-3 rounded-xl border-2 transition-all text-sm ${
                    selectedAsmrModel === 'aria'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Aria
                </button>
                <button
                  onClick={() => setSelectedAsmrModel('heartsease')}
                  className={`p-3 rounded-xl border-2 transition-all text-sm ${
                    selectedAsmrModel === 'heartsease'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Heartsease
                </button>
              </div>
            </div>

            {/* Delivery Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Chapter Delivery</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedDeliveryType('unfinished')}
                  className={`p-3 rounded-xl border-2 transition-all text-sm ${
                    selectedDeliveryType === 'unfinished'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Unfinished
                </button>
                <button
                  onClick={() => setSelectedDeliveryType('whole')}
                  className={`p-3 rounded-xl border-2 transition-all text-sm ${
                    selectedDeliveryType === 'whole'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Complete
                </button>
              </div>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Subscribe to {book.title}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
