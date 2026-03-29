import React, { type ChangeEvent, type FocusEvent, type ReactNode } from 'react';
import {
  StyledFormField,
  StyledLabel,
  StyledRequired,
  StyledInput,
  StyledTextArea,
  StyledSelect,
  StyledErrorField,
  StyledErrorMessage,
} from './FormField.styles';

interface FormFieldProps {
  label?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
  value?: string | number;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  autoComplete?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  required = false,
  placeholder,
  onChange,
  onBlur,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const hasError = touched && error;
  const FieldComponent = hasError ? StyledErrorField : StyledFormField;

  return (
    <FieldComponent className={className}>
      {label && (
        <StyledLabel htmlFor={name}>
          {label}
          {required && <StyledRequired>*</StyledRequired>}
        </StyledLabel>
      )}
      
      {type === 'textarea' ? (
        <StyledTextArea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      ) : type === 'select' ? (
        <StyledSelect
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...props}
        >
          {children}
        </StyledSelect>
      ) : (
        <StyledInput
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      )}
      
      {hasError && (
        <StyledErrorMessage>{error}</StyledErrorMessage>
      )}
    </FieldComponent>
  );
};

export default FormField;
