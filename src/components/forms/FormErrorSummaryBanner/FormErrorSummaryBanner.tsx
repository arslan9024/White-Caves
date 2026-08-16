/**
 * FormErrorSummaryBanner — Wave 63 FE-GOAL-075
 * Accessible form validation error summary alert banner with direct jump anchors to invalid inputs
 * White Caves Real Estate LLC — Forms Suite
 */
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}`;

const Banner = styled.div`
  width: 100%;
  background: rgba(239, 68, 68, 0.1);
  border: 1.5px solid #EF4444;
  border-radius: 12px;
  padding: 16px;
  font-family: 'Inter', sans-serif;
  animation: ${slideDown} 0.25s ease;
`;

const BHeader = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #EF4444;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorList = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 20px;
  font-size: 0.75rem;
  color: #CBD5E1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ErrorLink = styled.a`
  color: #EF4444;
  text-decoration: underline;
  cursor: pointer;
  &:hover { color: #FFF; }
`;

export interface FormError {
  fieldId: string;
  message: string;
}

export const FormErrorSummaryBanner: FC<{ errors?: FormError[] }> = ({
  errors = [
    { fieldId: 'passport-no', message: 'Valid Passport or Emirates ID copy is required.' },
    { fieldId: 'ejari-amt', message: 'Annual rental amount must be greater than AED 10,000.' },
  ],
}) => {
  if (!errors || errors.length === 0) return null;

  return (
    <Banner data-testid="form-error-summary-banner" role="alert" aria-labelledby="error-summary-title">
      <BHeader id="error-summary-title">
        <span>⚠️</span>
        <span>Please resolve {errors.length} validation errors before proceeding:</span>
      </BHeader>
      <ErrorList>
        {errors.map((e, idx) => (
          <li key={idx}>
            <ErrorLink href={`#${e.fieldId}`}>{e.message}</ErrorLink>
          </li>
        ))}
      </ErrorList>
    </Banner>
  );
};

export default FormErrorSummaryBanner;
