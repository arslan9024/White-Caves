import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const SummaryCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{label}</span>
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

/**
 * AuditReportViewer Component
 * Display comprehensive audit reports with findings, actions, and compliance metrics
 * Integrates with Noor (Internal Audit Manager)
 *
 * @component
 * @param {Object} props
 * @param {Object} props.report - Audit report data (findings, actions, summary)
 * @param {Function} props.onDownload - Download report callback
 * @param {Function} props.onExport - Export to CSV callback
 */
const AuditReportViewer = ({
  report = {
    id: 'AUD-2024-001',
    title: 'Annual Audit Report 2024',
    date: '2024-01-15',
    period: 'January 1 - December 31, 2023',
    auditedBy: 'Noor Al-Ahmed',
    status: 'completed',
    summary: {
      complianceScore: 92,
      reviewProgress: 100,
      riskLevel: 'low',
      totalFindings: 3,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 2,
    },
    findings: [
      {
        id: 'F001',
        category: 'Financial Controls',
        severity: 'major',
        title: 'Incomplete Reconciliation Process',
        description: 'Monthly bank reconciliations are not completed timely',
        recommendation: 'Implement automated reconciliation process',
        status: 'open',
      },
      {
        id: 'F002',
        category: 'Governance',
        severity: 'minor',
        title: 'Board Meeting Documentation',
        description: 'Some board meeting minutes lack proper approval signatures',
        recommendation: 'Update documentation procedures',
        status: 'in-progress',
      },
      {
        id: 'F003',
        category: 'Compliance',
        severity: 'minor',
        title: 'Employee Training Records',
        description: 'Compliance training documentation needs centralization',
        recommendation: 'Create centralized training database',
        status: 'resolved',
      },
    ],
    actions: [
      {
        id: 'A001',
        finding: 'F001',
        action: 'Automate bank reconciliation',
        owner: 'Finance Manager',
        dueDate: '2024-03-31',
        progress: 60,
        status: 'in-progress',
      },
      {
        id: 'A002',
        finding: 'F002',
        action: 'Update board meeting procedures',
        owner: 'Compliance Officer',
        dueDate: '2024-02-28',
        progress: 100,
        status: 'completed',
      },
      {
        id: 'A003',
        finding: 'F003',
        action: 'Setup training management system',
        owner: 'HR Manager',
        dueDate: '2024-01-31',
        progress: 100,
        status: 'completed',
      },
    ],
  },
  onDownload = () => {},
  onExport = () => {},
}) => {
  const [activeTab, setActiveTab] = useState('findings');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [expandedFinding, setExpandedFinding] = useState(null);

  const filteredFindings = useMemo(() => {
    if (selectedSeverity === 'all') return report.findings;
    return report.findings.filter(f => f.severity === selectedSeverity);
  }, [report.findings, selectedSeverity]);

  const getSeverityColor = severity => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'major':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'minor':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  const getSeverityIcon = severity => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'major':
        return '🟠';
      case 'minor':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'resolved':
        return '✅';
      case 'in-progress':
        return '⏳';
      case 'open':
        return '📋';
      default:
        return '❓';
    }
  };

  const getProgressColor = progress => {
    if (progress === 100) return 'bg-green-600 dark:bg-green-500';
    if (progress >= 75) return 'bg-blue-600 dark:bg-blue-500';
    if (progress >= 50) return 'bg-yellow-600 dark:bg-yellow-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {report.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {report.period} • Audited by {report.auditedBy}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onDownload}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                📥 Download
              </button>
              <button
                onClick={onExport}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                📊 Export
              </button>
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              icon="📊"
              label="Compliance Score"
              value={`${report.summary.complianceScore}%`}
              color="text-blue-600 dark:text-blue-400"
            />
            <SummaryCard
              icon="🔍"
              label="Review Progress"
              value={`${report.summary.reviewProgress}%`}
              color="text-green-600 dark:text-green-400"
            />
            <SummaryCard
              icon="⚠️"
              label="Total Findings"
              value={report.summary.totalFindings}
              color="text-orange-600 dark:text-orange-400"
            />
            <SummaryCard
              icon="📈"
              label="Risk Level"
              value={
                report.summary.riskLevel.charAt(0).toUpperCase() + report.summary.riskLevel.slice(1)
              }
              color={`text-${report.summary.riskLevel === 'low' ? 'green' : 'orange'}-600 dark:text-${report.summary.riskLevel === 'low' ? 'green' : 'orange'}-400`}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
            {['findings', 'actions'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-red-600 dark:text-red-400 border-red-600 dark:border-red-400'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Findings Tab */}
        {activeTab === 'findings' && (
          <div>
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setSelectedSeverity('all')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedSeverity === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                All ({report.findings.length})
              </button>
              <button
                onClick={() => setSelectedSeverity('critical')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedSeverity === 'critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                }`}
              >
                Critical ({report.summary.criticalFindings})
              </button>
              <button
                onClick={() => setSelectedSeverity('major')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedSeverity === 'major'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                }`}
              >
                Major ({report.summary.majorFindings})
              </button>
              <button
                onClick={() => setSelectedSeverity('minor')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedSeverity === 'minor'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                }`}
              >
                Minor ({report.summary.minorFindings})
              </button>
            </div>

            <div className="space-y-4">
              {filteredFindings.length > 0 ? (
                filteredFindings.map(finding => (
                  <div
                    key={finding.id}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedFinding(expandedFinding === finding.id ? null : finding.id)
                      }
                      className="w-full p-4 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1 text-left">
                        <span className="text-xl mt-1">{getSeverityIcon(finding.severity)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              {finding.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}
                            >
                              {finding.severity.toUpperCase()}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm">
                              {finding.category}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {finding.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-xl">{expandedFinding === finding.id ? '▼' : '▶'}</div>
                    </button>

                    {expandedFinding === finding.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                              Recommendation
                            </p>
                            <p className="text-slate-900 dark:text-white">
                              {finding.recommendation}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                              Status
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getStatusIcon(finding.status)}</span>
                              <span className="text-slate-900 dark:text-white font-medium capitalize">
                                {finding.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-slate-600 dark:text-slate-400">
                    No findings with selected severity level
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            {report.actions.map(action => (
              <div
                key={action.id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                      {action.action}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Owner: <span className="font-medium">{action.owner}</span> • Due:{' '}
                      <span className="font-medium">{action.dueDate}</span>
                    </p>
                  </div>
                  <div className="text-xl">{getStatusIcon(action.status)}</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {action.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${getProgressColor(action.progress)}`}
                        style={{ width: `${action.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        action.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      {action.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

AuditReportViewer.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    period: PropTypes.string,
    auditedBy: PropTypes.string,
    status: PropTypes.string,
    summary: PropTypes.object,
    findings: PropTypes.arrayOf(PropTypes.object),
    actions: PropTypes.arrayOf(PropTypes.object),
  }),
  onDownload: PropTypes.func,
  onExport: PropTypes.func,
};

export default AuditReportViewer;
