import React, { FC, useEffect, useRef, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createLogger } from '../utils/logger';
import { authFetch } from '../utils/authFetch';
import {
  CheckoutContainerStyled,
  CheckoutFormStyled,
  PaymentDetailsSection,
  PropertySummary,
  ErrorMessage,
  CheckoutActions,
  SubmitBtn,
  CancelBtn,
  CheckoutLoadingContainer,
  SpinnerStyled,
  LoadingText,
  CheckoutErrorContainer,
  ConfigErrorText
} from './Checkout.styles';

interface Property {
  id?: string;
  title?: string;
}

interface CheckoutFormProps {
  property?: Property;
  amount?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CheckoutProps {
  property?: Property;
  amount?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

let stripePromise: Promise<Stripe | null>;
const checkoutLog = createLogger('Checkout');
if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
} else {
  checkoutLog.warn('VITE_STRIPE_PUBLIC_KEY not set — payment processing is disabled. Set this environment variable to enable Stripe checkout.');
  stripePromise = Promise.resolve(null);
}

const CheckoutForm: FC<CheckoutFormProps> = ({ property, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Payment system is not initialized. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (!isMountedRef.current) return;

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
      } else {
        onSuccess?.();
      }
    } catch (err) {
      if (isMountedRef.current) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setErrorMessage(message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <CheckoutFormStyled onSubmit={handleSubmit}>
      <PaymentDetailsSection>
        <h3>Payment Details</h3>
        <PropertySummary>
          <p><strong>Property:</strong> {property?.title}</p>
          <p><strong>Amount:</strong> AED {amount?.toLocaleString()}</p>
        </PropertySummary>
      </PaymentDetailsSection>
      
      <PaymentElement />
      
      {errorMessage && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
      
      <CheckoutActions>
        <CancelBtn 
          type="button" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </CancelBtn>
        <SubmitBtn 
          type="submit" 
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay AED ${amount?.toLocaleString()}`}
        </SubmitBtn>
      </CheckoutActions>
    </CheckoutFormStyled>
  );
};

const Checkout: FC<CheckoutProps> = ({ property, amount, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const createPaymentIntent = async () => {
      try {
        const response = await authFetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            propertyId: property?.id,
            propertyTitle: property?.title,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errData: Record<string, unknown> = {};
          try {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
              errData = await response.json();
            }
          } catch {
            // Silently fail to parse non-JSON error responses
          }
          if (!controller.signal.aborted) {
            setError((errData?.error as string) || `Payment initialization failed (HTTP ${response.status})`);
            setIsLoading(false);
          }
          return;
        }

        const data = await response.json();
        
        if (controller.signal.aborted) return;

        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

        if (!data.clientSecret || typeof data.clientSecret !== 'string') {
          setError('Invalid payment configuration from server');
          setIsLoading(false);
          return;
        }
        
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError('Failed to initialize payment. Please try again.');
        setIsLoading(false);
      }
    };

    if (amount && amount > 0) {
      createPaymentIntent();
    }

    return () => { controller.abort(); };
  }, [amount, property]);

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <CheckoutContainerStyled>
        <CheckoutErrorContainer>
          <h3>Payment System Not Configured</h3>
          <ConfigErrorText>Stripe API keys are required to process payments. Please configure your environment variables.</ConfigErrorText>
          <CancelBtn onClick={onCancel}>Close</CancelBtn>
        </CheckoutErrorContainer>
      </CheckoutContainerStyled>
    );
  }

  if (isLoading) {
    return (
      <CheckoutContainerStyled>
        <CheckoutLoadingContainer>
          <SpinnerStyled />
          <LoadingText>Initializing payment...</LoadingText>
        </CheckoutLoadingContainer>
      </CheckoutContainerStyled>
    );
  }

  if (error) {
    return (
      <CheckoutContainerStyled>
        <CheckoutErrorContainer>
          <h3>Error</h3>
          <p>{error}</p>
          <CancelBtn onClick={onCancel}>Close</CancelBtn>
        </CheckoutErrorContainer>
      </CheckoutContainerStyled>
    );
  }

  if (!clientSecret || !stripePromise) {
    return null;
  }

  return (
    <CheckoutContainerStyled>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm 
          property={property} 
          amount={amount} 
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </CheckoutContainerStyled>
  );
};

export default Checkout;
