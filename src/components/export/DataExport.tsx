/**
 * Data Export Component
 * Provides functionality to export dashboard data in various formats
 */

import React from 'react';
import styled from 'styled-components';

const ExportContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const ExportLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ExportButton = styled.button<{ $type?: string }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${(props) => {
      switch (props.$type) {
        case 'csv':
          return 'rgba(52, 211, 153, 0.2)';
        case 'json':
          return 'rgba(96, 165, 250, 0.2)';
        case 'pdf':
          return 'rgba(248, 113, 113, 0.2)';
        case 'excel':
          return 'rgba(34, 197, 94, 0.2)';
        default:
          return 'rgba(255, 255, 255, 0.1)';
      }
    }};
    border-color: ${(props) => {
      switch (props.$type) {
        case 'csv':
          return '#34d399';
        case 'json':
          return '#60a5fa';
        case 'pdf':
          return '#f87171';
        case 'excel':
          return '#22c55e';
        default:
          return '#3498db';
      }
    }};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface DataExportProps {
  data: any[];
  filename?: string;
  onExportStart?: () => void;
  onExportComplete?: (format: string) => void;
}

/**
 * Data Export Component
 * Exports dashboard data in multiple formats
 */
export const DataExport: React.FC<DataExportProps> = ({
  data,
  filename = 'dashboard-export',
  onExportStart,
  onExportComplete,
}) => {
  const [exporting, setExporting] = React.useState<string | null>(null);

  const exportAsCSV = async () => {
    setExporting('csv');
    onExportStart?.();

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const csv = convertToCSV(data);
      downloadFile(csv, `${filename}.csv`, 'text/csv');
      onExportComplete?.('csv');
    } finally {
      setExporting(null);
    }
  };

  const exportAsJSON = async () => {
    setExporting('json');
    onExportStart?.();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const json = JSON.stringify(data, null, 2);
      downloadFile(json, `${filename}.json`, 'application/json');
      onExportComplete?.('json');
    } finally {
      setExporting(null);
    }
  };

  const exportAsExcel = async () => {
    setExporting('excel');
    onExportStart?.();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const csv = convertToCSV(data);
      downloadFile(csv, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      onExportComplete?.('excel');
    } finally {
      setExporting(null);
    }
  };

  const exportAsPDF = async () => {
    setExporting('pdf');
    onExportStart?.();

    try {
      // In a real app, you would use a library like pdfkit or jsPDF
      await new Promise((resolve) => setTimeout(resolve, 500));

      const html = convertToHTML(data);
      downloadFile(html, `${filename}.pdf`, 'text/html');
      onExportComplete?.('pdf');
    } finally {
      setExporting(null);
    }
  };

  const convertToCSV = (data: any[]): string => {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          if (value === null || value === undefined) {
            return '';
          }
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      ),
    ].join('\n');

    return csv;
  };

  const convertToHTML = (data: any[]): string => {
    const headers = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];
    const html = `
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map((row) => `<tr>${headers.map((h) => `<td>${row[h]}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    return html;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ExportContainer>
      <ExportLabel>📥 Export Data</ExportLabel>

      <ExportButton
        $type="csv"
        onClick={exportAsCSV}
        disabled={exporting === 'csv'}
      >
        {exporting === 'csv' ? <LoadingSpinner /> : '📄'}
        CSV
      </ExportButton>

      <ExportButton
        $type="excel"
        onClick={exportAsExcel}
        disabled={exporting === 'excel'}
      >
        {exporting === 'excel' ? <LoadingSpinner /> : '📊'}
        Excel
      </ExportButton>

      <ExportButton
        $type="json"
        onClick={exportAsJSON}
        disabled={exporting === 'json'}
      >
        {exporting === 'json' ? <LoadingSpinner /> : '{}'}
        JSON
      </ExportButton>

      <ExportButton
        $type="pdf"
        onClick={exportAsPDF}
        disabled={exporting === 'pdf'}
      >
        {exporting === 'pdf' ? <LoadingSpinner /> : '📑'}
        PDF
      </ExportButton>
    </ExportContainer>
  );
};

export default DataExport;
