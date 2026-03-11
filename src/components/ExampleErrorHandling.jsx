import React, { useState } from 'react';
import { useToast } from './Toast';
import { useFormValidation } from '../hooks/useFormValidation';
import { apiClient } from '../utils/apiClient';
import FormField from './FormField';
import {
  StyledExampleErrorHandling,
  StyledErrorTitle,
  StyledErrorDescription,
  StyledTestSection,
  StyledButtonGroup,
  StyledButton,
  StyledInfoBox,
} from './ExampleErrorHandling.styles';

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
    <StyledExampleErrorHandling>
      <StyledErrorTitle>Error Handling Examples</StyledErrorTitle>
      <StyledErrorDescription>This page demonstrates the error handling system</StyledErrorDescription>

      <StyledTestSection>
        <h3>Toast Notifications</h3>
        <StyledButtonGroup>
          <StyledButton variant="success" onClick={testSuccessToast}>
            Success Toast
          </StyledButton>
          <StyledButton variant="error" onClick={testNetworkError}>
            Error Toast
          </StyledButton>
          <StyledButton variant="warning" onClick={testWarningToast}>
            Warning Toast
          </StyledButton>
          <StyledButton variant="info" onClick={testInfoToast}>
            Info Toast
          </StyledButton>
        </StyledButtonGroup>
      </StyledTestSection>

      <StyledTestSection>
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

          <StyledButton type="submit" variant="primary">
            Validate Form
          </StyledButton>
        </form>
      </StyledTestSection>

      <StyledTestSection>
        <h3>API Error Handling</h3>
        <StyledButtonGroup>
          <StyledButton 
            variant="secondary"
            onClick={testPaymentStatus}
          >
            Check Payment Status
          </StyledButton>
          <StyledButton 
            variant="primary"
            onClick={testPaymentAPI}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Test Payment API'}
          </StyledButton>
        </StyledButtonGroup>
      </StyledTestSection>

      <StyledTestSection>
        <h3>Error Information</h3>
        <StyledInfoBox>
          <p><strong>Missing Configuration:</strong></p>
          <ul>
            <li>STRIPE_SECRET_KEY - Payment processing unavailable</li>
            <li>MONGODB_URI - Database features unavailable</li>
          </ul>
          <p>Try the "Check Payment Status" button to see configuration error handling.</p>
        </StyledInfoBox>
      </StyledTestSection>
    </StyledExampleErrorHandling>
  );
};

export default ExampleErrorHandling;
