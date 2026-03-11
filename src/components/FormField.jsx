import React from 'react';
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

const FormField = ({
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
          {props.children}
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
