/** DocumentShareLinkGenerator.tsx — View Layer */
import React, { FC } from 'react';
import { Link } from 'lucide-react';
import { useDocumentShareLinkGeneratorLogic } from './logic/DocumentShareLinkGenerator.logic';
import type { ExpiryOption } from './logic/DocumentShareLinkGenerator.logic';
import { Root, Title, OptionRow, OptionLabel, Select, Toggle, GenBtn, LinkBox, LinkText, CopyBtn, PinBox, PinCode } from './styles/DocumentShareLinkGenerator.style';

export const DocumentShareLinkGenerator: FC = () => {
  const { expiry, setExpiry, requirePin, setRequirePin, link, pin, copied, handleGenerate, handleCopy, EXPIRY_LABELS } = useDocumentShareLinkGeneratorLogic();
  return (
    <Root data-testid="doc-share-link-generator">
      <Title><Link size={16} style={{ marginRight: 6, color: 'var(--accent-red, #ef4444)', verticalAlign: 'text-bottom' }} />Share Document Link</Title>
      <OptionRow>
        <OptionLabel>Link Expiry</OptionLabel>
        <Select value={expiry} onChange={(e) => setExpiry(e.target.value as ExpiryOption)}>
          {(['24h', '7d', '30d', 'never'] as ExpiryOption[]).map((o) => (
            <option key={o} value={o}>{EXPIRY_LABELS[o]}</option>
          ))}
        </Select>
      </OptionRow>
      <OptionRow>
        <OptionLabel>Require PIN</OptionLabel>
        <Toggle type="checkbox" checked={requirePin} onChange={(e) => setRequirePin(e.target.checked)} />
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #64748b)' }}>4-digit PIN to open</span>
      </OptionRow>
      <GenBtn onClick={handleGenerate}>Generate Secure Link</GenBtn>
      {link && (
        <>
          <LinkBox>
            <LinkText>{link}</LinkText>
            <CopyBtn $copied={copied} onClick={handleCopy}>{copied ? '✓ Copied' : 'Copy'}</CopyBtn>
          </LinkBox>
          {pin && (
            <PinBox>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', marginBottom: '0.25rem' }}>🔐 Recipient PIN Code</div>
              <PinCode>{pin}</PinCode>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-94a3b8, #94a3b8)', marginTop: '0.25rem' }}>Share this PIN separately (not via same channel)</div>
            </PinBox>
          )}
        </>
      )}
    </Root>
  );
};
export default DocumentShareLinkGenerator;
