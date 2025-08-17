'use client';

import { Info, X } from 'lucide-react';

interface SubscriptionBannerProps {
  onClose: () => void;
}

export default function SubscriptionBanner({ onClose }: SubscriptionBannerProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 mx-4 mb-8 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            Subscribe all to my email?{' '}
            <a 
              href="#email-signup" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Click here!
            </a>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
} 