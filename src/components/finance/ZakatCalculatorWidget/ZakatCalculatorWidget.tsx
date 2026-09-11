import React from 'react';
import { WidgetContainer, InputGroup, ResultCard } from './ZakatCalculatorWidget.style';
import { useZakatCalculatorLogic } from './ZakatCalculatorWidget.logic';
import { Calculator } from 'lucide-react';

export const ZakatCalculatorWidget: React.FC = () => {
  const { t, isRtl, assets, setAssets, nisab, zakatRate, zakatDue } = useZakatCalculatorLogic();
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <Calculator size={32} color="var(--accent-gold, #D4AF37)" />
      </div>
      <InputGroup>
        <label>{t.total_assets}</label>
        <input type="number" value={assets} onChange={e => setAssets(e.target.value)} placeholder={t.placeholder_amount} />
      </InputGroup>
      <ResultCard $highlight={false}><span className="label">{t.nisab}</span><span className="value">AED {nisab.toLocaleString()}</span></ResultCard>
      <ResultCard $highlight={false}><span className="label">{t.zakat_rate}</span><span className="value">{(zakatRate * 100).toFixed(1)}%</span></ResultCard>
      <ResultCard $highlight={true}><span className="label">{t.zakat_due}</span><span className="value">AED {zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></ResultCard>
    </WidgetContainer>
  );
};
