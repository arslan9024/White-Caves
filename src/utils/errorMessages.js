export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  VALIDATION_ERROR: 'Please check the information you entered and try again.',
  AUTHENTICATION_REQUIRED: 'Please sign in to continue.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  
  AUTH: {
    LOGIN_FAILED: 'Login failed. Please check your credentials and try again.',
    SIGNUP_FAILED: 'Account creation failed. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
  },
  
  PROPERTY: {
    LOAD_FAILED: 'Unable to load properties. Please try again.',
    CREATE_FAILED: 'Unable to create property listing. Please try again.',
    UPDATE_FAILED: 'Unable to update property. Please try again.',
    DELETE_FAILED: 'Unable to delete property. Please try again.',
    NOT_FOUND: 'Property not found.',
  },
  
  APPOINTMENT: {
    CREATE_FAILED: 'Unable to schedule appointment. Please try again.',
    LOAD_FAILED: 'Unable to load appointments. Please try again.',
    INVALID_DATE: 'Please select a valid date and time.',
    SLOT_UNAVAILABLE: 'This time slot is no longer available. Please choose another time.',
  },
  
  PAYMENT: {
    PROCESSING_FAILED: 'Payment processing failed. Please try again or use a different payment method.',
    INVALID_AMOUNT: 'Invalid payment amount.',
    STRIPE_NOT_CONFIGURED: 'Payment processing is currently unavailable. Please contact support.',
  },
  
  TENANCY: {
    CREATE_FAILED: 'Unable to create tenancy agreement. Please try again.',
    SIGN_FAILED: 'Unable to process signature. Please try again.',
    LOAD_FAILED: 'Unable to load tenancy agreements. Please try again.',
    INVALID_EMAIL: 'The email address does not match our records.',
    UNAUTHORIZED_SIGNER: 'You are not authorized to sign this agreement.',
    ALREADY_SIGNED: 'You have already signed this agreement.',
  },
  
  FORM: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    INVALID_DATE: 'Please enter a valid date.',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  },
  
  FILE: {
    UPLOAD_FAILED: 'File upload failed. Please try again.',
    INVALID_TYPE: 'Invalid file type. Please upload a valid file.',
    TOO_LARGE: 'File is too large. Maximum size is 5MB.',
  },
  
  DATABASE: {
    CONNECTION_FAILED: 'Database connection failed. Some features may be unavailable.',
    OPERATION_FAILED: 'Database operation failed. Please try again.',
  },
};

export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.SERVER_ERROR;
  
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    if (message) return message;
    
    switch (status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.AUTHENTICATION_REQUIRED;
      case 403:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.SERVER_ERROR;
    }
  }
  
  if (error.request) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return error.message || ERROR_MESSAGES.SERVER_ERROR;
};
