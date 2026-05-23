import { validateExcelFile, parseExcelData, validateDataQuality } from '../../../server/utils/importValidationEngine';
import * as XLSX from 'xlsx';

// Mock the xlsx library
jest.mock('xlsx');

describe('Import Validation Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateExcelFile', () => {
    it('should validate a valid Excel file', async () => {
      const mockFile = {
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 50000,
        originalname: 'properties.xlsx',
      };

      const result = validateExcelFile(mockFile);

      expect(result.success).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject invalid file types', () => {
      const mockFile = {
        mimetype: 'text/plain',
        size: 50000,
        originalname: 'properties.txt',
      };

      const result = validateExcelFile(mockFile);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid file type');
    });

    it('should reject files exceeding size limit', () => {
      const mockFile = {
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 100 * 1024 * 1024, // 100MB
        originalname: 'large.xlsx',
      };

      const result = validateExcelFile(mockFile);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('File size exceeds limit');
    });
  });

  describe('parseExcelData', () => {
    it('should parse valid Excel data', () => {
      const mockWorkbook = {
        SheetNames: ['Properties'],
        Sheets: {
          Properties: {
            'A1': { v: 'Location' },
            'B1': { v: 'Type' },
            'A2': { v: 'Dubai Marina' },
            'B2': { v: 'Apartment' },
          },
        },
      };

      XLSX.read.mockReturnValue(mockWorkbook);
      XLSX.utils.sheet_to_json.mockReturnValue([
        { Location: 'Dubai Marina', Type: 'Apartment' },
      ]);

      const result = parseExcelData(Buffer.from('mock'));

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should handle empty Excel files', () => {
      const mockWorkbook = {
        SheetNames: [],
        Sheets: {},
      };

      XLSX.read.mockReturnValue(mockWorkbook);

      const result = parseExcelData(Buffer.from('mock'));

      expect(result.success).toBe(false);
      expect(result.errors).toContain('No sheets found in file');
    });
  });

  describe('validateDataQuality', () => {
    it('should identify missing required fields', () => {
      const data = [
        { Location: 'Dubai Marina' }, // Missing Type
        { Location: 'JBR', Type: 'Apartment' },
      ];

      const requiredFields = ['Location', 'Type'];
      const result = validateDataQuality(data, requiredFields);

      expect(result.validRows.length).toBe(1);
      expect(result.invalidRows.length).toBe(1);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect duplicate records', () => {
      const data = [
        { Location: 'Dubai Marina', Type: 'Apartment', Area: 1500 },
        { Location: 'Dubai Marina', Type: 'Apartment', Area: 1500 },
        { Location: 'JBR', Type: 'Villa', Area: 3000 },
      ];

      const result = validateDataQuality(data, ['Location', 'Type', 'Area']);

      expect(result.duplicates.length).toBe(1);
    });

    it('should validate data types', () => {
      const data = [
        { Location: 'Dubai Marina', Area: '1500', Price: 'invalid' },
      ];

      const requiredFields = ['Location', 'Area', 'Price'];
      const typeValidation = { Area: 'number', Price: 'number' };
      const result = validateDataQuality(data, requiredFields, typeValidation);

      expect(result.invalidRows.length).toBeGreaterThan(0);
    });
  });
});
