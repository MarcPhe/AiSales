import '../styles/Landing.css';

export default function Landing({ onNavigateToLogin, onNavigateToRegister }) {
  const handleBookDemo = () => {
    // Open Calendly in a new tab
    // Replace 'your_username' with your actual Calendly username
    window.open('https://calendly.com/your_username', '_blank');
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <div className="landing-logo">Arc ai</div>
          <div className="nav-buttons">
            <button 
              className="nav-login-btn"
              onClick={onNavigateToLogin}
            >
              Login
            </button>
            <button 
              className="nav-signup-btn"
              onClick={onNavigateToRegister}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Powered Sales Assistant for Your Business
            </h1>
            <p className="hero-subtitle">
              Deploy an intelligent chatbot on your website in minutes. Engage visitors, qualify leads, and close more deals with conversational AI.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-demo"
                onClick={handleBookDemo}
              >
                📅 Book a Demo
              </button>
              <button 
                className="btn-signup"
                onClick={onNavigateToRegister}
              >
                Get Started Free
              </button>
            </div>
            <p className="hero-subtext">No credit card required. 14-day free trial.</p>
          </div>
          <div className="hero-visual">
            <div className="hero-placeholder">
              <div className="chat-preview">
                <div className="chat-header">AI Assistant</div>
                <div className="chat-bubble bot">
                  👋 Hi there! How can I help you today?
                </div>
                <div className="chat-bubble user">
                  Tell me about your pricing
                </div>
                <div className="chat-bubble bot">
                  📊 We have flexible plans starting at $29/month...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-container">
          <h2 className="section-title">Why Choose Arc ai?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Easy Embed</h3>
              <p>Deploy to your website with a single line of code. No technical setup required.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered</h3>
              <p>Powered by advanced language models to have natural, helpful conversations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-Time Analytics</h3>
              <p>Track conversations, engagement metrics, and lead quality in your dashboard.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Lead Qualification</h3>
              <p>Automatically qualify leads and gather customer information 24/7.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Fully Customizable</h3>
              <p>Customize behavior, appearance, and tone to match your brand.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Enterprise Security</h3>
              <p>End-to-end encryption and compliance with GDPR and SOC 2.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how-it-works">
        <div className="landing-container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account and set up your business profile in 2 minutes.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Configure</h3>
              <p>Customize your AI assistant's behavior and appearance.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Deploy</h3>
              <p>Copy your embed code and paste it into your website.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Analyze</h3>
              <p>Monitor conversations and engagement in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="landing-pricing">
        <div className="landing-container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-badge">Starter</div>
              <div className="pricing-amount">
                <span className="currency">$</span>
                <span className="amount">29</span>
                <span className="period">/month</span>
              </div>
              <ul className="pricing-features">
                <li>✓ 1 Widget</li>
                <li>✓ Up to 1,000 conversations/month</li>
                <li>✓ Basic analytics</li>
                <li>✓ Email support</li>
              </ul>
              <button className="pricing-btn">Get Started</button>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge">Professional</div>
              <div className="pricing-amount">
                <span className="currency">$</span>
                <span className="amount">99</span>
                <span className="period">/month</span>
              </div>
              <ul className="pricing-features">
                <li>✓ 5 Widgets</li>
                <li>✓ Unlimited conversations</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
                <li>✓ Custom branding</li>
              </ul>
              <button className="pricing-btn featured-btn">Get Started</button>
            </div>
            <div className="pricing-card">
              <div className="pricing-badge">Enterprise</div>
              <div className="pricing-amount">Custom</div>
              <ul className="pricing-features">
                <li>✓ Unlimited widgets</li>
                <li>✓ Unlimited conversations</li>
                <li>✓ Custom integrations</li>
                <li>✓ Dedicated support</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <button 
                className="pricing-btn"
                onClick={handleBookDemo}
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-container">
          <h2>Ready to Boost Your Sales?</h2>
          <p>Start your free 14-day trial today. No credit card required.</p>
          <button 
            className="btn-cta-large"
            onClick={onNavigateToRegister}
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#" onClick={handleBookDemo}>Demo</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Arc ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
