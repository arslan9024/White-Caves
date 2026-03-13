import React from 'react';
import { Eye, MessageSquare, Star, Home, Edit, Trash2 } from 'lucide-react';

export default function ListingsTab({ state }) {
  const { listings, listingStats } = state;

  return (
    <div className="listings-view">
      <div className="view-header">
        <h3>Property Listing Performance</h3>
        <p className="view-subtitle">Monitor and optimize property listings</p>
      </div>

      <div className="listing-stats">
        <div className="stat-card">
          <Eye size={20} />
          <div className="stat-info">
            <span className="stat-value">{listingStats.totalViews.toLocaleString()}</span>
            <span className="stat-label">Total Views</span>
          </div>
        </div>
        <div className="stat-card">
          <MessageSquare size={20} />
          <div className="stat-info">
            <span className="stat-value">{listingStats.totalInquiries}</span>
            <span className="stat-label">Inquiries</span>
          </div>
        </div>
        <div className="stat-card">
          <Star size={20} />
          <div className="stat-info">
            <span className="stat-value">{listingStats.avgQuality}%</span>
            <span className="stat-label">Avg Quality</span>
          </div>
        </div>
        <div className="stat-card">
          <Home size={20} />
          <div className="stat-info">
            <span className="stat-value">{listingStats.availableListings}</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
      </div>

      <div className="listings-grid">
        {listings.map(listing => (
          <div key={listing.id} className="listing-card">
            <div className="card-header">
              <h4>{listing.property}</h4>
              <span className="quality-score" style={{ backgroundColor: listing.quality >= 90 ? '#10b981' : '#f59e0b' }}>
                {listing.quality}%
              </span>
            </div>

            <div className="card-metrics">
              <div className="metric">
                <Eye size={16} />
                <span>{listing.views.toLocaleString()} views</span>
              </div>
              <div className="metric">
                <MessageSquare size={16} />
                <span>{listing.inquiries} inquiries</span>
              </div>
            </div>

            <div className="card-availability">
              <span className="label">Available Units:</span>
              <span className="value">{listing.available}</span>
            </div>

            <div className="card-actions">
              <button className="btn btn-secondary">View Listing</button>
              <button className="icon-btn"><Edit size={16} /></button>
              <button className="icon-btn danger"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
