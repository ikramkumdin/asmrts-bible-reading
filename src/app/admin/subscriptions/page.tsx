'use client';

import { useState, useEffect } from 'react';
import { Mail, Headphones, BookOpen, Settings, Trash2, Eye, DollarSign, Receipt, Calculator } from 'lucide-react';
import { getLocalSubscriptions, removeSubscriptionLocally, type SubscriptionData, calculateSubscriptionCost } from '@/lib/emailService';

interface SubscriptionWithId extends SubscriptionData {
  id: string;
  subscribedAt: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithId[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionWithId | null>(null);

  useEffect(() => {
    setSubscriptions(getLocalSubscriptions());
  }, []);

  const handleDelete = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (subscription) {
      removeSubscriptionLocally(subscription.email);
      setSubscriptions(getLocalSubscriptions());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Subscriptions</h1>
              <p className="text-gray-600">Manage user email subscriptions and preferences</p>
            </div>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No subscriptions yet</h3>
              <p className="text-gray-500">Users haven't subscribed to email notifications yet.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Eye className="w-5 h-5" />
                    <span className="font-semibold">{subscriptions.length} Total Subscriptions</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{subscription.email}</h3>
                            <p className="text-sm text-gray-500">Subscribed on {formatDate(subscription.subscribedAt)}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Headphones className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">ASMR Voice</span>
                            </div>
                            <p className="text-sm text-gray-600 capitalize">
                              {subscription.asmrModel === 'aria' ? 'Aria - Soft & Gentle' : 'Heartsease - Warm & Soothing'}
                            </p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-700">Delivery</span>
                            </div>
                            <p className="text-sm text-gray-600 capitalize">
                              {subscription.deliveryType === 'unfinished' ? 'Unfinished Chapters Only' : 'Complete Chapters'}
                            </p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Settings className="w-4 h-4 text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">Frequency</span>
                            </div>
                            <p className="text-sm text-gray-600 capitalize">
                              {subscription.frequency === 'daily' ? 'Daily' : 'Weekly'}
                            </p>
                          </div>
                        </div>

                        {/* Cost Card for New Subscriptions */}
                        {(subscription.isNew === true || subscription.isNew === undefined) && (
                          <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <DollarSign className="w-5 h-5 text-purple-600" />
                              <span className="text-sm font-semibold text-gray-800">Subscription Cost</span>
                              {subscription.isNew && (
                                <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              {subscription.receiptAmount ? (
                                <div className="flex items-center gap-2">
                                  <Receipt className="w-4 h-4 text-green-600" />
                                  <div>
                                    <p className="text-xs text-gray-600">Receipt Amount</p>
                                    <p className="text-lg font-bold text-green-700">${subscription.receiptAmount.toFixed(2)}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Calculator className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <p className="text-xs text-gray-600">Calculated Cost</p>
                                    <p className="text-lg font-bold text-blue-700">
                                      ${(subscription.calculatedCost ?? calculateSubscriptionCost(
                                        subscription.asmrModel,
                                        subscription.deliveryType,
                                        subscription.frequency
                                      )).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="text-right">
                                <p className="text-xs text-gray-500">per month</p>
                              </div>
                            </div>
                            {subscription.receiptAmount && subscription.calculatedCost && (
                              <div className="mt-2 pt-2 border-t border-purple-200">
                                <p className="text-xs text-gray-600">
                                  Calculated: ${subscription.calculatedCost.toFixed(2)} | 
                                  Receipt: ${subscription.receiptAmount.toFixed(2)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(subscription.id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove subscription"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

