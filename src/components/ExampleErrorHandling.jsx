import React, { useState } from 'react';
import { useToast } from './Toast';
import { useFormValidation } from '../hooks/useFormValidation';
import { apiClient } from '../utils/apiClient';
import FormField from './FormField';
import './ExampleErrorHandling.css';

const ExampleErrorHandling = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation(
    {
      email: '',
      amount: '',
    },
    {
      email: {
        required: true,
        email: true,
      },
      amount: {
        required: true,
        min: 1,
      },
    }
  );

  const testNetworkError = () => {
    toast.error('Network connection failed. Please check your internet connection.');
  };

  const testSuccessToast = () => {
    toast.success('Payment processed successfully!');
  };

  const testWarningToast = () => {
    toast.warning('This action cannot be undone.');
  };

  const testInfoToast = () => {
    toast.info('Your session will expire in 5 minutes.');
  };

  const testFormValidation = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast.success('Form is valid!');
    } else {
      toast.error('Please fix the form errors');
    }
  };

  const testPaymentAPI = async () => {
    setLoading(true);
    try {
      const result = await apiClient.post('/payments/create-payment-intent', {
        amount: parseFloat(values.amount) || 100,
        propertyId: 'test-123',
        propertyTitle: 'Test Property'
      });
      
      toast.success('Payment intent created successfully!');
      console.log('Payment result:', result);
    } catch (error) {
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const testPaymentStatus = async () => {
    try {
      const result = await apiClient.get('/payments/status');
      if (result.configured) {
        toast.success(result.message);
      } else {
        toast.warning(result.message);
      }
    } catch (error) {
      toast.error('Failed to check payment status');
    }
  };

  return (
    <div className="example-error-handling">
      <h2>Error Handling Examples</h2>
      <p>This page demonstrates the error handling system</p>

      <section className="test-section">
        <h3>Toast Notifications</h3>
        <div className="button-group">
          <button onClick={testSuccessToast} className="btn btn-success">
            Success Toast
          </button>
          <button onClick={testNetworkError} className="btn btn-error">
            Error Toast
          </button>
          <button onClick={testWarningToast} className="btn btn-warning">
            Warning Toast
          </button>
          <button onClick={testInfoToast} className="btn btn-info">
            Info Toast
          </button>
        </div>
      </section>

      <section className="test-section">
        <h3>Form Validation</h3>
        <form onSubmit={testFormValidation}>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            error={errors.email}
            touched={touched.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Enter your email"
          />

          <FormField
            label="Amount"
            name="amount"
            type="number"
            value={values.amount}
            error={errors.amount}
            touched={touched.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Enter amount"
          />

          <button type="submit" className="btn btn-primary">
            Validate Form
          </button>
        </form>
      </section>

      <section className="test-section">
        <h3>API Error Handling</h3>
        <div className="button-group">
          <button 
            onClick={testPaymentStatus} 
            className="btn btn-secondary"
          >
            Check Payment Status
          </button>
          <button 
            onClick={testPaymentAPI} 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Test Payment API'}
          </button>
        </div>
      </section>

      <section className="test-section">
        <h3>Error Information</h3>
        <div className="info-box">
          <p><strong>Missing Configuration:</strong></p>
          <ul>
            <li>STRIPE_SECRET_KEY - Payment processing unavailable</li>
            <li>MONGODB_URI - Database features unavailable</li>
          </ul>
          <p>Try the "Check Payment Status" button to see configuration error handling.</p>
        </div>
      </section>
    </div>
  );
};

export default ExampleErrorHandling;
