import styled from 'styled-components';

export const VrContainer = styled.div`
  position: relative;
  width: 100%;
  height: 480px;
  background: #0F172A;
  border: 2px solid #EF4444;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #FFFFFF;
`;

export const VrViewport = styled.div`
  flex: 1;
  background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const HotspotButton = styled.button<{ $top: string; $left: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  border: 3px solid #FFFFFF;
  color: #FFFFFF;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

export const VrControls = styled.div`
  padding: 12px 20px;
  background: #0F172A;
  border-top: 1px solid rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
