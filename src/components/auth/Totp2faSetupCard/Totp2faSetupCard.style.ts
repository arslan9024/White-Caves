import styled from 'styled-components';

export const CardContainer = styled.div`
  padding: 1.5rem;
  background: #0F172A;
  border: 2px solid #EF4444;
  border-radius: 16px;
  color: #FFFFFF;
  max-width: 520px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
`;

export const QrBox = styled.div`
  width: 180px;
  height: 180px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 12px;
  margin: 1.25rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
`;

export const SecretKeyDisplay = styled.div`
  padding: 8px 14px;
  background: #1E293B;
  border: 1px dashed #EF4444;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #EF4444;
  text-align: center;
  letter-spacing: 2px;
  margin-bottom: 1rem;
`;

export const TokenInputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;

  input {
    flex: 1;
    padding: 10px;
    background: #1E293B;
    border: 1.5px solid #334155;
    border-radius: 8px;
    color: #FFFFFF;
    font-size: 1.1rem;
    text-align: center;
    letter-spacing: 4px;
    outline: none;

    &:focus {
      border-color: #EF4444;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
    }
  }

  button {
    padding: 10px 20px;
    background: #EF4444;
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
`;
