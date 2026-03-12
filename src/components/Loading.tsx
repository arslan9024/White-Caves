import React from 'react';
import { LoadingContainer, LoadingSpinner } from './Loading.styles';

const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <LoadingSpinner />
      <p>Loading...</p>
    </LoadingContainer>
  );
};

export default Loading;
