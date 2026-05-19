import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate form
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      // In a real app, you'd send this to a backend endpoint
      // For now, we'll just show a success message
      console.log('Form submitted:', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{
          fontSize: 40,
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: 12
        }}>
          Get in Touch
        </h1>
        <p style={{ fontSize: 16, color: '#666' }}>
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      {submitted && (
        <div style={{
          padding: 16,
          backgroundColor: '#e8f5e9',
          border: '1px solid #4caf50',
          borderRadius: 8,
          color: '#2e7d32',
          marginBottom: 24,
          textAlign: 'center',
          fontSize: 14
        }}>
          ✓ Thank you for your message! We'll get back to you soon.
        </div>
      )}

      {error && (
        <div style={{
          padding: 16,
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: 8,
          color: '#c00',
          marginBottom: 24,
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Name */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: 8
          }}>
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            style={{
              width: '100%',
              padding: '12px 14px',
              background: '#f9f7f4',
              border: '1px solid #e8e1d9',
              borderRadius: 8,
              fontSize: 14,
              color: '#1a1a1a',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#d4a853'}
            onBlur={e => e.target.style.borderColor = '#e8e1d9'}
          />
        </div>

        {/* Email */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: 8
          }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              background: '#f9f7f4',
              border: '1px solid #e8e1d9',
              borderRadius: 8,
              fontSize: 14,
              color: '#1a1a1a',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#d4a853'}
            onBlur={e => e.target.style.borderColor = '#e8e1d9'}
          />
        </div>

        {/* Subject */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: 8
          }}>
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is this about?"
            style={{
              width: '100%',
              padding: '12px 14px',
              background: '#f9f7f4',
              border: '1px solid #e8e1d9',
              borderRadius: 8,
              fontSize: 14,
              color: '#1a1a1a',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#d4a853'}
            onBlur={e => e.target.style.borderColor = '#e8e1d9'}
          />
        </div>

        {/* Message */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: 8
          }}>
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={6}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: '#f9f7f4',
              border: '1px solid #e8e1d9',
              borderRadius: 8,
              fontSize: 14,
              color: '#1a1a1a',
              outline: 'none',
              transition: 'all 0.2s',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
            onFocus={e => e.target.style.borderColor = '#d4a853'}
            onBlur={e => e.target.style.borderColor = '#e8e1d9'}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 20px',
            background: '#d4a853',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={e => !loading && (e.target.style.opacity = 0.9)}
          onMouseLeave={e => !loading && (e.target.style.opacity = 1)}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Additional Info */}
      <div style={{
        marginTop: 50,
        padding: 24,
        background: '#f5f0e8',
        borderRadius: 12,
        textAlign: 'center'
      }}>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
          <strong>Email:</strong> hello@reel.com<br />
          <strong>Response time:</strong> Usually within 24 hours
        </p>
      </div>
    </div>
  )
}
