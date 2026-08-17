import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToCsv, exportToExcelXml, downloadBlob } from './exportUtils';

describe('exportUtils', () => {
  let createdBlob: Blob | null = null;
  let clicked = false;

  beforeEach(() => {
    createdBlob = null;
    clicked = false;

    // Mock createObjectURL and revokeObjectURL
    window.URL.createObjectURL = vi.fn((blob: Blob) => {
      createdBlob = blob;
      return 'blob:mock-url';
    });
    window.URL.revokeObjectURL = vi.fn();

    // Mock HTMLAnchorElement click
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      clicked = true;
    });
  });

  describe('exportToCsv', () => {
    it('generates UTF-8 CSV with BOM and triggers download', async () => {
      const data = [
        { id: '1', title: 'Villa "Sunset"', price: 5000000, community: 'Palm Jumeirah' },
        { id: '2', title: 'Penthouse Marina', price: 8200000, community: 'Dubai Marina' },
      ];

      exportToCsv(
        'test_properties.csv',
        [
          { label: 'ID', key: 'id' },
          { label: 'Property Title', key: 'title' },
          { label: 'Price (AED)', key: 'price' },
          { label: 'Community', key: (r) => r.community.toUpperCase() },
        ],
        data
      );

      expect(clicked).toBe(true);
      expect(createdBlob).not.toBeNull();
      expect(createdBlob?.type).toContain('text/csv');

      const text = await createdBlob!.text();
      // Headers (Excel BOM decoded or preserved)
      expect(text).toContain('"ID","Property Title","Price (AED)","Community"');
      // Escaped quotes in data
      expect(text).toContain('"Villa ""Sunset"""');
      expect(text).toContain('"PALM JUMEIRAH"');
    });
  });

  describe('exportToExcelXml', () => {
    it('generates well-formed Excel Spreadsheet XML with multiple worksheets', async () => {
      exportToExcelXml('corporate_workbook.xls', [
        {
          name: 'Revenue',
          headers: ['Period', 'Revenue AED'],
          rows: [
            ['Q1 2026', 15000000],
            ['Q2 2026', 22000000],
          ],
        },
        {
          name: 'VAT Summary',
          headers: ['Category', 'Rate'],
          rows: [['Standard', '5%']],
        },
      ]);

      expect(clicked).toBe(true);
      expect(createdBlob).not.toBeNull();
      expect(createdBlob?.type).toContain('application/vnd.ms-excel');

      const xml = await createdBlob!.text();
      expect(xml).toContain('<?xml version="1.0"?>');
      expect(xml).toContain('<Worksheet ss:Name="Revenue">');
      expect(xml).toContain('<Worksheet ss:Name="VAT Summary">');
      expect(xml).toContain('<Data ss:Type="Number">15000000</Data>');
    });
  });
});
