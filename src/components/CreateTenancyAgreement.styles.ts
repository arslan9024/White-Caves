import styled from 'styled-components';
import { typography } from '../styles/theme/typography';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: ${typography.fontFamily.system};
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 32px;
  }

  p {
    color: #666;
    font-size: 16px;
  }
`;

export const NoAuthContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

export const NoPermissionContainer = styled(NoAuthContainer)`
  background: #fee2e2;
  color: #991b1b;
`;

export const Form = styled.form`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const FormSection = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }

  h3 {
    color: #1a1a1a;
    font-size: 20px;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid #0066ff;
    display: inline-block;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    font-size: 14px;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 15px;
    font-family: inherit;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #0066ff;
    }
  }

  select {
    cursor: pointer;
    background-color: white;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormActions = styled.div`
  margin-top: 32px;
  text-align: center;
`;

export const SubmitBtn = styled.button`
  background: #0066ff;
  color: white;
  padding: 16px 48px;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 250px;

  &:hover:not(:disabled) {
    background: #0052cc;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 102, 255, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }
`;
