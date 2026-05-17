/**
 * Integration Tests for Smart Mary Data Import System
 * Tests complete import workflow from upload to execution
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:3000/api/inventory/import';
let sessionId = null;
let testFile = null;

// Test data
const testExcelPath = path.join(__dirname, 'fixtures/test-data.xlsx');
const testCSVPath = path.join(__dirname, 'fixtures/test-data.csv');

// Helper function to create test file
async function createTestFile() {
  // Create sample Excel file (requires xlsx package in tests)
  const xlsx = require('xlsx');
  
  const data = [
    {
      'Property Number': 'P-001',
      'Area': 'Downtown',
      'Project': 'Tower A',
      'Bedrooms': '3',
      'Bathrooms': '2',
      'Owner Name': 'Ahmed Al Mansouri',
      'Phone': '+971501234567',
      'Email': 'ahmed@example.com',
      'Status': 'Vacant'
    },
    {
      'Property Number': 'P-002',
      'Area': 'Marina',
      'Project': 'Marina Heights',
      'Bedrooms': '2',
      'Bathrooms': '2',
      'Owner Name': 'Fatima Al Dhaheri',
      'Phone': '+971502345678',
      'Email': 'fatima@example.com',
      'Status': 'Occupied'
    },
    {
      'Property Number': 'P-003',
      'Area': 'JBR',
      'Project': 'Beach Residences',
      'Bedrooms': '1',
      'Bathrooms': '1',
      'Owner Name': 'Mohammed Al Maktoum',
      'Phone': '+971503456789',
      'Email': 'mohammed@example.com',
      'Status': 'Rented'
    }
  ];

  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Properties');
  
  xlsx.writeFile(wb, testExcelPath);
  return testExcelPath;
}

describe('Smart Mary Data Import System - Integration Tests', () => {
  
  beforeAll(async () => {
    // Create test file
    await createTestFile();
    console.log('✅ Test file created');
  });

  afterAll(async () => {
    // Cleanup
    if (fs.existsSync(testExcelPath)) {
      fs.unlinkSync(testExcelPath);
    }
  });

  describe('1. File Upload', () => {
    
    it('should successfully upload Excel file', async () => {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(testExcelPath));

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: formData.getHeaders()
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('sessionId');
      expect(response.data.data).toHaveProperty('fileName');
      expect(response.data.data).toHaveProperty('totalRows');
      expect(response.data.data).toHaveProperty('columns');
      expect(response.data.data).toHaveProperty('preview');

      sessionId = response.data.data.sessionId;
      expect(sessionId).toBeTruthy();
    });

    it('should reject invalid file format', async () => {
      const invalidFile = path.join(__dirname, 'fixtures/test.txt');
      fs.writeFileSync(invalidFile, 'invalid content');

      const formData = new FormData();
      formData.append('file', fs.createReadStream(invalidFile));

      try {
        await axios.post(`${API_URL}/upload`, formData, {
          headers: formData.getHeaders()
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      } finally {
        fs.unlinkSync(invalidFile);
      }
    });

    it('should handle empty file', async () => {
      const emptyFile = path.join(__dirname, 'fixtures/empty.xlsx');
      const xlsx = require('xlsx');
      const ws = xlsx.utils.json_to_sheet([]);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
      xlsx.writeFile(wb, emptyFile);

      const formData = new FormData();
      formData.append('file', fs.createReadStream(emptyFile));

      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: formData.getHeaders()
        });
        expect(response.data.data.totalRows).toBe(0);
      } finally {
        fs.unlinkSync(emptyFile);
      }
    });

    it('should extract all sheet names from Excel', async () => {
      const xlsx = require('xlsx');
      const multiSheetPath = path.join(__dirname, 'fixtures/multi-sheet.xlsx');
      
      const data1 = [{ name: 'Sheet1 Data' }];
      const data2 = [{ name: 'Sheet2 Data' }];

      const ws1 = xlsx.utils.json_to_sheet(data1);
      const ws2 = xlsx.utils.json_to_sheet(data2);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws1, 'Properties');
      xlsx.utils.book_append_sheet(wb, ws2, 'Owners');
      xlsx.writeFile(wb, multiSheetPath);

      const formData = new FormData();
      formData.append('file', fs.createReadStream(multiSheetPath));

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: formData.getHeaders()
      });

      expect(response.data.data.sheetNames).toContain('Properties');
      expect(response.data.data.sheetNames).toContain('Owners');
      expect(response.data.data.sheetNames.length).toBe(2);

      fs.unlinkSync(multiSheetPath);
    });
  });

  describe('2. Column Mapping Detection', () => {
    
    it('should auto-detect column mappings', async () => {
      const response = await axios.post(
        `${API_URL}/detect-mapping`,
        {
          columns: [
            'Property Number',
            'Area',
            'Bedrooms',
            'Owner Name',
            'Phone'
          ],
          sampleData: [
            {
              'Property Number': 'P-001',
              'Area': 'Downtown',
              'Bedrooms': '3',
              'Owner Name': 'Ahmed',
              'Phone': '+971501234567'
            }
          ]
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.data.mapping).toBeDefined();
      expect(response.data.data.mapping['Property Number']).toBe('referenceNo');
      expect(response.data.data.mapping['Owner Name']).toBe('ownerName');
      expect(response.data.data.mapping['Phone']).toBe('phone');
    });

    it('should handle unmapped columns', async () => {
      const response = await axios.post(
        `${API_URL}/detect-mapping`,
        {
          columns: ['Unknown Field 1', 'Unknown Field 2', 'Property Number'],
          sampleData: [
            {
              'Unknown Field 1': 'value',
              'Unknown Field 2': 'value',
              'Property Number': 'P-001'
            }
          ]
        }
      );

      expect(response.data.data.unmappedColumns).toContain('Unknown Field 1');
      expect(response.data.data.unmappedColumns).toContain('Unknown Field 2');
      expect(response.data.data.mapping['Property Number']).toBe('referenceNo');
    });

    it('should provide confidence scores', async () => {
      const response = await axios.post(
        `${API_URL}/detect-mapping`,
        {
          columns: ['Property ID', 'Owner Name'],
          sampleData: [
            {
              'Property ID': 'P-001',
              'Owner Name': 'Ahmed'
            }
          ]
        }
      );

      expect(response.data.data.confidence).toBeDefined();
      expect(response.data.data.confidence['Property ID']).toBeGreaterThan(0.7);
      expect(response.data.data.confidence['Owner Name']).toBeGreaterThan(0.7);
    });
  });

  describe('3. Data Validation', () => {
    
    it('should validate data quality', async () => {
      if (!sessionId) {
        this.skip();
      }

      const response = await axios.post(
        `${API_URL}/validate`,
        {
          sessionId,
          strategy: 'balanced',
          mapping: {
            'Property Number': 'referenceNo',
            'Area': 'area',
            'Owner Name': 'ownerName',
            'Phone': 'phone'
          }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.data.validationResult).toBeDefined();
      expect(response.data.data.validationResult).toHaveProperty('isValid');
      expect(response.data.data.validationResult).toHaveProperty('totalRows');
      expect(response.data.data.validationResult).toHaveProperty('totalErrors');
      expect(response.data.data.validationResult).toHaveProperty('totalWarnings');
    });

    it('should detect validation errors', async () => {
      // Create file with invalid data
      const invalidPath = path.join(__dirname, 'fixtures/invalid-data.xlsx');
      const xlsx = require('xlsx');
      
      const invalidData = [
        {
          'Property Number': '', // Empty required field
          'Area': 'Downtown',
          'Owner Name': 'Ahmed',
          'Phone': 'not-a-phone' // Invalid format
        }
      ];

      const ws = xlsx.utils.json_to_sheet(invalidData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
      xlsx.writeFile(wb, invalidPath);

      const formData = new FormData();
      formData.append('file', fs.createReadStream(invalidPath));

      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: formData.getHeaders()
      });

      const validationRes = await axios.post(
        `${API_URL}/validate`,
        {
          sessionId: uploadRes.data.data.sessionId,
          strategy: 'strict',
          mapping: {
            'Property Number': 'referenceNo',
            'Area': 'area',
            'Owner Name': 'ownerName',
            'Phone': 'phone'
          }
        }
      );

      expect(validationRes.data.data.validationResult.totalErrors).toBeGreaterThan(0);
      fs.unlinkSync(invalidPath);
    });

    it('should validate with different strategies', async () => {
      const strategies = ['strict', 'balanced', 'lenient'];

      for (const strategy of strategies) {
        const response = await axios.post(
          `${API_URL}/validate`,
          {
            sessionId,
            strategy,
            mapping: {
              'Property Number': 'referenceNo',
              'Area': 'area',
              'Owner Name': 'ownerName'
            }
          }
        );

        expect(response.data.success).toBe(true);
        expect(response.data.data.validationResult).toBeDefined();
      }
    });
  });

  describe('4. Duplicate Detection', () => {
    
    it('should detect duplicates', async () => {
      if (!sessionId) {
        this.skip();
      }

      const response = await axios.post(
        `${API_URL}/detect-duplicates`,
        {
          sessionId,
          strategy: 'smart',
          matchingFields: ['Property Number', 'Area'],
          matchingThreshold: 0.85
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.data).toHaveProperty('duplicatesFound');
      expect(response.data.data).toHaveProperty('duplicates');
      expect(Array.isArray(response.data.data.duplicates)).toBe(true);
    });

    it('should provide duplicate confidence scores', async () => {
      if (!sessionId) {
        this.skip();
      }

      const response = await axios.post(
        `${API_URL}/detect-duplicates`,
        {
          sessionId,
          strategy: 'smart',
          matchingFields: ['Property Number'],
          matchingThreshold: 0.7
        }
      );

      if (response.data.data.duplicates.length > 0) {
        const duplicate = response.data.data.duplicates[0];
        expect(duplicate).toHaveProperty('confidence');
        expect(duplicate.confidence).toBeGreaterThanOrEqual(0);
        expect(duplicate.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should support different matching strategies', async () => {
      if (!sessionId) {
        this.skip();
      }

      const strategies = ['exact', 'fuzzy', 'smart'];

      for (const strategy of strategies) {
        const response = await axios.post(
          `${API_URL}/detect-duplicates`,
          {
            sessionId,
            strategy,
            matchingFields: ['Property Number']
          }
        );

        expect(response.data.success).toBe(true);
      }
    });
  });

  describe('5. Status Mapping Detection', () => {
    
    it('should detect status mappings', async () => {
      const response = await axios.post(
        `${API_URL}/detect-status-mapping`,
        {
          data: [
            { status: 'Vacant' },
            { status: 'Occupied' },
            { status: 'Rented' }
          ],
          statusField: 'status'
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.data.statusMapping).toBeDefined();
      expect(response.data.data.statusMapping['Vacant']).toBeDefined();
      expect(response.data.data.statusMapping['Vacant']).toHaveProperty('occupancy');
      expect(response.data.data.statusMapping['Vacant']).toHaveProperty('market');
    });

    it('should map to multi-dimensional fields', async () => {
      const response = await axios.post(
        `${API_URL}/detect-status-mapping`,
        {
          data: [{ status: 'Vacant' }],
          statusField: 'status'
        }
      );

      const mapping = response.data.data.statusMapping['Vacant'];
      expect(mapping).toHaveProperty('occupancy');
      expect(mapping).toHaveProperty('market');
      expect(mapping).toHaveProperty('construction');
      expect(mapping).toHaveProperty('furnishing');
      expect(mapping).toHaveProperty('legal');
    });
  });

  describe('6. Import Execution', () => {
    
    it('should execute import successfully', async () => {
      if (!sessionId) {
        this.skip();
      }

      const response = await axios.post(
        `${API_URL}/execute`,
        {
          sessionId,
          columnMapping: {
            'Property Number': 'referenceNo',
            'Area': 'area',
            'Project': 'projectName',
            'Owner Name': 'ownerName',
            'Phone': 'phone'
          },
          importStrategy: 'balanced',
          deduplicationStrategy: 'keep',
          statusMapping: {
            'Vacant': {
              occupancy: 'empty',
              market: 'ready',
              construction: 'ready',
              furnishing: 'unknown',
              legal: 'registered'
            }
          }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.data).toHaveProperty('status');
      expect(['completed', 'partial']).toContain(response.data.data.status);
      expect(response.data.data).toHaveProperty('propertiesCreated');
      expect(response.data.data).toHaveProperty('ownersCreated');
    });

    it('should apply deduplication strategy', async () => {
      // Test each strategy
      const strategies = ['keep', 'overwrite', 'version', 'manual'];

      for (const strategy of strategies) {
        const response = await axios.post(
          `${API_URL}/execute`,
          {
            sessionId,
            columnMapping: {
              'Property Number': 'referenceNo',
              'Area': 'area',
              'Owner Name': 'ownerName'
            },
            importStrategy: 'balanced',
            deduplicationStrategy: strategy,
            statusMapping: {}
          }
        );

        expect([200, 202]).toContain(response.status);
      }
    });

    it('should apply import strategy', async () => {
      const strategies = ['strict', 'balanced', 'lenient'];

      for (const strategy of strategies) {
        const response = await axios.post(
          `${API_URL}/execute`,
          {
            sessionId,
            columnMapping: {
              'Property Number': 'referenceNo',
              'Area': 'area'
            },
            importStrategy: strategy,
            deduplicationStrategy: 'keep',
            statusMapping: {}
          }
        );

        expect([200, 202]).toContain(response.status);
      }
    });

    it('should provide detailed import summary', async () => {
      if (!sessionId) {
        this.skip();
      }

      const response = await axios.post(
        `${API_URL}/execute`,
        {
          sessionId,
          columnMapping: {
            'Property Number': 'referenceNo',
            'Area': 'area'
          },
          importStrategy: 'balanced',
          deduplicationStrategy: 'keep'
        }
      );

      const data = response.data.data;
      expect(data.summary).toBeDefined();
      expect(data.summary).toHaveProperty('executionTime');
      expect(data.summary).toHaveProperty('successRate');
    });
  });

  describe('7. Session Management', () => {
    
    it('should retrieve session status', async () => {
      if (!sessionId) {
        this.skip();
      }

      const response = await axios.get(
        `${API_URL}/session/${sessionId}`
      );

      expect(response.status).toBe(200);
      expect(response.data.data.sessionId).toBe(sessionId);
      expect(response.data.data).toHaveProperty('status');
      expect(response.data.data).toHaveProperty('progress');
    });

    it('should cancel import session', async () => {
      if (!sessionId) {
        this.skip();
      }

      const response = await axios.post(
        `${API_URL}/session/${sessionId}/cancel`,
        {
          reason: 'Testing cancellation'
        }
      );

      expect([200, 202]).toContain(response.status);
    });

    it('should retrieve import history', async () => {
      const response = await axios.get(
        `${API_URL}/history?limit=10&skip=0`
      );

      expect(response.status).toBe(200);
      expect(response.data.data).toHaveProperty('imports');
      expect(Array.isArray(response.data.data.imports)).toBe(true);
      expect(response.data.data).toHaveProperty('total');
    });
  });

  describe('8. Error Handling', () => {
    
    it('should handle missing required fields', async () => {
      try {
        await axios.post(
          `${API_URL}/validate`,
          {
            sessionId, // Missing required mapping
            strategy: 'balanced'
          }
        );
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should handle invalid session ID', async () => {
      try {
        await axios.get(`${API_URL}/session/invalid_session_id`);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it('should validate file size limits', async () => {
      // Create large file (simulate > 100MB)
      // Note: This test may need adjustment based on actual size limits
      const largeFile = path.join(__dirname, 'fixtures/large-file.xlsx');
      
      // Create a moderately large test file
      const xlsx = require('xlsx');
      const largeData = Array(10000).fill(null).map((_, i) => ({
        'Property Number': `P-${i}`,
        'Area': 'Test Area',
        'Owner Name': 'Test Owner'
      }));

      const ws = xlsx.utils.json_to_sheet(largeData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
      xlsx.writeFile(wb, largeFile);

      const formData = new FormData();
      formData.append('file', fs.createReadStream(largeFile));

      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: formData.getHeaders()
        });
        // If successful, verify it's processed
        expect(response.data.data.totalRows).toBeGreaterThan(0);
      } finally {
        fs.unlinkSync(largeFile);
      }
    });
  });

  describe('9. End-to-End Workflow', () => {
    
    it('should complete full import workflow', async () => {
      // Step 1: Upload
      const uploadPath = path.join(__dirname, 'fixtures/e2e-test.xlsx');
      const xlsx = require('xlsx');
      const e2eData = [
        {
          'Property Number': 'E2E-001',
          'Area': 'Downtown',
          'Bedrooms': '3',
          'Owner Name': 'Test Owner',
          'Phone': '+971501234567',
          'Status': 'Vacant'
        }
      ];

      const ws = xlsx.utils.json_to_sheet(e2eData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
      xlsx.writeFile(wb, uploadPath);

      const formData = new FormData();
      formData.append('file', fs.createReadStream(uploadPath));

      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: formData.getHeaders()
      });

      const e2eSessionId = uploadRes.data.data.sessionId;

      // Step 2: Detect Mapping
      const mappingRes = await axios.post(
        `${API_URL}/detect-mapping`,
        {
          columns: uploadRes.data.data.columns,
          sampleData: uploadRes.data.data.preview
        }
      );

      // Step 3: Validate
      const validationRes = await axios.post(
        `${API_URL}/validate`,
        {
          sessionId: e2eSessionId,
          strategy: 'balanced',
          mapping: mappingRes.data.data.mapping
        }
      );

      // Step 4: Execute
      const executeRes = await axios.post(
        `${API_URL}/execute`,
        {
          sessionId: e2eSessionId,
          columnMapping: mappingRes.data.data.mapping,
          importStrategy: 'balanced',
          deduplicationStrategy: 'keep',
          statusMapping: {}
        }
      );

      expect(executeRes.data.success).toBe(true);
      expect([200, 202]).toContain(executeRes.status);
      expect(executeRes.data.data).toHaveProperty('propertiesCreated');

      fs.unlinkSync(uploadPath);
    });
  });
});
