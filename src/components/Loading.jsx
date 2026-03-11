import React from 'react';
import { LoadingContainer, LoadingSpinner } from './Loading.styles';

export default function Loading() {
  return (
    <LoadingContainer>
      <LoadingSpinner />
      <p>Loading...</p>
    </LoadingContainer>
  );
}
