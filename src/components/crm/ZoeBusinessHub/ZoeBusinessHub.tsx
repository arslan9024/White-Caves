/**
 * ZoeBusinessHub.tsx
 * View Layer for Zoe AI (Item Code: 3.10) Hyper-Linked Business Documentation Engine
 */

import React, { FC } from 'react';
import { useZoeBusinessHubLogic } from './logic/ZoeBusinessHub.logic';
import { ZOE_HUB_TEXT } from './data/ZoeBusinessHub.data';
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
} from './styles/ZoeBusinessHub.style';

export interface ZoeBusinessHubProps {
  onNavigateAssistant?: (assistantId: string) => void;
}

export const ZoeBusinessHub: FC<ZoeBusinessHubProps> = ({ onNavigateAssistant }) => {
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
  } = useZoeBusinessHubLogic();

  return (
    <Container data-testid="zoe-business-hub">
      <HeaderBanner>
        <Badge>{ZOE_HUB_TEXT.badge}</Badge>
        <Title>{ZOE_HUB_TEXT.title}</Title>
        <Subtitle>{ZOE_HUB_TEXT.subtitle}</Subtitle>
      </HeaderBanner>

      {!activeDoc ? (
        <>
          <ControlsRow>
            <SearchInput
              type="text"
              placeholder={ZOE_HUB_TEXT.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search business documents"
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
                  <span>{doc.departmentFloor}</span>
                  <span>{doc.lastUpdated}</span>
                </DocCardFooter>
              </DocCard>
            ))}
          </DocsGrid>
        </>
      ) : (
        <ViewerOverlay data-testid="doc-viewer-overlay">
          <ViewerHeader>
            <ActionButton onClick={handleCloseDoc}>{ZOE_HUB_TEXT.backBtn}</ActionButton>
            <div style={{ display: 'flex', gap: '8px' }}>
              <ActionButton $variant="primary" onClick={handlePrint}>
                {ZOE_HUB_TEXT.printBtn}
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

export default ZoeBusinessHub;
