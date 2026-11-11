import styled, { css } from 'styled-components';

export const GeospatialViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #090e17;
  color: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  font-family: inherit;

  [data-theme='light'] & {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
`;

export const ViewerHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  [data-theme='light'] & {
    border-bottom: 1px solid #e2e8f0;
  }

  .title-area {
    display: flex;
    flex-direction: column;
    gap: 3px;

    h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .subtitle {
      font-size: 0.72rem;
      color: #94a3b8;
    }
  }

  .metric-mode-selector {
    display: flex;
    gap: 6px;
    background: #111827;
    padding: 3px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);

    [data-theme='light'] & {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
    }
  }
`;

export const MetricModeBtn = styled.button<{ $isActive: boolean }>`
  background: ${({ $isActive }) => ($isActive ? '#ef4444' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#94a3b8')};
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  [data-theme='light'] & {
    color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#475569')};
  }
`;

export const GeospatialCanvasArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  min-height: 420px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const InteractiveMapCanvas = styled.div`
  background: radial-gradient(circle at 60% 40%, #172554 0%, #0b1329 70%, #030712 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  [data-theme='light'] & {
    background: radial-gradient(circle at 60% 40%, #e0f2fe 0%, #f0f9ff 70%, #ffffff 100%);
    border: 1px solid #cbd5e1;
  }

  .coastline-watermark {
    position: absolute;
    top: 10px;
    left: 14px;
    font-size: 0.65rem;
    font-weight: 800;
    color: rgba(59, 130, 246, 0.4);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
`;

export const ClusterHeatPin = styled.button<{
  $top: string;
  $left: string;
  $intensity: number;
  $isSelected: boolean;
}>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  transform: translate(-50%, -50%);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: ${({ $isSelected }) => ($isSelected ? 20 : 10)};

  .pin-glow-ring {
    width: ${({ $intensity }) => Math.max(34, $intensity * 4.5)}px;
    height: ${({ $intensity }) => Math.max(34, $intensity * 4.5)}px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(239, 68, 68, 0.85) 0%,
      rgba(239, 68, 68, 0.3) 60%,
      rgba(239, 68, 68, 0) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    border: ${({ $isSelected }) => ($isSelected ? '2px solid #FFFFFF' : '1px solid rgba(239, 68, 68, 0.6)')};
    box-shadow: ${({ $isSelected }) => ($isSelected ? '0 0 16px #EF4444' : 'none')};
    transition: all 0.2s ease;
  }

  .pin-badge {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 800;
    color: #ffffff;
    white-space: nowrap;

    [data-theme='light'] & {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }
  }
`;

export const ClusterDetailsSidebar = styled.div`
  background: #0d1527;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  [data-theme='light'] & {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .cluster-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #ffffff;

    [data-theme='light'] & {
      color: #0f172a;
    }
  }

  .stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.78rem;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    [data-theme='light'] & {
      border-bottom: 1px solid #e2e8f0;
    }

    .key {
      color: #94a3b8;
    }

    .val {
      font-weight: 800;
      color: #ffffff;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }
  }
`;
