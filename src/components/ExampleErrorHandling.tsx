import React, { FC, useState } from 'react';
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

interface FormValues {
  email: string;
  amount: string;
}

interface ToastInterface {
  error: (msg: string) => void;
  success: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ExampleErrorHandling: FC = () => {
  const toastHook: any = useToast();
  const toast: ToastInterface = toastHook || {
    error: (msg: string) => console.error(msg),
    success: (msg: string) => console.log(msg),
    warning: (msg: string) => console.warn(msg),
    info: (msg: string) => console.info(msg),
  };
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation<FormValues>(
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

  const testFormValidation = async (e: React.FormEvent<HTMLFormElement>) => {
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
    } catch (error: any) {
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
          <StyledButton onClick={testSuccessToast} variant="success">
            Success Toast
          </StyledButton>
          <StyledButton onClick={testNetworkError} variant="error">
            Error Toast
          </StyledButton>
          <StyledButton onClick={testWarningToast} variant="warning">
            Warning Toast
          </StyledButton>
          <StyledButton onClick={testInfoToast} variant="info">
            Info Toast
          </StyledButton>
        </StyledButtonGroup>

        <StyledInfoBox>
          <p>Toast notifications appear at the top of the page and auto-dismiss after 3 seconds.</p>
        </StyledInfoBox>
      </StyledTestSection>

      <StyledTestSection>
        <h3>Form Validation</h3>
        <form onSubmit={testFormValidation}>
          <FormField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.email}
            error={touched.email ? errors.email : undefined}
          />
          <FormField
            label="Amount"
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.amount}
            error={touched.amount ? errors.amount : undefined}
          />
          <StyledButton type="submit" variant="primary">
            Validate Form
          </StyledButton>
        </form>

        <StyledInfoBox>
          <p>Form validation displays inline error messages when fields are invalid.</p>
        </StyledInfoBox>
      </StyledTestSection>

      <StyledTestSection>
        <h3>API Error Handling</h3>
        <StyledButtonGroup>
          <StyledButton 
            onClick={testPaymentAPI} 
            disabled={loading}
            variant="primary"
          >
            {loading ? 'Processing...' : 'Create Payment Intent'}
          </StyledButton>
          <StyledButton onClick={testPaymentStatus} variant="secondary">
            Check Payment Status
          </StyledButton>
        </StyledButtonGroup>

        <StyledInfoBox>
          <p>API errors are caught and displayed as toast notifications. The system handles network errors gracefully.</p>
        </StyledInfoBox>
      </StyledTestSection>

      <StyledTestSection>
        <h3>Error Boundary</h3>
        <StyledInfoBox>
          <p>Critical application errors are caught by the ErrorBoundary component and display a fallback UI with auto-redirect.</p>
        </StyledInfoBox>
      </StyledTestSection>
    </StyledExampleErrorHandling>
  );
};

export default ExampleErrorHandling;
