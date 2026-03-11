import React, { FC, useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
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
if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
} else {
  console.warn('VITE_STRIPE_PUBLIC_KEY not found. Payment processing will not work until this is set.');
  stripePromise = Promise.resolve(null);
}

const CheckoutForm: FC<CheckoutFormProps> = ({ property, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
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

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setIsProcessing(false);
      } else {
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <CheckoutFormStyled onSubmit={handleSubmit}>
      <PaymentDetailsSection>
        <h3>Payment Details</h3>
        <PropertySummary>
          <p><strong>Property:</strong> {property?.title}</p>
          <p><strong>Amount:</strong> ${amount?.toLocaleString()}</p>
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
          {isProcessing ? 'Processing...' : `Pay $${amount?.toLocaleString()}`}
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
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            propertyId: property?.id,
            propertyTitle: property?.title,
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }
        
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
        setIsLoading(false);
      }
    };

    if (amount && amount > 0) {
      createPaymentIntent();
    }
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
