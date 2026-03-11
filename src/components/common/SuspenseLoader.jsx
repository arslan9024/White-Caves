import React from 'react';
import {
  SuspenseLoaderContainer,
  SuspenseLoaderOverlay,
  SuspenseLoaderSpinner,
  SpinnerCircle,
  SpinnerText,
} from './SuspenseLoader.styles';

/**
 * SuspenseLoader Component
 * Displayed while lazy-loaded route components are being loaded
 * Provides smooth transition with loading indicator
 */
export default function SuspenseLoader() {
  return (
    <SuspenseLoaderContainer>
      <SuspenseLoaderOverlay>
        <SuspenseLoaderSpinner>
          <SpinnerCircle />
          <SpinnerText>Loading page...</SpinnerText>
        </SuspenseLoaderSpinner>
      </SuspenseLoaderOverlay>
    </SuspenseLoaderContainer>
  );
}
