'use client';

import React from 'react';
import { X, CreditCard, Shield, Zap } from 'lucide-react';

interface CheckoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  planType?: 'subscription' | 'refill';
  price?: string;
}

const CheckoutConfirmationModal: React.FC<CheckoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Ready to Upgrade?",
  description = "You're about to be redirected to our secure checkout page.",
  planType = 'subscription',
  price
}) => {
  if (!isOpen) return null;

  const getPlanDetails = () => {
    if (planType === 'subscription') {
      return {
        icon: <Zap className="w-6 h-6 text-purple-600" />,
        features: [
          "Play all chapters in sequential order",
          "Download chapters locally for offline access",
          "Unlimited access to all premium features",
          "Priority support",
          "No daily limits"
        ]
      };
    } else {
      return {
        icon: <CreditCard className="w-6 h-6 text-blue-600" />,
        features: [
          "Instant credit refill",
          "Continue creating",
          "No subscription required",
          "Flexible usage"
        ]
      };
    }
  };

  const planDetails = getPlanDetails();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {planDetails.icon}
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Plan Features */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            What you'll get:
          </h3>
          <ul className="space-y-2">
            {planDetails.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Price Display */}
        {price && (
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-purple-600">{price}</div>
            <p className="text-sm text-gray-500">
              {planType === 'subscription' ? 'per year' : 'one-time payment'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue to Checkout
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Maybe Later
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Secure checkout powered by Lemon Squeezy
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmationModal;

