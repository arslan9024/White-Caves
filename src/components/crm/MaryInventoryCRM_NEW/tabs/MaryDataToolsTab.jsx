import React, { useState } from 'react';
import { Database, FileImage, Globe, Search, Settings } from 'lucide-react';
import DamacAssetFetcher from '../../inventory/DamacAssetFetcher';
import ImageDataExtractor from '../../inventory/ImageDataExtractor';
import WebDataHarvester from '../../inventory/WebDataHarvester';

export default function MaryDataToolsTab() {
  const [activeToolTab, setActiveToolTab] = useState('assets');

  const handleDataExtracted = (data) => {
    console.log('Data extracted:', data);
  };

  const handleDataHarvested = (data) => {
    console.log('Data harvested:', data);
  };

  return (
    <div className="data-tools-view">
      <div className="view-header">
        <h3>Data Collection & Management Tools</h3>
        <p className="view-subtitle">Advanced tools for property data extraction and analysis</p>
      </div>

      <div className="data-tools-container">
        {/* Tool Tabs */}
        <div className="tool-tabs">
          <button
            className={`tool-tab ${activeToolTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveToolTab('assets')}
          >
            <Database size={16} />
            Asset Library
          </button>
          <button
            className={`tool-tab ${activeToolTab === 'ocr' ? 'active' : ''}`}
            onClick={() => setActiveToolTab('ocr')}
          >
            <FileImage size={16} />
            OCR Scanner
          </button>
          <button
            className={`tool-tab ${activeToolTab === 'harvester' ? 'active' : ''}`}
            onClick={() => setActiveToolTab('harvester')}
          >
            <Globe size={16} />
            Web Harvester
          </button>
        </div>

        {/* Tool Content */}
        <div className="tool-content">
          {activeToolTab === 'assets' && <DamacAssetFetcher selectedProperty={null} />}
          {activeToolTab === 'ocr' && <ImageDataExtractor onDataExtracted={handleDataExtracted} />}
          {activeToolTab === 'harvester' && <WebDataHarvester onDataHarvested={handleDataHarvested} />}
        </div>
      </div>

      {/* Tools Description */}
      <div className="tools-grid">
        <div className="tool-card">
          <Database size={24} />
          <h4>Asset Fetcher</h4>
          <p>Connect to property databases like DAMAC for real-time asset data</p>
          <button className="btn btn-primary" disabled>Active</button>
        </div>
        <div className="tool-card">
          <FileImage size={24} />
          <h4>Image Scanner</h4>
          <p>Extract data from property images using OCR</p>
          <button className="btn btn-secondary" disabled>Coming Soon</button>
        </div>
        <div className="tool-card">
          <Globe size={24} />
          <h4>Web Harvester</h4>
          <p>Scrape property data from web sources</p>
          <button className="btn btn-secondary" disabled>Coming Soon</button>
        </div>
      </div>
    </div>
  );
}
