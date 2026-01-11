import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  FileText, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import {
  selectActiveDocument,
  selectCanNavigateBack,
  selectCanNavigateForward,
  selectDocumentHistoryIndex,
  selectDocumentHistory,
  closeDocument,
  navigateDocumentBack,
  navigateDocumentForward,
} from '../../store/slices/crmViewSlice';
import { getDocumentById, DOCUMENT_TYPES } from '../../data/docs/documentRegistry';
import './CRMDocumentViewer.css';

export default function CRMDocumentViewer() {
  const dispatch = useDispatch();
  const activeDocument = useSelector(selectActiveDocument);
  const canGoBack = useSelector(selectCanNavigateBack);
  const canGoForward = useSelector(selectCanNavigateForward);
  const historyIndex = useSelector(selectDocumentHistoryIndex);
  const history = useSelector(selectDocumentHistory);
  const contentRef = useRef(null);
  const [zoom, setZoom] = React.useState(100);
  const [isPdfLoading, setIsPdfLoading] = React.useState(false);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeDocument?.id]);

  if (!activeDocument) {
    return null;
  }

  const docData = activeDocument.content ? activeDocument : getDocumentById(activeDocument.id);
  
  if (!docData) {
    return (
      <div className="crm-doc-viewer">
        <div className="doc-viewer-header">
          <button className="doc-nav-btn close" onClick={() => dispatch(closeDocument())}>
            <X size={20} />
          </button>
        </div>
        <div className="doc-viewer-error">
          <FileText size={48} />
          <p>Document not found</p>
        </div>
      </div>
    );
  }

  const handleBack = () => dispatch(navigateDocumentBack());
  const handleForward = () => dispatch(navigateDocumentForward());
  const handleClose = () => dispatch(closeDocument());
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handlePrint = () => window.print();

  const isPdf = docData.type === DOCUMENT_TYPES.PDF || docData.url?.endsWith('.pdf');

  return (
    <div className="crm-doc-viewer">
      <div className="doc-viewer-header">
        <div className="doc-nav-controls">
          <button 
            className="doc-nav-btn back-to-dashboard" 
            onClick={handleClose}
            title="Back to Dashboard"
          >
            <ChevronLeft size={18} />
            <span>Dashboard</span>
          </button>
          
          <div className="doc-history-nav">
            <button 
              className="doc-nav-btn" 
              onClick={handleBack} 
              disabled={!canGoBack}
              title="Previous Document"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="doc-history-indicator">
              {historyIndex + 1} / {history.length}
            </span>
            <button 
              className="doc-nav-btn" 
              onClick={handleForward} 
              disabled={!canGoForward}
              title="Next Document"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="doc-title-section">
          <FileText size={20} className="doc-icon" />
          <div className="doc-title-info">
            <h2 className="doc-title">{docData.title}</h2>
            {docData.category && <span className="doc-category">{docData.category}</span>}
          </div>
        </div>

        <div className="doc-actions">
          {!isPdf && (
            <>
              <button className="doc-action-btn" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut size={18} />
              </button>
              <span className="zoom-level">{zoom}%</span>
              <button className="doc-action-btn" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn size={18} />
              </button>
            </>
          )}
          <button className="doc-action-btn" onClick={handlePrint} title="Print">
            <Printer size={18} />
          </button>
          {docData.url && (
            <a 
              href={docData.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="doc-action-btn"
              title="Open in New Tab"
            >
              <ExternalLink size={18} />
            </a>
          )}
          <button className="doc-nav-btn close" onClick={handleClose} title="Close">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="doc-viewer-meta">
        {docData.version && <span className="meta-item">Version {docData.version}</span>}
        {docData.lastUpdated && <span className="meta-item">Updated: {docData.lastUpdated}</span>}
        {docData.author && <span className="meta-item">Author: {docData.author}</span>}
        {docData.source && <span className="meta-item source-badge">{docData.source === 'aurora' ? 'Aurora Tech Docs' : 'Company Docs'}</span>}
      </div>

      <div 
        className="doc-viewer-content" 
        ref={contentRef}
        style={{ fontSize: `${zoom}%` }}
      >
        {isPdf ? (
          <div className="pdf-viewer-container">
            {isPdfLoading && (
              <div className="pdf-loading">
                <div className="loading-spinner"></div>
                <p>Loading PDF...</p>
              </div>
            )}
            <iframe
              src={docData.url}
              title={docData.title}
              className="pdf-iframe"
              onLoad={() => setIsPdfLoading(false)}
            />
          </div>
        ) : (
          <div 
            className="html-content"
            dangerouslySetInnerHTML={{ __html: docData.content || '<p>No content available</p>' }}
          />
        )}
      </div>
    </div>
  );
}
