import React from 'react';
import {
  PageLoaderOverlay,
  LoaderContent,
  LoaderLogo,
  LoaderSpinner,
  Spinner,
  LoaderMessage
} from './PageLoader.styles';

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <PageLoaderOverlay>
      <LoaderContent>
        <LoaderLogo>
          <img src="/company-logo.jpg" alt="White Caves" />
        </LoaderLogo>
        <LoaderSpinner>
          <Spinner />
        </LoaderSpinner>
        <LoaderMessage>{message}</LoaderMessage>
      </LoaderContent>
    </PageLoaderOverlay>
  );
}
