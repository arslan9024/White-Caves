import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * VATDashboard Component
 * Complete VAT management dashboard with metrics, filing status, and actions
 * Integrates with Fatima assistant for VAT filing support
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.vatMetrics - VAT metrics {totalVAT, collectedVAT, payableVAT, filingStatus}
 * @param {Array} props.returns - VAT returns list
 * @param {Array} props.upcomingFilings - Upcoming filing deadlines
 * @param {Function} props.onFileVAT - File VAT return callback
 * @param {Function} props.onDownloadReport - Download report callback
 */
const VATDashboard = ({
  vatMetrics = {
    totalVAT: 45230,
    collectedVAT: 38900,
    payableVAT: 6330,
    filingStatus: 'Due Soon'
  },
  returns = [],
  upcomingFilings = [],
  onFileVAT = () => {},
  onDownloadReport = () => {}
}) => {
  const [expandedReturn, setExpandedReturn] = useState(null);
  const [activeTab, setActiveTab] = useState('returns');

  const MetricCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
          {trend && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${
            color === 'text-red-600' 
              ? 'bg-red-100 dark:bg-red-900/20' 
              : 'bg-blue-100 dark:bg-blue-900/20'
          }`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            VAT Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your VAT filings and track returns
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Total VAT"
            value={`$${(vatMetrics.totalVAT / 1000).toFixed(1)}K`}
            trend="All time"
            color="text-blue-600"
          />
          <MetricCard
            label="Collected VAT"
            value={`$${(vatMetrics.collectedVAT / 1000).toFixed(1)}K`}
            trend="Current period"
            color="text-green-600"
          />
          <MetricCard
            label="Payable VAT"
            value={`$${(vatMetrics.payableVAT / 1000).toFixed(1)}K`}
            color="text-red-600"
          />
          <MetricCard
            label="Filing Status"
            value={vatMetrics.filingStatus}
            color="text-orange-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('returns')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'returns'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Returns
            </button>
            <button
              onClick={() => setActiveTab('filings')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'filings'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Filing Calendar
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'returns' && (
              <div className="space-y-4">
                {returns.length > 0 ? (
                  returns.map((ret, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                      onClick={() => setExpandedReturn(expandedReturn === idx ? null : idx)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {ret.period || `Q${idx + 1} 2024`}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {ret.amount && `Amount: $${(ret.amount / 1000).toFixed(1)}K`}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ret.status === 'Filed'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {ret.status || 'Pending'}
                          </span>
                          <span>{expandedReturn === idx ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      {expandedReturn === idx && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                          <p>Filing Date: {ret.filingDate || 'N/A'}</p>
                          <p>Due Date: {ret.dueDate || 'N/A'}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownloadReport(ret);
                            }}
                            className="mt-3 inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
                          >
                            📥 Download
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No VAT returns yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'filings' && (
              <div className="space-y-4">
                {upcomingFilings.length > 0 ? (
                  upcomingFilings.map((filing, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {filing.period || `Q${idx + 1}`}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Due: {filing.dueDate || 'TBD'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        filing.daysLeft < 7
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      }`}>
                        {filing.daysLeft || '30'} days
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No upcoming filings
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onFileVAT}
            className="flex-1 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            ➕ File VAT Return
          </button>
          <button
            onClick={() => onDownloadReport()}
            className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            📥 Download Reports
          </button>
        </div>
      </div>
    </div>
  );
};

VATDashboard.propTypes = {
  vatMetrics: PropTypes.object,
  returns: PropTypes.array,
  upcomingFilings: PropTypes.array,
  onFileVAT: PropTypes.func,
  onDownloadReport: PropTypes.func
};

export default VATDashboard;
