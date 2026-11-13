// src/components/ZoeFeatures/WhiteCavesBookViewer.tsx
import React from 'react';
import { BookProvider } from './WhiteCavesBook/BookContext';
import { ModernBookView } from './WhiteCavesBook/ModernBookView';

interface WhiteCavesBookViewerProps {
  initialChapter?: string;
}

export const WhiteCavesBookViewer: React.FC<WhiteCavesBookViewerProps> = ({
  initialChapter = 'chapter-01-architecture',
}) => {
  // Normalize initial chapter slug (strip .html if provided by legacy callers)
  const normalizedSlug = initialChapter
    .replace('.html', '')
    .replace('index', 'chapter-01-architecture');

  return (
    <BookProvider initialSlug={normalizedSlug}>
      <ModernBookView />
    </BookProvider>
  );
};

export default WhiteCavesBookViewer;
