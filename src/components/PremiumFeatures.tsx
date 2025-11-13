'use client';

import { Check, Play, Download, Crown, Lock, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CheckoutConfirmationModal from '@/components/common/CheckoutConfirmationModal';
import axios from 'axios';
import { isProUser } from '@/utils/proCheck';

interface PremiumFeaturesProps {
  onPlayAll?: () => void;
  onDownloadAll?: () => void;
  isPlayingAll?: boolean;
  isDownloading?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumFeatures({
  onPlayAll,
  onDownloadAll,
  isPlayingAll = false,
  isDownloading = false,
  isOpen,
  onClose
}: PremiumFeaturesProps) {
  const { user, isAuthenticated } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isPremium = isProUser(user);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen || showCheckoutModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, showCheckoutModal]);

  const handleUpgrade = () => {
    setShowCheckoutModal(true);
  };

  const confirmCheckout = async () => {
    if (!user?.uid) {
      alert('Please sign in to upgrade to Pro');
      return;
    }

    setIsLoading(true);
    try {
      // Get current page URL to return to after payment
      const returnUrl = typeof window !== 'undefined' 
        ? window.location.pathname + window.location.search 
        : '/bible';
      
      const response = await axios.post("/api/purchaseProduct", {
        user_id: user.uid,
        returnUrl: returnUrl,
      });

      if (response.data.checkoutUrl) {
        window.open(response.data.checkoutUrl, "_blank");
        setShowCheckoutModal(false);
        onClose(); // Close premium features modal too
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error("Failed to initiate subscription:", error);
      alert("Failed to open checkout page. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-6 h-6 text-yellow-300" />
              </div>
              <h3 className="text-xl font-bold">Have Full Experience</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isAuthenticated ? (
              <>
                <p className="text-gray-600 mb-6 text-center">
                  Unlock premium features to enhance your Bible reading experience
                </p>
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Upgrade to Pro'}
                </button>
              </>
            ) : !isPremium ? (
              <>
                <p className="text-gray-600 mb-6 text-center">
                  Upgrade to premium to unlock all features and enhance your Bible reading journey
                </p>
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Upgrade to Pro'}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-medium">
                    PRO
                  </span>
                  <span className="text-sm text-gray-600">Premium features unlocked</span>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={onPlayAll}
                    disabled={isPlayingAll}
                    className="w-full flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200 hover:border-purple-400 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Play className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-gray-900">Play All Chapters</span>
                        </div>
                        <p className="text-xs text-gray-500">Sequential playback</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                      {isPlayingAll ? 'Playing...' : 'Play All'}
                    </span>
                  </button>

                  <button
                    onClick={onDownloadAll}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200 hover:border-purple-400 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Download className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-gray-900">Download Locally</span>
                        </div>
                        <p className="text-xs text-gray-500">Offline access</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                      {isDownloading ? 'Downloading...' : 'Download All'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Confirmation Modal */}
      <CheckoutConfirmationModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={confirmCheckout}
        title="Upgrade to Pro Plan"
        description="Get unlimited access to premium features including sequential chapter playback and offline downloads."
        planType="subscription"
        price="$2.99"
      />
    </>
  );
}

