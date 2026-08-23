/** FormADigitalGenerator.tsx — View Layer */
import React, { FC } from 'react';
import { useFormADigitalGeneratorLogic } from './logic/FormADigitalGenerator.logic';
import { Root, Title, Section, SectionTitle, Grid2, Field, Label, Input, Select, GenerateBtn, Preview, PreviewTitle } from './styles/FormADigitalGenerator.style';

export const FormADigitalGenerator: FC = () => {
  const { form, update, generated, handleGenerate, handleReset } = useFormADigitalGeneratorLogic();
  return (
    <Root data-testid="form-a-generator">
      <Title>📋 Form A — Seller Listing Agreement Generator</Title>
      {!generated ? (
        <>
          <Section>
            <SectionTitle>Seller Information</SectionTitle>
            <Grid2>
              <Field><Label>Seller Full Name *</Label><Input value={form.sellerName} onChange={(e) => update('sellerName', e.target.value)} placeholder="Ahmed Al Mansouri" /></Field>
              <Field><Label>Seller Phone</Label><Input value={form.sellerPhone} onChange={(e) => update('sellerPhone', e.target.value)} placeholder="+971 55 123 4567" /></Field>
              <Field><Label>Seller Email</Label><Input value={form.sellerEmail} onChange={(e) => update('sellerEmail', e.target.value)} placeholder="seller@email.com" /></Field>
            </Grid2>
          </Section>
          <Section>
            <SectionTitle>Property Details</SectionTitle>
            <Grid2>
              <Field><Label>Property Address *</Label><Input value={form.propertyAddress} onChange={(e) => update('propertyAddress', e.target.value)} placeholder="Unit 14C, Bloom Heights, JVC" /></Field>
              <Field><Label>Title Deed Number</Label><Input value={form.titleDeedNumber} onChange={(e) => update('titleDeedNumber', e.target.value)} placeholder="1234567890" /></Field>
              <Field><Label>Listing Price (AED) *</Label><Input value={form.listingPrice} onChange={(e) => update('listingPrice', e.target.value)} placeholder="2,500,000" /></Field>
              <Field><Label>Commission %</Label><Input value={form.commissionPct} onChange={(e) => update('commissionPct', e.target.value)} placeholder="2" /></Field>
              <Field><Label>Exclusivity</Label>
                <Select value={form.exclusivity} onChange={(e) => update('exclusivity', e.target.value as 'exclusive' | 'open')}>
                  <option value="exclusive">Exclusive</option>
                  <option value="open">Open Listing</option>
                </Select>
              </Field>
              <Field><Label>Validity (Days)</Label><Input value={form.validityDays} onChange={(e) => update('validityDays', e.target.value)} placeholder="90" /></Field>
            </Grid2>
          </Section>
          <GenerateBtn onClick={handleGenerate}>Generate Form A PDF</GenerateBtn>
        </>
      ) : (
        <>
          <Preview>
            <PreviewTitle>FORM A — SELLER LISTING AGREEMENT</PreviewTitle>
            <p><strong>RERA Permit Reference:</strong> White Caves Real Estate LLC — ORN 44483</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString('en-AE')}</p>
            <p><strong>Seller:</strong> {form.sellerName} | {form.sellerPhone}</p>
            <p><strong>Property:</strong> {form.propertyAddress} {form.titleDeedNumber && `(Title Deed: ${form.titleDeedNumber})`}</p>
            <p><strong>Listing Price:</strong> AED {form.listingPrice}</p>
            <p><strong>Commission:</strong> {form.commissionPct}% of final sale price</p>
            <p><strong>Listing Type:</strong> {form.exclusivity === 'exclusive' ? 'Exclusive (90-day lock-in)' : 'Open Listing'}</p>
            <p><strong>Validity:</strong> {form.validityDays} days from date of signing</p>
            <p><strong>Agent:</strong> {form.agentName} — BRN {form.agentBrn}</p>
            <p style={{ marginTop: '2rem', borderTop: '1px solid var(--text-secondary, #e2e8f0)', paddingTop: '1rem', color: 'var(--color-94a3b8, #94a3b8)', fontSize: '0.75rem' }}>
              This form complies with RERA Regulations under Dubai Law No. 85 of 2006.
            </p>
          </Preview>
          <button onClick={handleReset} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--accent-red, #ef4444)', cursor: 'pointer', fontWeight: 600 }}>
            ← Generate New Form A
          </button>
        </>
      )}
    </Root>
  );
};
export default FormADigitalGenerator;
