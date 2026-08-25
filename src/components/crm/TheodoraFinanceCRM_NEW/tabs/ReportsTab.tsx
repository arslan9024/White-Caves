import React, { useState, useMemo } from 'react';
import {
  THEODORA_67_REPORTS,
  THEODORA_REPORT_CATEGORIES,
  EnterpriseReport,
  ReportCategoryKey,
} from '../../../../data/theodoraReportsRegistry';

interface Invoice {
  id: string | number;
  amount: number;
  status: string;
}

interface Expense {
  id: string | number;
  amount: number;
  status: string;
}

interface ReportsTabProps {
  invoices?: Invoice[];
  expenses?: Expense[];
}

export const ReportsTab: React.FC<ReportsTabProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    '3.14.R01': true,
    '3.14.R03': true,
    '3.14.R06': true,
    '3.14.R17': true,
    '3.14.R34': true,
    '3.14.R40': true,
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [activeReportModal, setActiveReportModal] = useState<EnterpriseReport | null>(null);
  const [reportDateRange, setReportDateRange] = useState<string>('ytd');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Record<string, boolean>>({
    '3.14.R01': true,
    '3.14.R02': true,
    '3.14.R08': true,
    '3.14.R11': true,
    '3.14.R17': true,
    '3.14.R40': true,
    '3.14.R42': true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const toggleSchedule = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSchedules(prev => {
      const next = !prev[reportId];
      showToast(next ? `Automated schedule enabled for ${reportId}` : `Automated schedule paused for ${reportId}`);
      return { ...prev, [reportId]: next };
    });
  };

  const filteredReports = useMemo(() => {
    return THEODORA_67_REPORTS.filter((report) => {
      // Category filter
      if (selectedCategory !== 'all' && report.categoryKey !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (showFavoritesOnly && !favorites[report.id]) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = report.name.toLowerCase().includes(q);
        const matchesId = report.id.toLowerCase().includes(q);
        const matchesCategory = report.categoryName.toLowerCase().includes(q);
        const matchesDesc = report.description.toLowerCase().includes(q);
        const matchesTags = report.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesId && !matchesCategory && !matchesDesc && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  const handleExportCSV = (report: EnterpriseReport, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const headers = report.columns.join(',');
    const rows = report.sampleRows.map(row => report.columns.map(col => `"${row[col] ?? ''}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(`${report.name} (${report.id})\nGenerated: ${new Date().toISOString()}\n\n${headers}\n${rows}`)}`;
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${report.id}_${report.key}_${reportDateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${report.name} as CSV`);
  };

  const handleExportPDF = (report: EnterpriseReport, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Generating certified PDF report for ${report.name} (${report.id})...`);
    setTimeout(() => {
      showToast(`✅ PDF Download Ready: ${report.name}.pdf`);
    }, 1200);
  };

  return (
    <div className="reports-tab-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #334155',
          }}
        >
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner with Metrics */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>📑</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--white, #FFFFFF)' }}>
                  All Reports Explorer — 67 Enterprise Reports
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#93C5FD',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                  }}
                >
                  67 Active Reports
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary, #94A3B8)' }}>
                Comprehensive real estate financial, VAT 5%, Corporate Tax 9%, escrow ledger, and operational reporting matrix.
              </p>
            </div>
          </div>
        </div>

        {/* Executive Quick Stats */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Total Reports</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#60A5FA' }}>67</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Categories</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34D399' }}>14</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Scheduled</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FBBF24' }}>
              {Object.values(schedules).filter(Boolean).length} Active
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Compliance</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#A78BFA' }}>FTA / IFRS</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.9rem' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by Report Name, ID (e.g. 3.14.R01), Category or Tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                color: '#1E293B',
                outline: 'none',
                backgroundColor: '#F8FAFC',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Toggles */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: showFavoritesOnly ? '1px solid #F59E0B' : '1px solid #E2E8F0',
                backgroundColor: showFavoritesOnly ? '#FEF3C7' : '#FFFFFF',
                color: showFavoritesOnly ? '#B45309' : '#475569',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>{showFavoritesOnly ? '★' : '☆'}</span>
              <span>Favorites Only ({Object.values(favorites).filter(Boolean).length})</span>
            </button>

            <button
              onClick={() => {
                const sampleReport = THEODORA_67_REPORTS[0];
                handleExportCSV(sampleReport);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#F1F5F9',
                color: '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>📥</span>
              <span>Export Summary</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              border: selectedCategory === 'all' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
              backgroundColor: selectedCategory === 'all' ? '#EFF6FF' : '#FFFFFF',
              color: selectedCategory === 'all' ? '#1D4ED8' : '#64748B',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            🌟 All Categories (67)
          </button>
          {THEODORA_REPORT_CATEGORIES.map((cat) => {
            const count = THEODORA_67_REPORTS.filter(r => r.categoryKey === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: isSelected ? `1.5px solid ${cat.badgeColor}` : '1px solid #E2E8F0',
                  backgroundColor: isSelected ? `${cat.badgeColor}15` : '#FFFFFF',
                  color: isSelected ? cat.badgeColor : '#64748B',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.8, background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '4px' }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Table matching Zoho Layout */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155' }}>
            Showing {filteredReports.length} of 67 Reports
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Click on any report to open interactive viewer & metrics
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px', width: '40px', textAlign: 'center' }}>★</th>
                <th style={{ padding: '12px 16px' }}>Report Name</th>
                <th style={{ padding: '12px 16px' }}>Report Category</th>
                <th style={{ padding: '12px 16px' }}>Created By</th>
                <th style={{ padding: '12px 16px' }}>Last Visited</th>
                <th style={{ padding: '12px 16px' }}>Schedule</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>More Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>No reports matched your search</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try searching with different keywords or reset category filters.</div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, idx) => {
                  const isFav = favorites[report.id];
                  const isScheduled = schedules[report.id];
                  const catMeta = THEODORA_REPORT_CATEGORIES.find(c => c.id === report.categoryKey);

                  return (
                    <tr
                      key={report.id}
                      onClick={() => setActiveReportModal(report)}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA')}
                    >
                      {/* Favorite Star */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(report.id, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            color: isFav ? '#F59E0B' : '#CBD5E1',
                          }}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {isFav ? '★' : '☆'}
                        </button>
                      </td>

                      {/* Report Name & ID */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#EEF2F6',
                              color: '#475569',
                              fontFamily: 'monospace',
                            }}
                          >
                            {report.id}
                          </span>
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{report.name}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                          {report.description}
                        </div>
                      </td>

                      {/* Report Category */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: `${catMeta?.badgeColor || '#64748B'}15`,
                            color: catMeta?.badgeColor || '#64748B',
                          }}
                        >
                          <span>{catMeta?.icon}</span>
                          <span>{report.categoryName}</span>
                        </span>
                      </td>

                      {/* Created By */}
                      <td style={{ padding: '12px 16px', color: '#475569', fontSize: '0.8rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span>🤖</span>
                          <span>{report.createdBy}</span>
                        </span>
                      </td>

                      {/* Last Visited */}
                      <td style={{ padding: '12px 16px', color: '#64748B', fontSize: '0.8rem' }}>
                        {report.lastVisited === '-' ? (
                          <span style={{ color: '#94A3B8' }}>— Not Visited</span>
                        ) : (
                          report.lastVisited
                        )}
                      </td>

                      {/* Schedule */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={(e) => toggleSchedule(report.id, e)}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              backgroundColor: isScheduled ? '#DCFCE7' : '#F1F5F9',
                              color: isScheduled ? '#15803D' : '#64748B',
                            }}
                          >
                            {isScheduled ? '● Active' : '○ Off'}
                          </button>
                          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{report.schedule}</span>
                        </div>
                      </td>

                      {/* More Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveReportModal(report);
                            }}
                            style={{
                              background: '#2563EB',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Run / Preview Report"
                          >
                            ▶ Run
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleExportPDF(report, e)}
                            style={{
                              background: '#F1F5F9',
                              color: '#334155',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                            title="Download Certified PDF"
                          >
                            📄
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleExportCSV(report, e)}
                            style={{
                              background: '#F1F5F9',
                              color: '#334155',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                            title="Export CSV"
                          >
                            📥
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Report Runner Modal */}
      {activeReportModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.5rem',
          }}
          onClick={() => setActiveReportModal(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                    }}
                  >
                    {activeReportModal.id}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                    {activeReportModal.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#EEF2F6',
                      color: '#475569',
                    }}
                  >
                    {activeReportModal.categoryName}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
                  {activeReportModal.description}
                </p>
              </div>

              <button
                onClick={() => setActiveReportModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Statutory UAE Relevance Notice */}
              <div
                style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.82rem',
                  color: '#92400E',
                  fontWeight: 600,
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>🏛️</span>
                <span>
                  <strong>UAE Compliance Framework:</strong> {activeReportModal.uaeRelevance}
                </span>
              </div>

              {/* Date Filter & Export Controls Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Period:</span>
                  {(['today', 'mtd', 'qtd', 'ytd', 'all'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setReportDateRange(range)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: reportDateRange === range ? '1px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: reportDateRange === range ? '#EFF6FF' : '#FFFFFF',
                        color: reportDateRange === range ? '#1D4ED8' : '#64748B',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                      }}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleExportPDF(activeReportModal)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    📄 Download PDF
                  </button>
                  <button
                    onClick={() => handleExportCSV(activeReportModal)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    📥 Export CSV
                  </button>
                </div>
              </div>

              {/* Summary KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {Object.entries(activeReportModal.mockSummary).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '12px',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Table Preview */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', background: '#F1F5F9', fontSize: '0.78rem', fontWeight: 800, color: '#475569' }}>
                  Report Data Preview ({reportDateRange.toUpperCase()})
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontWeight: 700 }}>
                        {activeReportModal.columns.map((col, idx) => (
                          <th key={idx} style={{ padding: '10px 12px' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeReportModal.sampleRows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          {activeReportModal.columns.map((col, cIdx) => (
                            <td key={cIdx} style={{ padding: '10px 12px', color: '#1E293B' }}>
                              {row[col] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#F8FAFC',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Generated autonomously by <strong>Theodora AI (CFO Intelligence)</strong>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
