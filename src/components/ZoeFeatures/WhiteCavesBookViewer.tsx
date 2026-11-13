// src/components/ZoeFeatures/WhiteCavesBookViewer.tsx
import React from 'react';
import { MultiLevelBookProvider } from './WhiteCavesBook/MultiLevelBookContext';
import { MultiLevelBookView } from './WhiteCavesBook/MultiLevelBookView';

export const WhiteCavesBookViewer: React.FC = () => {
  return (
    <MultiLevelBookProvider>
      <MultiLevelBookView />
    </MultiLevelBookProvider>
  );
};

export default WhiteCavesBookViewer;
