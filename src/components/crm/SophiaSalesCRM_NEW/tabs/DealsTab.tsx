import React from 'react';
import { Search, Plus, Eye } from 'lucide-react';

interface Deal {
  id: string | number;
  property: string;
  client: string;
  value: number;
  stage: string;
  probability: number;
  agent: string;
}

interface DealsTabProps {
  deals: Deal[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterAgent: string;
  onFilterChange: (agent: string) => void;
}

const DealsTab: React.FC<DealsTabProps> = ({ deals, searchQuery, onSearchChange, filterAgent, onFilterChange }) => {
  return (
    <div className="deals-view">
      <div className="view-header">
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          />
        </div>
        <button className="add-btn"><Plus size={16} /> Add Deal</button>
      </div>
      <div className="deals-table">
        <div className="table-header">
          <span>Property</span>
          <span>Client</span>
          <span>Value</span>
          <span>Stage</span>
          <span>Probability</span>
          <span>Agent</span>
          <span>Actions</span>
        </div>
        {deals.map((deal: Deal) => (
          <div key={deal.id} className="table-row">
            <span className="property-name">{deal.property}</span>
            <span>{deal.client}</span>
            <span className="value">AED {(deal.value / 1000000).toFixed(1)}M</span>
            <span className={`stage-badge ${deal.stage}`}>{deal.stage}</span>
            <span className={`probability ${deal.probability >= 70 ? 'high' : deal.probability >= 50 ? 'medium' : 'low'}`}>
              {deal.probability}%
            </span>
            <span>{deal.agent}</span>
            <span className="actions">
              <button className="action-btn"><Eye size={14} /></button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsTab;
