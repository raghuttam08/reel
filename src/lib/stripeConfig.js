/**
 * STRIPE PAYMENT INTEGRATION SETUP GUIDE
 * 
 * This file contains configuration for integrating Stripe as your payment gateway.
 * Follow these steps to set up the payment system:
 */

/**
 * FRONTEND SETUP (Already Done):
 * 1. ✅ Installed: stripe, @stripe/react-stripe-js, @stripe/js, axios
 * 2. ✅ Created: UpgradeModal component with payment form
 * 3. ✅ Created: Payment service (lib/payment.js)
 * 4. ✅ Added: Upgrade button in ShowPage.jsx
 */

/**
 * BACKEND SETUP REQUIRED:
 * 
 * You'll need to create these API endpoints in your backend:
 * 
 * 1. POST /api/payments/create-intent
 *    - Creates a Stripe payment intent
 *    - Request body: { amount, planType }
 *    - Response: { clientSecret, paymentIntentId }
 * 
 * 2. POST /api/payments/confirm
 *    - Confirms the payment
 *    - Request body: { paymentIntentId, paymentMethodId }
 *    - Response: { success, plan, expiryDate }
 * 
 * 3. GET /api/payments/subscription
 *    - Gets user's subscription status
 *    - Response: { isPremium, plan, expiryDate }
 * 
 * 4. POST /api/payments/webhook
 *    - Stripe webhook for payment updates
 *    - Handles payment.intent.succeeded events
 */

/**
 * STRIPE KEYS SETUP:
 * 
 * 1. Create a Stripe account at https://stripe.com
 * 2. Get your API keys from the Stripe dashboard
 * 3. Add to your backend .env file:
 *    STRIPE_SECRET_KEY=sk_test_...
 *    STRIPE_PUBLISHABLE_KEY=pk_test_...
 */

/**
 * BACKEND EXAMPLE (Node.js/Express):
 * 
 * // Install: npm install stripe dotenv
 * 
 * const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
 * 
 * // Create Payment Intent
 * app.post('/api/payments/create-intent', async (req, res) => {
 *   const { amount, planType } = req.body
 *   const intent = await stripe.paymentIntents.create({
 *     amount: amount * 100, // Stripe uses cents
 *     currency: 'usd',
 *     metadata: { planType }
 *   })
 *   res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id })
 * })
 * 
 * // Confirm Payment
 * app.post('/api/payments/confirm', async (req, res) => {
 *   const { paymentIntentId } = req.body
 *   const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
 *   
 *   if (intent.status === 'succeeded') {
 *     // Update user's subscription in database
 *     await User.findByIdAndUpdate(req.user.id, {
 *       isPremium: true,
 *       plan: intent.metadata.planType,
 *       subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 *     })
 *     res.json({ success: true, plan: intent.metadata.planType })
 *   } else {
 *     res.status(400).json({ success: false, error: 'Payment failed' })
 *   }
 * })
 */

// Configuration object for different environments
export const STRIPE_CONFIG = {
  development: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    apiUrl: 'http://localhost:3000/api',
  },
  production: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    apiUrl: process.env.REACT_APP_API_URL,
  }
}

// Current environment config
export const stripeConfig = STRIPE_CONFIG[process.env.NODE_ENV || 'development']

// Payment status enum
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
}

// Subscription plans metadata
export const SUBSCRIPTION_PLANS = {
  premium: {
    id: 'price_premium_monthly',
    name: 'Premium',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    stripeProductId: 'prod_premium',
    stripePriceId: 'price_premium_monthly',
  },
  pro: {
    id: 'price_pro_monthly',
    name: 'Pro',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    stripeProductId: 'prod_pro',
    stripePriceId: 'price_pro_monthly',
  }
}
