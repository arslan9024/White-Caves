import React, { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './Checkout.css';

let stripePromise;
if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
} else {
  console.warn('VITE_STRIPE_PUBLIC_KEY not found. Payment processing will not work until this is set.');
}

const CheckoutForm = ({ property, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
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
        setErrorMessage(error.message);
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
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-details">
        <h3>Payment Details</h3>
        <div className="property-summary">
          <p><strong>Property:</strong> {property?.title}</p>
          <p><strong>Amount:</strong> ${amount?.toLocaleString()}</p>
        </div>
      </div>
      
      <PaymentElement />
      
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      
      <div className="checkout-actions">
        <button 
          type="button" 
          onClick={onCancel}
          className="cancel-btn"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="submit-btn"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount?.toLocaleString()}`}
        </button>
      </div>
    </form>
  );
};

export default function Checkout({ property, amount, onSuccess, onCancel }) {
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
      <div className="checkout-container">
        <div className="checkout-error">
          <h3>Payment System Not Configured</h3>
          <p>Stripe API keys are required to process payments. Please configure your environment variables.</p>
          <button onClick={onCancel} className="cancel-btn">Close</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">
          <div className="spinner"></div>
          <p>Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container">
        <div className="checkout-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={onCancel} className="cancel-btn">Close</button>
        </div>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return null;
  }

  return (
    <div className="checkout-container">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm 
          property={property} 
          amount={amount} 
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </div>
  );
}
