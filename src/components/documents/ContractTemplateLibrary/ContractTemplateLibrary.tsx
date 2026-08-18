/** ContractTemplateLibrary.tsx — View Layer */
import React, { FC } from 'react';
import { FileText } from 'lucide-react';
import { useContractTemplateLibraryLogic } from './logic/ContractTemplateLibrary.logic';
import { Root, Title, FilterBar, FilterPill, Grid, Card, CardTitle, CardMeta, PopularTag, UseBtn } from './styles/ContractTemplateLibrary.style';

export const ContractTemplateLibrary: FC = () => {
  const { filtered, CATEGORIES, activeCategory, setActiveCategory, setPreview } = useContractTemplateLibraryLogic();
  return (
    <Root data-testid="contract-template-library">
      <Title><FileText size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom', color: '#ef4444' }} />Contract Template Library</Title>
      <FilterBar>
        {CATEGORIES.map((c) => (
          <FilterPill key={c} $active={activeCategory === c} onClick={() => setActiveCategory(c)}>{c}</FilterPill>
        ))}
      </FilterBar>
      <Grid>
        {filtered.map((t) => (
          <Card key={t.id} onClick={() => setPreview(t)}>
            {t.popular && <PopularTag>★ Popular</PopularTag>}
            <CardTitle>{t.title}</CardTitle>
            <CardMeta>{t.category} · {t.pages} pages</CardMeta>
            <CardMeta style={{ marginTop: '0.25rem' }}>{t.requiredFields.length} required fields</CardMeta>
            <UseBtn onClick={(e) => { e.stopPropagation(); alert(`Opening ${t.title}…`); }}>Use Template</UseBtn>
          </Card>
        ))}
      </Grid>
    </Root>
  );
};
export default ContractTemplateLibrary;
