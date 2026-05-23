# Error Handling System Documentation

## Overview

This application implements a comprehensive error handling system across both frontend and backend to provide users with clear, actionable error messages and improve the overall user experience.

## Architecture

### Frontend Error Handling

#### 1. Error Boundary Component
- **Location**: `src/components/ErrorBoundary.jsx`
- **Purpose**: Catches JavaScript errors anywhere in the React component tree
- **Features**:
  - Displays user-friendly error UI instead of white screen
  - Shows error details in development mode
  - Provides "Try Again" and "Go to Home" actions
  - Supports dark/light theme

#### 2. Toast Notification System
- **Location**: `src/components/Toast.jsx`
- **Purpose**: Display non-intrusive notifications to users
- **Types**:
  - `success` - Green, for successful operations
  - `error` - Red, for errors and failures
  - `warning` - Orange, for warnings
  - `info` - Blue, for informational messages
- **Usage**:
  ```javascript
  import { useToast } from './components/Toast';
  
  const MyComponent = () => {
    const toast = useToast();
    
    toast.success('Payment completed!');
    toast.error('Payment failed. Please try again.');
    toast.warning('Session will expire in 5 minutes');
    toast.info('New property added to favorites');
  };
  ```

#### 3. Custom API Client
- **Location**: `src/utils/apiClient.js`
- **Features**:
  - Centralized API calls with consistent error handling
  - Automatic error parsing and user-friendly messages
  - Support for authentication tokens
  - Built-in retry logic capability
- **HttpError Class**: Proper Error instance with status codes and response data

#### 4. Custom Hooks

##### useApi Hook
- **Location**: `src/hooks/useApi.js`
- **Purpose**: Simplify API calls with built-in loading, error, and success states
- **Example**:
  ```javascript
  import { useApi } from '../hooks/useApi';
  
  const MyComponent = () => {
    const createPayment = useApi(
      (amount) => apiClient.post('/payments/create-payment-intent', { amount }),
      {
        showSuccessToast: true,
        successMessage: 'Payment created successfully',
        onSuccess: (result) => console.log(result),
      }
    );
    
    return (
      <button onClick={() => createPayment.execute(100)} disabled={createPayment.loading}>
        {createPayment.loading ? 'Processing...' : 'Pay Now'}
      </button>
    );
  };
  ```

##### useFormValidation Hook
- **Location**: `src/hooks/useFormValidation.js`
- **Purpose**: Handle form validation with inline error messages
- **Example**:
  ```javascript
  import { useFormValidation } from '../hooks/useFormValidation';
  
  const MyForm = () => {
    const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation(
      { email: '', amount: '' },
      {
        email: { required: true, email: true },
        amount: { required: true, min: 1 }
      }
    );
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        // Submit form
      }
    };
  };
  ```

#### 5. Form Field Component
- **Location**: `src/components/FormField.jsx`
- **Purpose**: Reusable form input with error display
- **Features**:
  - Automatic error message display
  - Required field indicator
  - Dark theme support
  - Accessible labels

### Backend Error Handling

#### 1. Custom Error Classes
- **Location**: `src/utils/errors.js`
- **Classes**:
  - `AppError` - Base error class
  - `ValidationError` - For validation failures (400)
  - `AuthenticationError` - For auth failures (401)
  - `AuthorizationError` - For permission issues (403)
  - `NotFoundError` - For missing resources (404)
  - `PaymentError` - For payment failures (402)
  - `ConfigurationError` - For missing config (500)
  - `DatabaseError` - For database issues (500)

#### 2. Error Handler Middleware
- **Location**: `src/server/middleware/errorHandler.js`
- **Features**:
  - Catches all errors in Express routes
  - Converts mongoose/JWT errors to user-friendly messages
  - Preserves custom error status codes
  - Hides stack traces in production
  - Logs errors in development

#### 3. Validation Middleware
- **Location**: `src/server/middleware/validation.js`
- **Functions**:
  - `validateEmail(email)` - Email format validation
  - `validatePhone(phone)` - Phone number validation
  - `validateRequired(value, fieldName)` - Required field check
  - `validateDate(date)` - Date validation
  - `validateAmount(amount)` - Positive number validation
  - `validateObjectId(id)` - MongoDB ObjectId validation
  - `validateRequestBody(fields)` - Middleware for required fields

#### 4. Async Error Handler
- **Location**: `src/server/middleware/errorHandler.js`
- **Function**: `asyncHandler(fn)`
- **Purpose**: Wrap async route handlers to catch promise rejections
- **Example**:
  ```javascript
  import { asyncHandler } from '../middleware/errorHandler.js';
  
  router.post('/properties', asyncHandler(async (req, res) => {
    const property = await Property.create(req.body);
    res.json({ success: true, data: property });
  }));
  ```

## Error Messages

All error messages are centralized in `src/utils/errorMessages.js` for easy maintenance and consistency.

### Categories:
- **Network Errors**: Connection failures
- **Server Errors**: 5xx responses
- **Authentication**: Login, signup, session issues
- **Property**: CRUD operations
- **Appointment**: Scheduling issues
- **Payment**: Stripe integration errors
- **Tenancy**: Agreement signing errors
- **Form Validation**: Field-level errors
- **File Upload**: Upload failures
- **Database**: Connection and query errors

## Configuration Error Handling

The system gracefully handles missing environment variables:

### Stripe Payment Processing
- **Check**: `STRIPE_SECRET_KEY` environment variable
- **Behavior**: 
  - If missing: API returns 500 with user-friendly message
  - Status endpoint: `/api/payments/status` returns configuration status
  - Console warning on server start

### MongoDB Database
- **Check**: `MONGODB_URI` environment variable
- **Behavior**:
  - If missing: Server starts with warning, database features unavailable
  - Connection errors: Logged with retry information
  - Routes: Should check connection before database operations

## Testing the Error Handling System

An example component is provided to test all error handling features:

**Location**: `src/components/ExampleErrorHandling.jsx`

**Features**:
- Toast notification examples (success, error, warning, info)
- Form validation demonstration
- API error handling examples
- Configuration error handling

**To access**: Add the component to your app temporarily for testing.

## Best Practices

### Frontend

1. **Always use the API client** instead of raw fetch:
   ```javascript
   // Good
   const data = await apiClient.post('/api/endpoint', payload);
   
   // Bad
   const response = await fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(payload) });
   ```

2. **Use hooks for complex operations**:
   ```javascript
   const { execute, loading, error } = useApi(apiFunction, options);
   ```

3. **Show user-friendly messages**:
   ```javascript
   toast.error('Unable to save changes. Please try again.');
   // Not: toast.error(error.stack);
   ```

4. **Validate forms before submission**:
   ```javascript
   if (validateForm()) {
     await submitForm();
   }
   ```

### Backend

1. **Use asyncHandler for async routes**:
   ```javascript
   router.post('/endpoint', asyncHandler(async (req, res) => {
     // Your code
   }));
   ```

2. **Throw appropriate error types**:
   ```javascript
   if (!user) {
     throw new NotFoundError('User');
   }
   ```

3. **Validate input early**:
   ```javascript
   validateRequired(req.body.email, 'email');
   validateEmail(req.body.email);
   ```

4. **Check configuration before using services**:
   ```javascript
   if (!stripe) {
     throw new ConfigurationError('Payment processing unavailable');
   }
   ```

## Integration Checklist

When adding new features, ensure:

- [ ] API calls use `apiClient`
- [ ] Route handlers wrapped in `asyncHandler`
- [ ] Input validation using validation middleware
- [ ] Success/error toasts for user actions
- [ ] Form validation for user inputs
- [ ] Proper error types thrown in backend
- [ ] User-friendly error messages
- [ ] Loading states during async operations
- [ ] Configuration checks for external services

## Future Improvements

- Add retry logic for failed network requests
- Implement error logging service (e.g., Sentry)
- Add offline detection and handling
- Create error analytics dashboard
- Implement request timeout handling
- Add circuit breaker for external services
