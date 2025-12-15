import React, { useState } from 'react';
import './NewsletterSubscription.css';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you for subscribing! Check your inbox for a confirmation email.');
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }, 1500);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2>Stay Updated on Dubai Real Estate</h2>
            <p>Get exclusive market insights, new listings, and investment opportunities delivered to your inbox weekly.</p>
            <ul className="newsletter-benefits">
              <li>🏠 First access to new property listings</li>
              <li>📊 Weekly market analysis & trends</li>
              <li>💡 Investment tips from experts</li>
              <li>🎁 Exclusive subscriber offers</li>
            </ul>
          </div>
          
          <div className="newsletter-form-wrapper">
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className={status === 'error' ? 'error' : ''}
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className={status === 'loading' ? 'loading' : ''}
                >
                  {status === 'loading' ? (
                    <span className="spinner"></span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
              
              {message && (
                <p className={`form-message ${status}`}>{message}</p>
              )}
            </form>
            
            <p className="privacy-note">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>

            <div className="subscriber-count">
              <div className="subscriber-avatars">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" />
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" />
                <span className="more-subscribers">+</span>
              </div>
              <span>Join <strong>12,000+</strong> subscribers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
