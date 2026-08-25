/**
 * AuroraSoftwareHub.tsx
 * View Layer for Aurora AI (Item Code: 3.11) Hyper-Linked Software Architecture Documentation Engine
 */

import React, { FC } from 'react';
import { useAuroraSoftwareHubLogic } from './logic/AuroraSoftwareHub.logic';
import { AURORA_HUB_TEXT } from './data/AuroraSoftwareHub.data';
import {
  Container,
  HeaderBanner,
  Badge,
  Title,
  Subtitle,
  ControlsRow,
  SearchInput,
  CategoryPills,
  CategoryPill,
  DocsGrid,
  DocCard,
  DocCodeBadge,
  DocCardTitle,
  DocCardSummary,
  DocCardFooter,
  ViewerOverlay,
  ViewerHeader,
  ActionButton,
} from './styles/AuroraSoftwareHub.style';

export interface AuroraSoftwareHubProps {
  onNavigateAssistant?: (assistantId: string) => void;
}

export const AuroraSoftwareHub: FC<AuroraSoftwareHubProps> = ({ onNavigateAssistant }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredDocs,
    activeDoc,
    handleOpenDoc,
    handleCloseDoc,
    handlePrint,
  } = useAuroraSoftwareHubLogic();

  return (
    <Container data-testid="aurora-software-hub">
      <HeaderBanner>
        <Badge>{AURORA_HUB_TEXT.badge}</Badge>
        <Title>{AURORA_HUB_TEXT.title}</Title>
        <Subtitle>{AURORA_HUB_TEXT.subtitle}</Subtitle>
      </HeaderBanner>

      {!activeDoc ? (
        <>
          <ControlsRow>
            <SearchInput
              type="text"
              placeholder={AURORA_HUB_TEXT.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search software specifications"
            />
          </ControlsRow>

          <CategoryPills>
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                $active={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label} ({cat.count})
              </CategoryPill>
            ))}
          </CategoryPills>

          <DocsGrid>
            {filteredDocs.map((doc) => (
              <DocCard key={doc.id} onClick={() => handleOpenDoc(doc)} data-testid={`doc-card-${doc.code}`}>
                <div>
                  <DocCodeBadge>{doc.code}</DocCodeBadge>
                  <DocCardTitle>{doc.title}</DocCardTitle>
                  <DocCardSummary>{doc.summary}</DocCardSummary>
                </div>
                <DocCardFooter>
                  <span>{doc.phase}</span>
                  <span>{doc.lastUpdated}</span>
                </DocCardFooter>
              </DocCard>
            ))}
          </DocsGrid>
        </>
      ) : (
        <ViewerOverlay data-testid="doc-viewer-overlay">
          <ViewerHeader>
            <ActionButton onClick={handleCloseDoc}>{AURORA_HUB_TEXT.backBtn}</ActionButton>
            <div style={{ display: 'flex', gap: '8px' }}>
              <ActionButton $variant="primary" onClick={handlePrint}>
                {AURORA_HUB_TEXT.printBtn}
              </ActionButton>
            </div>
          </ViewerHeader>
          <div
            dangerouslySetInnerHTML={{ __html: activeDoc.htmlContent }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const link = target.closest('a');
              if (link && link.hash.startsWith('#assistant-') && onNavigateAssistant) {
                e.preventDefault();
                const assistantId = link.hash.replace('#assistant-', '');
                onNavigateAssistant(assistantId);
              }
            }}
          />
        </ViewerOverlay>
      )}
    </Container>
  );
};

export default AuroraSoftwareHub;
