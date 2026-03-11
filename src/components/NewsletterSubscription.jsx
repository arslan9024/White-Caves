import React, { useState } from 'react';
import {
  StyledNewsletterSection,
  StyledNewsletterContainer,
  StyledNewsletterContent,
  StyledNewsletterText,
  StyledNewsletterBenefits,
  StyledNewsletterFormWrapper,
  StyledNewsletterForm,
  StyledFormGroup,
  StyledNewsletterInput,
  StyledNewsletterButton,
  StyledSpinner,
  StyledFormMessage,
  StyledPrivacyNote,
  StyledSubscriberCount,
  StyledSubscriberAvatars,
  StyledMoreSubscribers,
} from './NewsletterSubscription.styles';

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
    <StyledNewsletterSection>
      <StyledNewsletterContainer>
        <StyledNewsletterContent>
          <StyledNewsletterText>
            <h2>Stay Updated on Dubai Real Estate</h2>
            <p>Get exclusive market insights, new listings, and investment opportunities delivered to your inbox weekly.</p>
            <StyledNewsletterBenefits>
              <li>🏠 First access to new property listings</li>
              <li>📊 Weekly market analysis & trends</li>
              <li>💡 Investment tips from experts</li>
              <li>🎁 Exclusive subscriber offers</li>
            </StyledNewsletterBenefits>
          </StyledNewsletterText>
          
          <StyledNewsletterFormWrapper>
            <StyledNewsletterForm onSubmit={handleSubmit}>
              <StyledFormGroup>
                <StyledNewsletterInput
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className={status === 'error' ? 'error' : ''}
                />
                <StyledNewsletterButton 
                  type="submit" 
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <StyledSpinner />
                  ) : (
                    'Subscribe'
                  )}
                </StyledNewsletterButton>
              </StyledFormGroup>
              
              {message && (
                <StyledFormMessage status={status}>{message}</StyledFormMessage>
              )}
            </StyledNewsletterForm>
            
            <StyledPrivacyNote>
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </StyledPrivacyNote>

            <StyledSubscriberCount>
              <StyledSubscriberAvatars>
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" />
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" />
                <StyledMoreSubscribers>+</StyledMoreSubscribers>
              </StyledSubscriberAvatars>
              <span>Join <strong>12,000+</strong> subscribers</span>
            </StyledSubscriberCount>
          </StyledNewsletterFormWrapper>
        </StyledNewsletterContent>
      </StyledNewsletterContainer>
    </StyledNewsletterSection>
  );
}
