import React from 'react';
import {
  WidgetContainer,
  WidgetHeader,
  ContentGrid,
  Section,
  SectionTitle,
  COAList,
  COAItem,
  FTACard,
  ActionButton
} from './FinanceEngineFTAComplianceWidget.style';
import { useFinanceEngineFTAComplianceLogic } from './FinanceEngineFTAComplianceWidget.logic';
import { BookOpen, FileText, Download, Landmark, FileCheck, Percent } from 'lucide-react';

export const FinanceEngineFTAComplianceWidget: React.FC = () => {
  const {
    t,
    isRtl,
    coaData,
    handleExport
  } = useFinanceEngineFTAComplianceLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3>{t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
        <BookOpen size={32} color="var(--accent-gold, #D4AF37)" />
      </WidgetHeader>

      <ContentGrid>
        <Section>
          <SectionTitle>
            <Landmark size={20} color="var(--color-64748b, #64748B)" />
            {t.schema_section_title}
          </SectionTitle>
          <COAList>
            {coaData.map((item) => (
              <COAItem key={item.id}>
                <div style={{ padding: '6px', borderRadius: '4px', background: 'var(--white, #FFFFFF)', border: '1px solid var(--color-e2e8f0, #E2E8F0)' }}>
                  <FileText size={16} color={item.iconColor} />
                </div>
                <span className="label">{item.label}</span>
              </COAItem>
            ))}
          </COAList>
          <ActionButton onClick={handleExport}>
            <Download size={16} />
            {t.btn_export}
          </ActionButton>
        </Section>

        <Section>
          <SectionTitle>
            <FileCheck size={20} color="var(--color-64748b, #64748B)" />
            {t.fta_section_title}
          </SectionTitle>
          
          <FTACard>
            <h5>
              <Percent size={16} />
              {t.fta_vat_title}
            </h5>
            <p>{t.fta_vat_desc}</p>
          </FTACard>

          <FTACard style={{ background: 'var(--color-fffbeb, #FFFBEB)', borderColor: 'var(--color-fde68a, #FDE68A)' }}>
            <h5 style={{ color: 'var(--color-92400e, #92400E)' }}>
              <FileCheck size={16} />
              {t.fta_exempt_title}
            </h5>
            <p style={{ color: 'var(--color-b45309, #B45309)' }}>{t.fta_exempt_desc}</p>
          </FTACard>
        </Section>
      </ContentGrid>
    </WidgetContainer>
  );
};
