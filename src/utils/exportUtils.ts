/**
 * Universal Data Export Engine — White Caves Real Estate LLC
 * Supports UTF-8 CSV (with Excel BOM) and Microsoft Excel Spreadsheet XML
 * Compliant with UAE FTA & RERA Financial Audit Guidelines
 */

export interface ExportColumn<T> {
  label: string;
  key: keyof T | ((row: T) => string | number | boolean | null | undefined);
}

export interface ExcelSheet {
  name: string;
  headers: string[];
  rows: (string | number | boolean | null | undefined)[][];
}

/**
 * Downloads a binary Blob directly to the client's file system
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}

/**
 * Converts tabular objects to a UTF-8 CSV file with BOM for Excel compatibility
 */
export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  columns: ExportColumn<T>[],
  data: T[]
): void {
  const headerRow = columns.map(c => `"${String(c.label || '').replace(/"/g, '""')}"`).join(',');

  const dataRows = data.map(row => {
    return columns
      .map(col => {
        let value: unknown;
        if (typeof col.key === 'function') {
          value = col.key(row);
        } else {
          value = row[col.key];
        }

        if (value === null || value === undefined) {
          return '""';
        }

        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(',');
  });

  // Prepend UTF-8 BOM (\uFEFF) so Excel opens UTF-8 characters (Arabic & special symbols) correctly
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

/**
 * Generates an authentic Microsoft Excel XML Workbook (.xml / .xls) with multiple sheets
 */
export function exportToExcelXml(
  filename: string,
  sheets: ExcelSheet[]
): void {
  const sanitize = (val: unknown) => {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#B45309" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Currency">
   <NumberFormat ss:Format="AED #,##0.00"/>
  </Style>
 </Styles>
`;

  sheets.forEach(sheet => {
    xml += ` <Worksheet ss:Name="${sanitize(sheet.name)}">
  <Table>
   <Row ss:StyleID="Header">
`;
    sheet.headers.forEach(h => {
      xml += `    <Cell><Data ss:Type="String">${sanitize(h)}</Data></Cell>\n`;
    });
    xml += `   </Row>\n`;

    sheet.rows.forEach(row => {
      xml += `   <Row>\n`;
      row.forEach(cell => {
        const isNum = typeof cell === 'number';
        const cellType = isNum ? 'Number' : 'String';
        xml += `    <Cell><Data ss:Type="${cellType}">${sanitize(cell)}</Data></Cell>\n`;
      });
      xml += `   </Row>\n`;
    });

    xml += `  </Table>
 </Worksheet>\n`;
  });

  xml += `</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const cleanFilename = filename.endsWith('.xls') || filename.endsWith('.xml') ? filename : `${filename}.xls`;
  downloadBlob(blob, cleanFilename);
}

/**
 * Fetches CSV data directly from a backend endpoint and triggers browser download
 */
export async function fetchAndDownloadCsv(url: string, defaultFilename = 'analytics_export.csv'): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed with status: ${response.statusText}`);
    }

    const disposition = response.headers.get('Content-Disposition');
    let filename = defaultFilename;
    if (disposition && disposition.includes('filename=')) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    const blob = await response.blob();
    downloadBlob(blob, filename);
    return true;
  } catch (err) {
    console.error('[ExportUtils] Download error:', err);
    return false;
  }
}
