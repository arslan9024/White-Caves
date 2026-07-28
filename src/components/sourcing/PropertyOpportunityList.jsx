import React, { useState, useMemo } from 'react';
import { Filter, Search, CheckCircle, AlertCircle, Clock, ArrowUpRight, MapPin, Home, DollarSign } from 'lucide-react';
import './PropertyOpportunityList.css';

/**
 * Property Opportunity List
 * Displays property opportunities extracted from conversations
 * with filtering, sorting, and verification workflow
 */
export default function PropertyOpportunityList() {
  const [opportunities, setOpportunities] = useState([
    {
      id: 'opp_1',
      propertyType: 'villa',
      location: 'Arabian Ranches',
      bedrooms: 4,
      price: 8000,
      currency: 'AED',
      availability: 'for_rent',
      ownerName: 'Ahmed Al Mansouri',
      ownerPhone: '+971501234567',
      confidence: 92,
      status: 'initial_detection',
      extractedAt: '2 hours ago',
      completeness: 85
    },
    {
      id: 'opp_2',
      propertyType: 'apartment',
      location: 'Downtown Dubai',
      bedrooms: 2,
      price: 4500,
      currency: 'AED',
      availability: 'for_rent',
      ownerName: 'Fatima Al Mazrouei',
      ownerPhone: '+971502345678',
      confidence: 78,
      status: 'waiting_for_photos',
      extractedAt: '5 hours ago',
      completeness: 65
    },
    {
      id: 'opp_3',
      propertyType: 'penthouse',
      location: 'Marina',
      bedrooms: 3,
      price: 25000000,
      currency: 'AED',
      availability: 'for_sale',
      ownerName: 'Sarah Johnson',
      ownerPhone: '+971504567890',
      confidence: 85,
      status: 'partially_verified',
      extractedAt: '1 day ago',
      completeness: 72
    },
    {
      id: 'opp_4',
      propertyType: 'townhouse',
      location: 'Jumeirah',
      bedrooms: 3,
      price: 6000,
      currency: 'AED',
      availability: 'for_rent',
      ownerName: 'Khalid Rashid',
      ownerPhone: '+971505678901',
      confidence: 88,
      status: 'fully_verified',
      extractedAt: '3 days ago',
      completeness: 100
    },
    {
      id: 'opp_5',
      propertyType: 'studio',
      location: 'JLT',
      bedrooms: 0,
      price: 2200,
      currency: 'AED',
      availability: 'for_rent',
      ownerName: 'Omar Al Noor',
      ownerPhone: '+971506789012',
      confidence: 65,
      status: 'initial_detection',
      extractedAt: '4 hours ago',
      completeness: 50
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState(0);
  const [sortBy, setSortBy] = useState('confidence');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Filter and sort opportunities
  const filteredAndSorted = useMemo(() => {
    let filtered = opportunities.filter(opp => {
      const matchesSearch = opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.propertyType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || opp.status === filterStatus;
      const matchesConfidence = opp.confidence >= filterConfidence;
      
      return matchesSearch && matchesStatus && matchesConfidence;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'completeness':
          return b.completeness - a.completeness;
        case 'recent':
          return new Date(b.extractedAt) - new Date(a.extractedAt);
        case 'price':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [opportunities, searchTerm, filterStatus, filterConfidence, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'initial_detection':
        return { bg: '#fef3c7', text: '#92400e', label: 'Detected' };
      case 'waiting_for_photos':
        return { bg: '#dbeafe', text: '#1e40af', label: 'Awaiting Photos' };
      case 'partially_verified':
        return { bg: '#fce7f3', text: '#831843', label: 'Partially Verified' };
      case 'fully_verified':
        return { bg: '#dcfce7', text: '#166534', label: 'Verified' };
      default:
        return { bg: '#f3f4f6', text: '#374151', label: status };
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return '#10B981';
    if (confidence >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const handleAddToInventory = (opportunity) => {
    if (opportunity.status !== 'fully_verified') {
      console.warn('Property must be fully verified before adding to inventory');
      return;
    }
    // In production: call PropertySourcingService.convertOpportunityToProperty
    console.log('Adding to inventory:', opportunity);
  };

  const handleUpdateStatus = (opportunityId, newStatus) => {
    setOpportunities(opps => opps.map(opp =>
      opp.id === opportunityId ? { ...opp, status: newStatus } : opp
    ));
  };

  return (
    <div className="opportunity-list">
      {/* Header */}
      <div className="opportunity-header">
        <div className="header-title">
          <Home size={24} />
          <div>
            <h1>Property Opportunities</h1>
            <p>Manage and verify properties discovered from conversations</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-value">{opportunities.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">{opportunities.filter(o => o.confidence >= 80).length}</span>
            <span className="stat-label">High Confidence</span>
          </div>
          <div className="stat">
            <span className="stat-value">{opportunities.filter(o => o.status === 'fully_verified').length}</span>
            <span className="stat-label">Verified</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by location, owner, property type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="initial_detection">Detected</option>
              <option value="waiting_for_photos">Awaiting Photos</option>
              <option value="partially_verified">Partially Verified</option>
              <option value="fully_verified">Fully Verified</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Confidence Score</label>
            <div className="confidence-slider">
              <input
                type="range"
                min="0"
                max="100"
                value={filterConfidence}
                onChange={(e) => setFilterConfidence(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-value">≥ {filterConfidence}%</div>
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="confidence">Confidence (High to Low)</option>
              <option value="completeness">Completeness (High to Low)</option>
              <option value="recent">Most Recent</option>
              <option value="price">Price (High to Low)</option>
            </select>
          </div>
        </div>
      )}

      {/* Opportunities Grid */}
      <div className="opportunities-grid">
        {filteredAndSorted.length === 0 ? (
          <div className="empty-state">
            <Home size={48} />
            <h3>No opportunities found</h3>
            <p>Try adjusting your filters or check back later for new property opportunities</p>
          </div>
        ) : (
          filteredAndSorted.map(opp => {
            const statusColor = getStatusColor(opp.status);
            return (
              <div
                key={opp.id}
                className="opportunity-card"
                onClick={() => setSelectedOpportunity(selectedOpportunity?.id === opp.id ? null : opp)}
              >
                {/* Card Header */}
                <div className="card-header">
                  <div className="card-title">
                    <h3>{opp.propertyType.charAt(0).toUpperCase() + opp.propertyType.slice(1)}</h3>
                    <div className="property-meta">
                      <span className="meta-badge">
                        <MapPin size={14} /> {opp.location}
                      </span>
                      <span className="meta-badge">
                        <Home size={14} /> {opp.bedrooms} BR
                      </span>
                    </div>
                  </div>

                  <div className="card-badges">
                    <div
                      className="confidence-badge"
                      style={{ backgroundColor: getConfidenceColor(opp.confidence) }}
                      title={`${opp.confidence}% confidence score`}
                    >
                      {opp.confidence}%
                    </div>
                    <div
                      className="status-badge"
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text
                      }}
                    >
                      {statusColor.label}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  {/* Completeness Bar */}
                  <div className="completeness-section">
                    <div className="completeness-header">
                      <label>Data Completeness</label>
                      <span className="percentage">{opp.completeness}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${opp.completeness}%`,
                          backgroundColor: opp.completeness >= 80 ? '#10B981' : '#F59E0B'
                        }}
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Price</span>
                      <span className="detail-value">
                        <DollarSign size={14} />
                        {opp.price.toLocaleString()} {opp.currency}
                        <span className="frequency">{opp.availability === 'for_rent' ? '/month' : ''}</span>
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Availability</span>
                      <span className="detail-value">
                        {opp.availability === 'for_rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Owner</span>
                      <span className="detail-value">{opp.ownerName}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value detail-phone">{opp.ownerPhone}</span>
                    </div>

                    <div className="detail-item full-width">
                      <span className="detail-label">Extracted</span>
                      <span className="detail-value">
                        <Clock size={14} /> {opp.extractedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Actions */}
                {selectedOpportunity?.id === opp.id && (
                  <div className="card-footer">
                    {opp.status !== 'fully_verified' && (
                      <button
                        className="action-btn action-verify"
                        onClick={() => handleUpdateStatus(opp.id, 'fully_verified')}
                      >
                        <CheckCircle size={16} /> Mark as Verified
                      </button>
                    )}

                    {opp.status === 'initial_detection' && (
                      <>
                        <button
                          className="action-btn action-photos"
                          onClick={() => handleUpdateStatus(opp.id, 'waiting_for_photos')}
                        >
                          <AlertCircle size={16} /> Request Photos
                        </button>
                      </>
                    )}

                    {opp.status === 'fully_verified' && (
                      <button
                        className="action-btn action-add"
                        onClick={() => handleAddToInventory(opp)}
                      >
                        <ArrowUpRight size={16} /> Add to Mary Inventory
                      </button>
                    )}

                    <button className="action-btn action-contact">
                      Contact Owner
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
