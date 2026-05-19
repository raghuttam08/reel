export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', padding: '60px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 40, fontWeight: 700, color: '#1a1a1a', marginBottom: 40 }}>
        Privacy Policy
      </h1>

      <p style={{ fontSize: 13, color: '#999', marginBottom: 40 }}>
        Last updated: May 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* 1. Introduction */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            1. Introduction
          </h2>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8 }}>
            At reel, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our service.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            2. Information We Collect
          </h2>
          <div style={{ marginLeft: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 12 }}>
              Personal Information You Provide:
            </h3>
            <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.8, paddingLeft: 20, marginBottom: 20 }}>
              <li>Account information (username, email, password)</li>
              <li>Profile information you choose to share</li>
              <li>Reactions and posts you create</li>
              <li>Watchlist and viewing history</li>
              <li>Payment information (for premium subscriptions)</li>
            </ul>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 12 }}>
              Information Collected Automatically:
            </h3>
            <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>IP address and browser information</li>
              <li>Pages visited and time spent</li>
              <li>Device information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </section>

        {/* 3. How We Use Your Information */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            3. How We Use Your Information
          </h2>
          <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>To provide and maintain our service</li>
            <li>To process your transactions</li>
            <li>To send you updates and notifications (with your consent)</li>
            <li>To improve our platform and user experience</li>
            <li>To detect and prevent fraud</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        {/* 4. Data Sharing */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            4. Data Sharing
          </h2>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 12 }}>
            We do <strong>not</strong> sell your personal information. We may share data only:
          </p>
          <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>With service providers who assist us (payment processors, hosting providers)</li>
            <li>When required by law or court order</li>
            <li>To protect our rights and prevent harm</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        {/* 5. Data Security */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            5. Data Security
          </h2>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8 }}>
            We implement reasonable security measures to protect your information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        {/* 6. Your Rights */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            6. Your Rights
          </h2>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 12 }}>
            You have the right to:
          </p>
          <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>
        </section>

        {/* 7. Cookies */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            7. Cookies
          </h2>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8 }}>
            We use cookies to enhance your experience. You can control cookie settings in your browser. Some features may not work properly if you disable cookies.
          </p>
        </section>

        {/* 8. Third-Party Services */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            8. Third-Party Services
          </h2>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8 }}>
            Our service may include links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before providing any information.
          </p>
        </section>

        {/* 9. Contact Us */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            9. Contact Us
          </h2>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8 }}>
            If you have questions about this Privacy Policy, please <a href="/contact" style={{ color: '#d4a853', textDecoration: 'none' }}>contact us</a>.
          </p>
        </section>

        {/* 10. Changes */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
            10. Changes to This Policy
          </h2>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8 }}>
            We may update this Privacy Policy from time to time. We'll notify you of significant changes by email or through our website.
          </p>
        </section>
      </div>
    </div>
  )
}
