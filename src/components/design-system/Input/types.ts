/**
 * Input Component Types
 */

import React from 'react';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input type */
  type?: InputType;
  /** Size variant */
  size?: InputSize;
  /** Label text */
  label?: string;
  /** Helper/description text */
  helperText?: string;
  /** Error state and message */
  error?: string | boolean;
  /** Optional left icon */
  leftIcon?: React.ReactNode;
  /** Optional right icon */
  rightIcon?: React.ReactNode;
  /** Whether field is required */
  isRequired?: boolean;
  /** Whether input is filled */
  isFilled?: boolean;
}
