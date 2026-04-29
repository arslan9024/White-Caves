#!/usr/bin/env node

/**
 * Document Verification API Test Suite
 * Quick test script to verify document verification endpoints
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

class DocumentVerificationTester {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  /**
   * Test 1: Upload and verify Emirates ID document
   */
  async testEmiratesIDVerification() {
    try {
      log.info('Testing Emirates ID verification...');

      // Create a dummy image file for testing
      const testImagePath = path.join(__dirname, 'test-documents', 'emirates-id-sample.jpg');
      
      if (!fs.existsSync(testImagePath)) {
        log.warning('Test image not found. Creating placeholder...');
        // In a real test, you would use an actual test image
      }

      const formData = new FormData();
      formData.append('document', fs.createReadStream(testImagePath));
      formData.append('documentType', 'emirates_id');
      formData.append('userId', 'test-user-123');

      const response = await this.axiosInstance.post('/compliance/documents/verify', formData, {
        headers: formData.getHeaders()
      });

      if (response.data.success) {
        log.success('Emirates ID verification successful');
        console.log(JSON.stringify(response.data.data, null, 2));
        return response.data.data;
      } else {
        log.error('Emirates ID verification failed');
        console.log(response.data.message);
        return null;
      }
    } catch (error) {
      log.error(`Emirates ID test failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Test 2: Upload and verify Passport document
   */
  async testPassportVerification() {
    try {
      log.info('Testing Passport verification...');

      const testImagePath = path.join(__dirname, 'test-documents', 'passport-sample.jpg');

      if (!fs.existsSync(testImagePath)) {
        log.warning('Test image not found. Skipping...');
        return null;
      }

      const formData = new FormData();
      formData.append('document', fs.createReadStream(testImagePath));
      formData.append('documentType', 'passport');
      formData.append('userId', 'test-user-456');

      const response = await this.axiosInstance.post('/compliance/documents/verify', formData, {
        headers: formData.getHeaders()
      });

      if (response.data.success) {
        log.success('Passport verification successful');
        console.log(JSON.stringify(response.data.data, null, 2));
        return response.data.data;
      } else {
        log.error('Passport verification failed');
        console.log(response.data.message);
        return null;
      }
    } catch (error) {
      log.error(`Passport test failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Test 3: Upload and verify Visa document
   */
  async testVisaVerification() {
    try {
      log.info('Testing Visa verification...');

      const testImagePath = path.join(__dirname, 'test-documents', 'visa-sample.jpg');

      if (!fs.existsSync(testImagePath)) {
        log.warning('Test image not found. Skipping...');
        return null;
      }

      const formData = new FormData();
      formData.append('document', fs.createReadStream(testImagePath));
      formData.append('documentType', 'visa');
      formData.append('userId', 'test-user-789');

      const response = await this.axiosInstance.post('/compliance/documents/verify', formData, {
        headers: formData.getHeaders()
      });

      if (response.data.success) {
        log.success('Visa verification successful');
        console.log(JSON.stringify(response.data.data, null, 2));
        return response.data.data;
      } else {
        log.error('Visa verification failed');
        console.log(response.data.message);
        return null;
      }
    } catch (error) {
      log.error(`Visa test failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Test 4: Get document verification status
   */
  async testGetDocumentStatus(documentId) {
    try {
      log.info(`Testing document status retrieval for ID: ${documentId}`);

      const response = await this.axiosInstance.get(`/compliance/documents/${documentId}/status`);

      if (response.data.success) {
        log.success('Document status retrieved successfully');
        console.log(JSON.stringify(response.data.data, null, 2));
        return response.data.data;
      } else {
        log.error('Failed to retrieve document status');
        console.log(response.data.message);
        return null;
      }
    } catch (error) {
      log.error(`Get document status test failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Test 5: Approve document
   */
  async testApproveDocument(documentId) {
    try {
      log.info(`Testing document approval for ID: ${documentId}`);

      const response = await this.axiosInstance.post(
        `/compliance/documents/${documentId}/approve`,
        {
          comments: 'Document verified successfully'
        }
      );

      if (response.data.success) {
        log.success('Document approved successfully');
        console.log(JSON.stringify(response.data.data, null, 2));
        return response.data.data;
      } else {
        log.error('Failed to approve document');
        console.log(response.data.message);
        return null;
      }
    } catch (error) {
      log.error(`Approve document test failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Test 6: Reject document
   */
  async testRejectDocument(documentId, reason) {
    try {
      log.info(`Testing document rejection for ID: ${documentId}`);

      const response = await this.axiosInstance.post(
        `/compliance/documents/${documentId}/reject`,
        {
          reason: reason || 'Document quality too low for verification'
        }
      );

      if (response.data.success) {
        log.success('Document rejected successfully');
        console.log(JSON.stringify(response.data.data, null, 2));
        return response.data.data;
      } else {
        log.error('Failed to reject document');
        console.log(response.data.message);
        return null;
      }
    } catch (error) {
      log.error(`Reject document test failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Test 7: Invalid file type error handling
   */
  async testInvalidFileType() {
    try {
      log.info('Testing invalid file type error handling...');

      // Create a temporary text file
      const tempFile = path.join(__dirname, 'test.txt');
      fs.writeFileSync(tempFile, 'This is not an image');

      const formData = new FormData();
      formData.append('document', fs.createReadStream(tempFile));
      formData.append('documentType', 'emirates_id');

      try {
        await this.axiosInstance.post('/compliance/documents/verify', formData, {
          headers: formData.getHeaders()
        });
        log.error('Should have rejected invalid file type');
      } catch (error) {
        if (error.response?.status === 400) {
          log.success('Invalid file type correctly rejected');
        } else {
          log.error('Unexpected error: ' + error.message);
        }
      }

      fs.unlinkSync(tempFile);
    } catch (error) {
      log.error(`Invalid file type test failed: ${error.message}`);
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('\n');
    log.info('Starting Document Verification API Test Suite');
    console.log('=========================================\n');

    if (!this.token) {
      log.warning('No authentication token provided. Some tests will fail.');
      log.info('Set AUTH_TOKEN environment variable to run authenticated tests.');
    }

    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Test 1: Emirates ID
    results.total++;
    const emiratesResult = await this.testEmiratesIDVerification();
    if (emiratesResult) results.passed++;
    else results.failed++;
    console.log('');

    // Test 2: Passport
    results.total++;
    const passportResult = await this.testPassportVerification();
    if (passportResult) results.passed++;
    else results.failed++;
    console.log('');

    // Test 3: Visa
    results.total++;
    const visaResult = await this.testVisaVerification();
    if (visaResult) results.passed++;
    else results.failed++;
    console.log('');

    // Test 4: Get Status (if we have a document ID)
    if (emiratesResult?.documentId) {
      results.total++;
      const statusResult = await this.testGetDocumentStatus(emiratesResult.documentId);
      if (statusResult) results.passed++;
      else results.failed++;
      console.log('');
    }

    // Test 5: Invalid file type
    results.total++;
    await this.testInvalidFileType();
    results.passed++;
    console.log('');

    // Print summary
    console.log('=========================================');
    log.info(`Test Summary: ${results.passed}/${results.total} passed`);
    if (results.failed > 0) {
      log.warning(`${results.failed} test(s) failed`);
    } else {
      log.success('All tests passed!');
    }
    console.log('');
  }
}

// Run tests
const tester = new DocumentVerificationTester(BASE_URL, AUTH_TOKEN);
tester.runAllTests().catch(error => {
  log.error('Test suite error: ' + error.message);
  process.exit(1);
});
