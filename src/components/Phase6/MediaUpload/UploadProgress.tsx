import React from 'react';
import styled from 'styled-components';

interface UploadProgressProps {
  progress: number;
  fileName?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: #4caf50;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
`;

const FileName = styled.span`
  font-weight: 500;
  color: #333;
`;

const Percentage = styled.span`
  color: #4caf50;
  font-weight: 600;
`;

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  fileName = 'Uploading...',
}) => {
  return (
    <Container>
      <ProgressContainer>
        <ProgressText>
          <FileName>{fileName}</FileName>
          <Percentage>{Math.round(progress)}%</Percentage>
        </ProgressText>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      </ProgressContainer>
    </Container>
  );
};

export default UploadProgress;
