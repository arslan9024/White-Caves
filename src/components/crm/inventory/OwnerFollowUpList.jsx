import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  AlertCircle,
  ArrowUpDown,
} from 'lucide-react';
import './OwnerFollowUpList.css';

const OwnerFollowUpList = ({ owners = [], onFollowUp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('last-contact');
  const [expandedId, setExpandedId] = useState(null);

  const statuses = [
    { value: 'all', label: 'All Owners', color: '#6b7280' },
    { value: 'never-contacted', label: 'Never Contacted', color: '#dc2626' },
    { value: 'contacted', label: 'Contacted', color: '#3b82f6' },
    { value: 'follow-up-due', label: 'Follow-up Due', color: '#f59e0b' },
    { value: 'follow-up-complete', label: 'Follow-up Complete', color: '#10b981' },
  ];

  const sortOptions = [
    { value: 'last-contact', label: 'Last Contact' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'phone', label: 'Has Phone' },
    { value: 'email', label: 'Has Email' },
    { value: 'follow-up-date', label: 'Next Follow-up' },
  ];

  // Filter and sort owners
  const filteredOwners = useMemo(() => {
    let filtered = owners.filter((owner) => {
      const matchesSearch =
        !searchTerm ||
        owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === 'all' || owner.contactStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'last-contact':
          const aDate = new Date(a.lastContactDate || 0);
          const bDate = new Date(b.lastContactDate || 0);
          return bDate - aDate;
        case 'follow-up-date':
          const aFollow = new Date(a.nextFollowUpDate || Infinity);
          const bFollow = new Date(b.nextFollowUpDate || Infinity);
          return aFollow - bFollow;
        case 'phone':
          return (b.phones?.length || 0) - (a.phones?.length || 0);
        case 'email':
          return (b.emails?.length || 0) - (a.emails?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [owners, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status) => {
    return statuses.find((s) => s.value === status)?.color || '#6b7280';
  };

  const getStatusLabel = (status) => {
    return statuses.find((s) => s.value === status)?.label || status;
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
  };

  const getDaysUntilFollowUp = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!owners || owners.length === 0) {
    return (
      <div className="owner-follow-up-list empty">
        <div className="empty-state">
          <Users size={48} />
          <p>No owners to follow up with</p>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-follow-up-list">
      <div className="list-header">
        <h2>Owner Follow-ups</h2>
        <span className="count-badge">{filteredOwners.length}</span>
      </div>

      {/* Search & Filter Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <ArrowUpDown size={18} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Total</span>
          <span className="stat-value">{filteredOwners.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Never Contacted</span>
          <span className="stat-value warning">
            {filteredOwners.filter((o) => o.contactStatus === 'never-contacted').length}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Follow-up Due</span>
          <span className="stat-value alert">
            {filteredOwners.filter((o) => o.contactStatus === 'follow-up-due').length}
          </span>
        </div>
      </div>

      {/* Owners List */}
      <div className="owners-list">
        {filteredOwners.length === 0 ? (
          <div className="no-results">
            <AlertCircle size={24} />
            <p>No owners match your filters</p>
          </div>
        ) : (
          filteredOwners.map((owner) => {
            const isExpanded = expandedId === owner.id;
            const daysUntilFollowUp = getDaysUntilFollowUp(owner.nextFollowUpDate);

            return (
              <div key={owner.id} className="owner-item">
                <div
                  className="owner-header"
                  onClick={() => setExpandedId(isExpanded ? null : owner.id)}
                >
                  <div className="owner-info">
                    <div className="owner-name">{owner.name}</div>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(owner.contactStatus) }}
                    >
                      {getStatusLabel(owner.contactStatus)}
                    </span>
                  </div>

                  <div className="owner-actions">
                    {owner.lastContactDate && (
                      <div className="last-contact">
                        <Clock size={14} />
                        <span>{formatDate(owner.lastContactDate)}</span>
                      </div>
                    )}

                    {daysUntilFollowUp !== null && (
                      <div
                        className={`follow-up-days ${
                          daysUntilFollowUp <= 0 ? 'overdue' : ''
                        }`}
                      >
                        <Calendar size={14} />
                        <span>
                          {daysUntilFollowUp <= 0
                            ? `${Math.abs(daysUntilFollowUp)} days overdue`
                            : `In ${daysUntilFollowUp} days`}
                        </span>
                      </div>
                    )}

                    <ChevronDown
                      size={18}
                      className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="owner-details">
                    {/* Contact Information */}
                    <div className="detail-section">
                      <h4>Contact Information</h4>
                      <div className="contact-list">
                        {owner.phones && owner.phones.length > 0 && (
                          <div className="contact-item">
                            <Phone size={14} />
                            <div className="contact-content">
                              <span className="contact-type">Phone</span>
                              <a href={`tel:${owner.phones[0]}`}>{owner.phones[0]}</a>
                              {owner.phones.length > 1 && (
                                <span className="extra-count">
                                  +{owner.phones.length - 1} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {owner.emails && owner.emails.length > 0 && (
                          <div className="contact-item">
                            <Mail size={14} />
                            <div className="contact-content">
                              <span className="contact-type">Email</span>
                              <a href={`mailto:${owner.emails[0]}`}>
                                {owner.emails[0]}
                              </a>
                              {owner.emails.length > 1 && (
                                <span className="extra-count">
                                  +{owner.emails.length - 1} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact History */}
                    {owner.contactHistory && owner.contactHistory.length > 0 && (
                      <div className="detail-section">
                        <h4>Recent Interactions</h4>
                        <div className="history-list">
                          {owner.contactHistory.slice(0, 3).map((history, idx) => (
                            <div key={idx} className="history-item">
                              <MessageSquare size={14} />
                              <div className="history-content">
                                <span className="history-type">{history.type}</span>
                                <span className="history-date">
                                  {formatDate(history.date)}
                                </span>
                                {history.outcome && (
                                  <span className="history-outcome">{history.outcome}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Actions */}
                    <div className="detail-section actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => onFollowUp && onFollowUp(owner.id, 'phone')}
                      >
                        <Phone size={14} /> Call Now
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => onFollowUp && onFollowUp(owner.id, 'email')}
                      >
                        <Mail size={14} /> Send Email
                      </button>
                      <button
                        className="btn btn-tertiary"
                        onClick={() => onFollowUp && onFollowUp(owner.id, 'note')}
                      >
                        <MessageSquare size={14} /> Add Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OwnerFollowUpList;
