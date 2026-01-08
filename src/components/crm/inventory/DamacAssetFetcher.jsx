import React, { useState, useCallback } from 'react';
import { 
  Image, Download, Search, Loader2, CheckCircle, 
  XCircle, Grid, List, ExternalLink, Plus, Trash2
} from 'lucide-react';
import './DamacAssetFetcher.css';

const DAMAC_BASE_URL = 'https://s3.eu-west-1.amazonaws.com/damac-inv/otp/';

const DamacAssetFetcher = ({ selectedProperty }) => {
  const [sdNumbers, setSdNumbers] = useState('');
  const [regNumbers, setRegNumbers] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAssets, setSelectedAssets] = useState([]);

  const buildUrls = useCallback((sdList, regList) => {
    const urls = [];
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

  const checkImageUrl = async (urlObj) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ ...urlObj, status: 'found', valid: true });
      img.onerror = () => resolve({ ...urlObj, status: 'not_found', valid: false });
      img.src = urlObj.url;
    });
  };

  const handleFetch = async () => {
    if (!sdNumbers.trim()) return;
    
    setLoading(true);
    setAssets([]);
    
    const urlsToCheck = buildUrls(sdNumbers, regNumbers);
    setProgress({ current: 0, total: urlsToCheck.length });
    
    const results = [];
    for (let i = 0; i < urlsToCheck.length; i++) {
      const result = await checkImageUrl(urlsToCheck[i]);
      results.push(result);
      setProgress({ current: i + 1, total: urlsToCheck.length });
      setAssets([...results]);
    }
    
    setLoading(false);
  };

  const toggleAssetSelection = (assetId) => {
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
        window.open(asset.url, '_blank');
      }
    });
  };

  const validAssets = assets.filter(a => a.valid);
  const invalidAssets = assets.filter(a => !a.valid);

  const populateFromProperty = () => {
    if (selectedProperty) {
      const pNumber = selectedProperty.pNumber || '';
      const sdMatch = pNumber.match(/SD\d+/i);
      if (sdMatch) {
        setSdNumbers(sdMatch[0]);
      }
    }
  };

  return (
    <div className="damac-fetcher">
      <div className="fetcher-header">
        <div className="header-info">
          <Image size={24} />
          <div>
            <h3>DAMAC Asset Fetcher</h3>
            <span>Fetch property images from DAMAC S3 bucket</span>
          </div>
        </div>
        <div className="view-toggle">
          <button 
            className={viewMode === 'grid' ? 'active' : ''} 
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''} 
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="fetcher-inputs">
        <div className="input-group">
          <label>
            SD Numbers (one per line)
            {selectedProperty && (
              <button className="auto-fill-btn" onClick={populateFromProperty}>
                <Plus size={12} /> From Property
              </button>
            )}
          </label>
          <textarea
            value={sdNumbers}
            onChange={(e) => setSdNumbers(e.target.value)}
            placeholder="SD348&#10;SD349&#10;SD205"
            rows={4}
          />
        </div>
        <div className="input-group">
          <label>Registration Numbers (optional, one per line)</label>
          <textarea
            value={regNumbers}
            onChange={(e) => setRegNumbers(e.target.value)}
            placeholder="XG1349B&#10;XG1350A"
            rows={4}
          />
        </div>
      </div>

      <div className="fetcher-actions">
        <button 
          className="fetch-btn primary" 
          onClick={handleFetch}
          disabled={loading || !sdNumbers.trim()}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spinning" />
              Fetching {progress.current}/{progress.total}
            </>
          ) : (
            <>
              <Search size={18} />
              Fetch Assets
            </>
          )}
        </button>
        
        {selectedAssets.length > 0 && (
          <button className="fetch-btn" onClick={downloadSelected}>
            <Download size={18} />
            Download Selected ({selectedAssets.length})
          </button>
        )}

        {assets.length > 0 && (
          <button className="fetch-btn danger" onClick={() => { setAssets([]); setSelectedAssets([]); }}>
            <Trash2 size={18} />
            Clear Results
          </button>
        )}
      </div>

      {assets.length > 0 && (
        <div className="results-summary">
          <div className="summary-item success">
            <CheckCircle size={16} />
            <span>{validAssets.length} Found</span>
          </div>
          <div className="summary-item error">
            <XCircle size={16} />
            <span>{invalidAssets.length} Not Found</span>
          </div>
        </div>
      )}

      {validAssets.length > 0 && (
        <div className={`assets-grid ${viewMode}`}>
          {validAssets.map(asset => (
            <div 
              key={asset.id} 
              className={`asset-card ${selectedAssets.includes(asset.id) ? 'selected' : ''}`}
              onClick={() => toggleAssetSelection(asset.id)}
            >
              <div className="asset-image">
                <img src={asset.url} alt={asset.sdNumber} loading="lazy" />
                {selectedAssets.includes(asset.id) && (
                  <div className="selection-badge">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
              <div className="asset-info">
                <span className="asset-sd">{asset.sdNumber}</span>
                {asset.regNumber && <span className="asset-reg">{asset.regNumber}</span>}
                <span className={`asset-type ${asset.type}`}>{asset.type}</span>
              </div>
              <a 
                href={asset.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="open-link"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {invalidAssets.length > 0 && (
        <div className="not-found-section">
          <h4>Not Found ({invalidAssets.length})</h4>
          <div className="not-found-list">
            {invalidAssets.map(asset => (
              <span key={asset.id} className="not-found-item">
                {asset.sdNumber}{asset.regNumber ? `/${asset.regNumber}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DamacAssetFetcher;
