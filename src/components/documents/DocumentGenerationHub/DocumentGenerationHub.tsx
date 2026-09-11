import React, { FC, useState } from 'react';
import { FileText, FileSpreadsheet, FileDown, Database } from 'lucide-react';
import { HubWrap, Title, Grid, Card, CardTitle, CardDesc, GenerateButton } from './DocumentGenerationHub.style';

export const DocumentGenerationHub: FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleGenerate = (id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [id]: false }));
      // In a real app, this would trigger a download via API
      alert('Document generated! Check network tab for API payload.');
    }, 2000);
  };

  return (
    <HubWrap>
      <Title><Database size={20} color="#F59E0B" /> Document Generation Engine</Title>
      <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: 24 }}>
        Generate real-time exports via the DocumentService (PDF-lib / ExcelJS streaming).
      </p>

      <Grid>
        <Card>
          <CardTitle><FileSpreadsheet size={18} color="#22C55E" /> Master Leads Pipeline</CardTitle>
          <CardDesc>Export up to 5,000 active leads into an Excel spreadsheet with scores and metadata.</CardDesc>
          <GenerateButton $variant="excel" onClick={() => handleGenerate('leads')}>
            {loading['leads'] ? 'GENERATING...' : <><FileDown size={16} /> Export Excel (XLSX)</>}
          </GenerateButton>
        </Card>

        <Card>
          <CardTitle><FileSpreadsheet size={18} color="#22C55E" /> Master Property Portfolio</CardTitle>
          <CardDesc>Export the entire property catalogue including pricing, location, and status data.</CardDesc>
          <GenerateButton $variant="excel" onClick={() => handleGenerate('properties')}>
            {loading['properties'] ? 'GENERATING...' : <><FileDown size={16} /> Export Excel (XLSX)</>}
          </GenerateButton>
        </Card>

        <Card>
          <CardTitle><FileText size={18} color="#EF4444" /> Monthly P&L Statement</CardTitle>
          <CardDesc>Generate a formatted PDF statement detailing gross rent income, commission, and 5% VAT.</CardDesc>
          <GenerateButton $variant="pdf" onClick={() => handleGenerate('pnl')}>
            {loading['pnl'] ? 'GENERATING...' : <><FileDown size={16} /> Export Statement (PDF)</>}
          </GenerateButton>
        </Card>
      </Grid>
    </HubWrap>
  );
};
