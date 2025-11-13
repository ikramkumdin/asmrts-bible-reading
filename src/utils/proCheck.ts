import { User } from '@/lib/firebaseConfig';

/**
 * Check if user has active Pro subscription
 */
export const isProUser = (user: User | null): boolean => {
  if (!user) {
    return false;
  }
  
  // First priority: check user.isPro (handle both boolean true and string "true")
  const isProValue = user.isPro === true || user.isPro === "true";
  if (isProValue) {
    // If there's an end date, check if it hasn't expired
    if (user.proSubscriptionEnd) {
      const endDate = new Date(user.proSubscriptionEnd);
      const now = new Date();
      const isValid = endDate > now;
      return isValid;
    }
    return true;
  }
  
  // Fallback to isPremium check - handle both boolean true and string "true"
  const isPremiumValue = user.isPremium === true || user.isPremium === "true";
  if (isPremiumValue) {
    // If there's an end date, check if it hasn't expired
    if (user.proSubscriptionEnd) {
      const endDate = new Date(user.proSubscriptionEnd);
      const now = new Date();
      const isValid = endDate > now;
      return isValid;
    }
    return true;
  }
  
  return false;
};
