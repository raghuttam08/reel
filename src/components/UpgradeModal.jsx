import { useState, useEffect } from 'react'
import { paymentService, UPGRADE_PLANS } from '../lib/payment'
import { useAuth } from '../lib/AuthContext'

export default function UpgradeModal({ isOpen, onClose, onSuccess }) {
  const { updateSubscription } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paypalScriptLoaded, setPaypalScriptLoaded] = useState(false)

  // Load PayPal script
  useEffect(() => {
    const clientId = paymentService.getPayPalClientId()
    if (!clientId) {
      setError('PayPal not configured. Please contact support.')
      return
    }

    // Check if PayPal script already loaded
    if (window.paypal) {
      setPaypalScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
    script.onload = () => {
      setPaypalScriptLoaded(true)
    }
    script.onerror = () => {
      setError('Failed to load PayPal. Please try again.')
    }
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const handlePaymentFlow = async () => {
    setLoading(true)
    setError(null)

    try {
      const planData = UPGRADE_PLANS[selectedPlan]
      
      if (!window.paypal || !window.paypal.Buttons) {
        setError('PayPal is not ready. Please refresh and try again.')
        setLoading(false)
        return
      }

      // Create PayPal order
      const orderResponse = await paymentService.createOrder(
        planData.price * 100,
        selectedPlan
      )

      const orderId = orderResponse.id

      // Initialize and render PayPal buttons
      window.paypal.Buttons({
        createOrder: () => {
          return orderId
        },
        onApprove: async (data) => {
          try {
            const captureResponse = await paymentService.captureOrder(orderId)
            
            if (captureResponse.success) {
              updateSubscription(selectedPlan)
              onSuccess(selectedPlan)
              onClose()
            }
          } catch (err) {
            setError('Payment capture failed: ' + err.message)
            setLoading(false)
          }
        },
        onError: (err) => {
          setError('PayPal error: ' + err)
          setLoading(false)
        }
      }).render('#paypal-button-container')
      
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Payment setup failed. Please try again.')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const selectedPlanData = UPGRADE_PLANS[selectedPlan]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        maxWidth: 500,
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a' }}>
            Upgrade to Premium
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#999',
            }}
          >
            ✕
          </button>
        </div>

        {/* Plan Selection */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', marginBottom: 12 }}>
            Select Plan
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {Object.entries(UPGRADE_PLANS).map(([key, plan]) => (
              <button
                key={key}
                onClick={() => setSelectedPlan(key)}
                style={{
                  flex: 1,
                  padding: 12,
                  border: selectedPlan === key ? '2px solid #d4a853' : '1px solid #ddd',
                  borderRadius: 8,
                  background: selectedPlan === key ? '#f5f0e8' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                  {plan.name}
                </p>
                <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  ${plan.price}/{plan.duration}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', marginBottom: 12 }}>
            Features
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {selectedPlanData.features.map((feature, i) => (
              <li
                key={i}
                style={{
                  padding: '8px 0',
                  fontSize: 13,
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ color: '#d4a853', fontWeight: 600 }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Card Details */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', marginBottom: 12 }}>
            Payment Method
          </p>
          {paypalScriptLoaded ? (
            <div
              id="paypal-button-container"
              style={{
                marginBottom: 12,
                minHeight: 100,
              }}
            />
          ) : (
            <div style={{
              padding: 16,
              backgroundColor: '#f5f5f5',
              borderRadius: 6,
              textAlign: 'center',
              color: '#666',
              fontSize: 13,
            }}>
              Loading PayPal...
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: 12,
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 6,
            color: '#c00',
            fontSize: 12,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: 8,
              background: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              color: '#333',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentFlow}
            disabled={loading || !paypalScriptLoaded}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderRadius: 8,
              background: (loading || !paypalScriptLoaded) ? '#ccc' : '#d4a853',
              cursor: (loading || !paypalScriptLoaded) ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: 13,
              color: '#fff',
              opacity: (loading || !paypalScriptLoaded) ? 0.6 : 1,
            }}
          >
            {loading ? 'Processing...' : `Pay $${selectedPlanData.price}`}
          </button>
        </div>
      </div>
    </div>
  )
}
