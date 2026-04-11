import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Image, Download, Search, Loader2, CheckCircle, 
  XCircle, Grid, List, ExternalLink, Plus, Trash2
} from 'lucide-react';
import {
  DamacFetcherContainer,
  FetcherHeader,
  HeaderInfo,
  ViewToggle,
  ViewToggleButton,
  FetcherInputs,
  InputGroup,
  InputLabel,
  AutoFillButton,
  TextArea,
  FetcherActions,
  FetchButton,
  SpinningIcon,
  ResultsSummary,
  SummaryItem,
  AssetsGrid,
  AssetCard,
  AssetImage,
  SelectionBadge,
  AssetInfo,
  AssetSD,
  AssetRegistration,
  AssetType,
  OpenLink,
  NotFoundSection,
  NotFoundList,
  NotFoundItem
} from './DamacAssetFetcher.styles';

const DAMAC_BASE_URL = 'https://s3.eu-west-1.amazonaws.com/damac-inv/otp/';

interface DamacAsset {
  id: string;
  sdNumber: string;
  regNumber: string | null;
  url: string;
  type: string;
  found?: boolean;
  error?: string;
  valid?: boolean;
  status?: string;
}

interface DamacAssetFetcherProps {
  selectedProperty?: {
    id: string;
    name?: string;
    sdNumbers?: string[];
    registrationNumbers?: string[];
  } | null;
}

const DamacAssetFetcher: React.FC<DamacAssetFetcherProps> = ({ selectedProperty }) => {
  const [sdNumbers, setSdNumbers] = useState('');
  const [regNumbers, setRegNumbers] = useState('');
  const [assets, setAssets] = useState<DamacAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    return () => { isCancelledRef.current = true; };
  }, []);

  const buildUrls = useCallback((sdList: string, regList: string): DamacAsset[] => {
    const urls: DamacAsset[] = [];
    const sds = sdList.split('\n').map(s => s.trim()).filter(Boolean);
    const regs = regList.split('\n').map(s => s.trim()).filter(Boolean);

    sds.forEach(sd => {
      urls.push({
        id: `${sd}-primary`,
        sdNumber: sd,
        regNumber: null,
        url: `${DAMAC_BASE_URL}${sd}.jpg`,
        type: 'primary'
      });

      if (regs.length > 0) {
        regs.forEach(reg => {
          urls.push({
            id: `${sd}-${reg}`,
            sdNumber: sd,
            regNumber: reg,
            url: `${DAMAC_BASE_URL}${sd}${reg}.jpg`,
            type: 'variant'
          });
        });
      }
    });

    return urls;
  }, []);

  const checkImageUrl = async (urlObj: DamacAsset): Promise<DamacAsset> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ ...urlObj, status: 'found', valid: true });
      img.onerror = () => resolve({ ...urlObj, status: 'not_found', valid: false });
      img.src = urlObj.url;
    });
  };

  const handleFetch = async () => {
    if (!sdNumbers.trim()) return;
    
    isCancelledRef.current = false;
    setLoading(true);
    setAssets([]);
    
    const urlsToCheck = buildUrls(sdNumbers, regNumbers);
    setProgress({ current: 0, total: urlsToCheck.length });
    
    const results: DamacAsset[] = [];
    for (let i = 0; i < urlsToCheck.length; i++) {
      if (isCancelledRef.current) break;
      const result = await checkImageUrl(urlsToCheck[i]);
      if (isCancelledRef.current) break;
      results.push(result);
      setProgress({ current: i + 1, total: urlsToCheck.length });
      setAssets([...results]);
    }
    
    if (!isCancelledRef.current) {
      setLoading(false);
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const downloadSelected = () => {
    selectedAssets.forEach(assetId => {
      const asset = assets.find(a => a.id === assetId);
      if (asset?.valid) {
        window.open(asset.url, '_blank', 'noopener,noreferrer');
      }
    });
  };

  const validAssets = assets.filter(a => a.valid);
  const invalidAssets = assets.filter(a => !a.valid);

  const populateFromProperty = () => {
    if (selectedProperty) {
      const pNumber = (selectedProperty as Record<string, unknown>).pNumber as string || '';
      const sdMatch = pNumber.match(/SD\d+/i);
      if (sdMatch) {
        setSdNumbers(sdMatch[0]);
      }
    }
  };

  return (
    <DamacFetcherContainer>
      <FetcherHeader>
        <HeaderInfo>
          <Image size={24} />
          <div>
            <h3>DAMAC Asset Fetcher</h3>
            <span>Fetch property images from DAMAC S3 bucket</span>
          </div>
        </HeaderInfo>
        <ViewToggle>
          <ViewToggleButton 
            $active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
          </ViewToggleButton>
          <ViewToggleButton 
            $active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </ViewToggleButton>
        </ViewToggle>
      </FetcherHeader>

      <FetcherInputs>
        <InputGroup>
          <InputLabel>
            SD Numbers (one per line)
            {selectedProperty && (
              <AutoFillButton onClick={populateFromProperty}>
                <Plus size={12} /> From Property
              </AutoFillButton>
            )}
          </InputLabel>
          <TextArea
            value={sdNumbers}
            onChange={(e) => setSdNumbers(e.target.value)}
            placeholder="SD348&#10;SD349&#10;SD205"
            rows={4}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel>Registration Numbers (optional, one per line)</InputLabel>
          <TextArea
            value={regNumbers}
            onChange={(e) => setRegNumbers(e.target.value)}
            placeholder="XG1349B&#10;XG1350A"
            rows={4}
          />
        </InputGroup>
      </FetcherInputs>

      <FetcherActions>
        <FetchButton 
          $variant="primary"
          onClick={handleFetch}
          disabled={loading || !sdNumbers.trim()}
        >
          {loading ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Fetching {progress.current}/{progress.total}
            </>
          ) : (
            <>
              <Search size={18} />
              Fetch Assets
            </>
          )}
        </FetchButton>
        
        {selectedAssets.length > 0 && (
          <FetchButton onClick={downloadSelected}>
            <Download size={18} />
            Download Selected ({selectedAssets.length})
          </FetchButton>
        )}

        {assets.length > 0 && (
          <FetchButton $variant="danger" onClick={() => { setAssets([]); setSelectedAssets([]); }}>
            <Trash2 size={18} />
            Clear Results
          </FetchButton>
        )}
      </FetcherActions>

      {assets.length > 0 && (
        <ResultsSummary>
          <SummaryItem $variant="success">
            <CheckCircle size={16} />
            <span>{validAssets.length} Found</span>
          </SummaryItem>
          <SummaryItem $variant="error">
            <XCircle size={16} />
            <span>{invalidAssets.length} Not Found</span>
          </SummaryItem>
        </ResultsSummary>
      )}

      {validAssets.length > 0 && (
        <AssetsGrid $viewMode={viewMode}>
          {validAssets.map(asset => (
            <AssetCard 
              key={asset.id}
              $selected={selectedAssets.includes(asset.id)}
              onClick={() => toggleAssetSelection(asset.id)}
            >
              <AssetImage>
                <img src={asset.url} alt={asset.sdNumber} loading="lazy" width={200} height={150} />
                {selectedAssets.includes(asset.id) && (
                  <SelectionBadge>
                    <CheckCircle size={20} />
                  </SelectionBadge>
                )}
              </AssetImage>
              <AssetInfo>
                <AssetSD>{asset.sdNumber}</AssetSD>
                {asset.regNumber && <AssetRegistration>{asset.regNumber}</AssetRegistration>}
                <AssetType $type={asset.type}>{asset.type}</AssetType>
              </AssetInfo>
              <OpenLink 
                href={asset.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} />
              </OpenLink>
            </AssetCard>
          ))}
        </AssetsGrid>
      )}

      {invalidAssets.length > 0 && (
        <NotFoundSection>
          <h4>Not Found ({invalidAssets.length})</h4>
          <NotFoundList>
            {invalidAssets.map(asset => (
              <NotFoundItem key={asset.id}>
                {asset.sdNumber}{asset.regNumber ? `/${asset.regNumber}` : ''}
              </NotFoundItem>
            ))}
          </NotFoundList>
        </NotFoundSection>
      )}
    </DamacFetcherContainer>
  );
};

export default DamacAssetFetcher;
