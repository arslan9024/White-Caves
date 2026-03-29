import React, { useState, useRef, useEffect } from 'react';
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const isMountedRef = useRef(true);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    const t1 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setStatus('success');
      setMessage('Thank you for subscribing! Check your inbox for a confirmation email.');
      setEmail('');
      
      const t2 = setTimeout(() => {
        if (!isMountedRef.current) return;
        setStatus('idle');
        setMessage('');
      }, 5000);
      // Push t2 immediately so cleanup can clear it even if component unmounts before t1 fires
      timeoutRefs.current.push(t2);
    }, 1500);
    // Both timeouts are tracked for cleanup
    timeoutRefs.current.push(t1);
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
                <StyledFormMessage $status={status === 'success' || status === 'error' ? status : undefined}>{message}</StyledFormMessage>
              )}
            </StyledNewsletterForm>
            
            <StyledPrivacyNote>
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </StyledPrivacyNote>

            <StyledSubscriberCount>
              <StyledSubscriberAvatars>
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" loading="lazy" />
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" loading="lazy" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Subscriber" loading="lazy" />
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
