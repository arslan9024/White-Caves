import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  FileText, 
  Network, 
  Code, 
  Database, 
  Bot, 
  Map, 
  List, 
  History,
  Shield,
  FileCheck,
  Briefcase,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { openDocument } from '../../store/slices/crmViewSlice';
import { 
  AURORA_DOCUMENT_INDEX, 
  COMPANY_DOCUMENT_INDEX,
  getDocumentById 
} from '../../data/docs/documentRegistry';
import './AuroraDocumentIndex.css';

const ICON_MAP = {
  FileText,
  Network,
  Code,
  Database,
  Bot,
  Map,
  List,
  History,
  Shield,
  FileCheck,
  Briefcase,
};

export default function AuroraDocumentIndex({ showCompanyDocs = true }) {
  const dispatch = useDispatch();

  const handleOpenDocument = (docId) => {
    const doc = getDocumentById(docId);
    if (doc) {
      dispatch(openDocument(doc));
    }
  };

  return (
    <div className="aurora-doc-index">
      <div className="doc-section">
        <div className="doc-section-header">
          <div className="section-icon aurora">
            <Bot size={20} />
          </div>
          <div className="section-info">
            <h3>Aurora Technical Documentation</h3>
            <p>Software development lifecycle documents maintained by Aurora (CTO Intelligence)</p>
          </div>
        </div>
        
        <div className="doc-grid">
          {AURORA_DOCUMENT_INDEX.map((doc) => {
            const IconComponent = ICON_MAP[doc.icon] || FileText;
            return (
              <button
                key={doc.id}
                className="doc-card"
                onClick={() => handleOpenDocument(doc.id)}
              >
                <div className="doc-card-icon">
                  <IconComponent size={24} />
                </div>
                <div className="doc-card-content">
                  <h4>{doc.title}</h4>
                  <span className="doc-type">Technical Document</span>
                </div>
                <ChevronRight size={18} className="doc-card-arrow" />
              </button>
            );
          })}
        </div>
      </div>

      {showCompanyDocs && (
        <div className="doc-section">
          <div className="doc-section-header">
            <div className="section-icon company">
              <Briefcase size={20} />
            </div>
            <div className="section-info">
              <h3>Company Documents</h3>
              <p>Policies, procedures, and operational guidelines</p>
            </div>
          </div>
          
          <div className="doc-grid">
            {COMPANY_DOCUMENT_INDEX.map((doc) => {
              const IconComponent = ICON_MAP[doc.icon] || FileText;
              return (
                <button
                  key={doc.id}
                  className="doc-card company"
                  onClick={() => handleOpenDocument(doc.id)}
                >
                  <div className="doc-card-icon">
                    <IconComponent size={24} />
                  </div>
                  <div className="doc-card-content">
                    <h4>{doc.title}</h4>
                    <span className="doc-type">Company Document</span>
                  </div>
                  <ChevronRight size={18} className="doc-card-arrow" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="doc-section doc-stats">
        <div className="stat-card">
          <span className="stat-value">{AURORA_DOCUMENT_INDEX.length}</span>
          <span className="stat-label">Technical Docs</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{COMPANY_DOCUMENT_INDEX.length}</span>
          <span className="stat-label">Company Docs</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">v2.5</span>
          <span className="stat-label">Current Version</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">Jan 2026</span>
          <span className="stat-label">Last Updated</span>
        </div>
      </div>
    </div>
  );
}
