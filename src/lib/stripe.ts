import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Initialize Stripe server-side instance (only on server)
export const getServerStripe = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Server-side Stripe instance should not be used on the client');
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16' as any, // Use the latest API version
  });
};

// Initialize Stripe client-side instance
let stripePromise: Promise<any> | null = null;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  }
  return stripePromise;
};

// Define subscription plan IDs
export const SUBSCRIPTION_PLANS = {
  MONTHLY: process.env.STRIPE_MONTHLY_PLAN_ID as string,
  YEARLY: process.env.STRIPE_YEARLY_PLAN_ID as string,
};

// Define subscription plan prices (for display purposes)
export const PLAN_PRICES = {
  MONTHLY: 29.99,
  YEARLY: 299.99, // ~$25/month, billed annually
};