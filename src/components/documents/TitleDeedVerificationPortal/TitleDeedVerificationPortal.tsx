/** TitleDeedVerificationPortal.tsx — View Layer */
import React, { FC } from 'react';
import { Search } from 'lucide-react';
import { useTitleDeedVerificationPortalLogic } from './logic/TitleDeedVerificationPortal.logic';
import { Root, Title, SearchRow, SearchInput, SearchBtn, Spinner, Result, ResultRow, ResultLabel, ResultValue, StatusBanner } from './styles/TitleDeedVerificationPortal.style';

export const TitleDeedVerificationPortal: FC = () => {
  const { query, setQuery, status, result, handleVerify, handleReset } = useTitleDeedVerificationPortalLogic();
  return (
    <Root data-testid="title-deed-verification-portal">
      <Title>🏛️ DLD Title Deed Verification Portal</Title>
      <SearchRow>
        <SearchInput
          value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          placeholder="Enter Title Deed Number (e.g. 1234567890)"
        />
        <SearchBtn onClick={handleVerify}><Search size={16} /></SearchBtn>
      </SearchRow>
      {status === 'loading' && <Spinner />}
      {status === 'not_found' && (
        <Result $status="not_found">
          <StatusBanner $status="not_found">❌ Title Deed not found in DLD registry. Verify the number and retry.</StatusBanner>
          <button onClick={handleReset} style={{ display: 'block', margin: '0.5rem auto 0', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Try another number</button>
        </Result>
      )}
      {(status === 'verified' || status === 'encumbered') && result && (
        <Result $status={status}>
          <StatusBanner $status={status}>{status === 'verified' ? '✅ Title Deed Verified — Clear Title' : '⚠️ Active Mortgage Registered — Encumbered'}</StatusBanner>
          <ResultRow><ResultLabel>Title Deed No.</ResultLabel><ResultValue>{result.titleDeedNumber}</ResultValue></ResultRow>
          <ResultRow><ResultLabel>Owner</ResultLabel><ResultValue>{result.ownerName}</ResultValue></ResultRow>
          <ResultRow><ResultLabel>Property</ResultLabel><ResultValue>{result.propertyAddress}</ResultValue></ResultRow>
          <ResultRow><ResultLabel>Community</ResultLabel><ResultValue>{result.community}</ResultValue></ResultRow>
          <ResultRow><ResultLabel>Plot No.</ResultLabel><ResultValue>{result.plotNumber}</ResultValue></ResultRow>
          <ResultRow><ResultLabel>BUA</ResultLabel><ResultValue>{result.buaSqft.toLocaleString()} sqft</ResultValue></ResultRow>
          <ResultRow><ResultLabel>Reg. Date</ResultLabel><ResultValue>{result.registrationDate}</ResultValue></ResultRow>
          <ResultRow><ResultLabel>DLD Status</ResultLabel><ResultValue style={{ textTransform: 'capitalize' }}>{result.dldStatus}</ResultValue></ResultRow>
        </Result>
      )}
    </Root>
  );
};
export default TitleDeedVerificationPortal;
