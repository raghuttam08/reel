// Payment Service - PayPal integration
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''

export const paymentService = {
  // Create PayPal order
  createOrder: async (amount, planType) => {
    try {
      const response = await axios.post(`${API_BASE}/api/payments/create-order`, {
        amount,
        planType,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('reel_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  },

  // Capture PayPal order
  captureOrder: async (orderId) => {
    try {
      const response = await axios.post(`${API_BASE}/api/payments/capture-order`, {
        orderId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('reel_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Order capture error:', error)
      throw error
    }
  },

  // Get user subscription status
  getSubscriptionStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/payments/subscription`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('reel_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Subscription status error:', error)
      return { isPremium: false, plan: null }
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      const response = await axios.post(`${API_BASE}/api/payments/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('reel_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Subscription cancellation error:', error)
      throw error
    }
  },

  // Get PayPal Client ID
  getPayPalClientId: () => PAYPAL_CLIENT_ID
}

// Pricing plans
export const UPGRADE_PLANS = {
  premium: {
    name: 'Premium',
    price: 9.99,
    duration: 'month',
    features: [
      'Ad-free experience',
      'Exclusive analysis',
      'Early access to new features',
      'Premium analytics',
    ]
  },
  pro: {
    name: 'Pro',
    price: 19.99,
    duration: 'month',
    features: [
      'Everything in Premium',
      'API access',
      'Custom reports',
      'Priority support',
    ]
  }
}
