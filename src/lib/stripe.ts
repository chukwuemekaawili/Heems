// Stripe Client Configuration
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
export const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

// Stripe configuration
export const STRIPE_CONFIG = {
    currency: 'gbp',
    country: 'GB',
    locale: 'en-GB',
};

// Helper to get Stripe instance
export async function getStripe(): Promise<Stripe | null> {
    return await stripePromise;
}
