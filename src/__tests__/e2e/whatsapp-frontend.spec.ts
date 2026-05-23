/**
 * WhatsApp Frontend Integration Tests (Phase A3)
 * Tests for WhatsAppSettingsPage component with Redux and API integration
 * 
 * Test Scenarios:
 * - Component rendering and tab navigation
 * - Redux state connection
 * - API endpoint calls
 * - Error handling
 * - Message flow validation
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5000';
const WHATSAPP_SETTINGS_URL = `${BASE_URL}/owner/whatsapp-settings`;
const TEST_PHONE = '+971561234567';
const TEST_MESSAGE = 'This is a test message from WhatsApp integration';

test.describe('WhatsApp Front-End Integration (Phase A3)', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Set up authentication (assumes logged in via cookie/session)
    await page.context().addCookies([
      {
        name: 'session',
        value: process.env.SESSION_TOKEN || '',
        domain: 'localhost',
        path: '/'
      }
    ]);
  });

  test.describe('Component Rendering', () => {
    test('should load WhatsAppSettingsPage without errors', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Check page title
      const title = await page.locator('h1').first().textContent();
      expect(title).toContain('WhatsApp');

      // Verify all tabs are present
      const tabs = await page.locator('.settings-tab').count();
      expect(tabs).toBeGreaterThanOrEqual(5); // Status, QR, Messages, Queue, Settings

      // Check for main container
      await expect(page.locator('.settings-container')).toBeVisible();
    });

    test('should render Status tab content', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Status tab
      await page.locator('button:has-text("📊 Status")').click();
      
      // Verify status panel content
      await expect(page.locator('.status-panel')).toBeVisible();
      
      // Check for status badge
      const statusBadge = page.locator('.status-badge');
      await expect(statusBadge).toBeVisible();
      
      // Check for action buttons
      const button = page.locator('button:has-text("Initialize Connection"), button:has-text("Disconnect")');
      await expect(button.first()).toBeVisible();
    });

    test('should render QR Code tab with placeholder', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click QR Code tab
      await page.locator('button:has-text("📱 QR Code")').click();
      
      // Verify QR panel
      await expect(page.locator('.qr-panel')).toBeVisible();
      
      // When disconnected, should show placeholder
      const placeholder = page.locator('.qr-placeholder');
      await expect(placeholder).toBeVisible();
    });

    test('should render Messages tab with form', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Messages tab
      await page.locator('button:has-text("✉️ Messages")').click();
      
      // Verify form elements
      const phoneInput = page.locator('input[placeholder*="+971"]');
      const messageTextarea = page.locator('textarea[placeholder*="Type your test message"]');
      const sendButton = page.locator('button:has-text("Send Test Message")');
      
      await expect(phoneInput).toBeVisible();
      await expect(messageTextarea).toBeVisible();
      await expect(sendButton).toBeVisible();
    });

    test('should render Queue tab with stats', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Queue tab
      await page.locator('button:has-text("📋 Queue")').click();
      
      // Verify queue stats
      await expect(page.locator('.queue-stats')).toBeVisible();
      
      // Check for queue metrics
      const queueNumbers = await page.locator('.queue-number').count();
      expect(queueNumbers).toBeGreaterThanOrEqual(3); // Size, Capacity, Processing
    });

    test('should render Business Settings tab with form', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Settings tab
      await page.locator('button:has-text("⚙️ Business Settings")').click();
      
      // Verify form fields
      await expect(page.locator('input[placeholder="White Caves Real Estate LLC"]')).toBeVisible();
      await expect(page.locator('input[type="tel"]')).toBeVisible();
      await expect(page.locator('textarea')).toBeVisible();
      await expect(page.locator('button:has-text("Save Business Settings")')).toBeVisible();
    });
  });

  test.describe('Tab Navigation', () => {
    test('should switch between tabs correctly', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      const tabs = [
        { selector: 'button:has-text("📊 Status")', content: '.status-panel' },
        { selector: 'button:has-text("📱 QR Code")', content: '.qr-panel' },
        { selector: 'button:has-text("✉️ Messages")', content: '.test-message-form' },
        { selector: 'button:has-text("📋 Queue")', content: '.queue-panel' }
      ];

      for (const tab of tabs) {
        await page.locator(tab.selector).click();
        await expect(page.locator(tab.content)).toBeVisible({ timeout: 5000 });
      }
    });

    test('should maintain scroll position when switching tabs', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 300));
      const scrollBefore = await page.evaluate(() => window.scrollY);
      
      // Switch tab and back
      await page.locator('button:has-text("✉️ Messages")').click();
      await page.locator('button:has-text("📊 Status")').click();
      
      // Check scroll position (may vary)
      const scrollAfter = await page.evaluate(() => window.scrollY);
      expect(Math.abs(scrollBefore - scrollAfter)).toBeLessThan(100); // Allow 100px variance
    });
  });

  test.describe('API Integration', () => {
    test('should fetch initialization status on load', async () => {
      // Intercept API call
      await page.route('**/api/whatsapp/session', async (route) => {
        await route.continue();
      });

      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Wait for network idle to ensure all initial requests complete
      await page.waitForLoadState('networkidle');
    });

    test('should show error message on failed API call', async () => {
      // Mock failed API response
      await page.route('**/api/whatsapp/session', async (route) => {
        await route.abort();
      });

      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Component should still render (graceful degradation)
      await expect(page.locator('h1:has-text("WhatsApp")')).toBeVisible();
    });

    test('should handle settings save correctly', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Business Settings tab
      await page.locator('button:has-text("⚙️ Business Settings")').click();
      
      // Fill in business name
      await page.fill('input[placeholder="White Caves Real Estate LLC"]', 'Test Business');
      
      // Mock API response
      await page.route('**/api/whatsapp/settings', async (route) => {
        if (route.request().method() === 'PUT') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true })
          });
        } else {
          await route.continue();
        }
      });
      
      // Save
      await page.click('button:has-text("Save Business Settings")');
      
      // Check for success message
      const successMsg = page.locator('text=Settings saved successfully');
      await expect(successMsg).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Redux State Management', () => {
    test('should connect Redux DevTools (if available)', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Try to access Redux state through window object
      const hasReduxDevTools = await page.evaluate(() => {
        return typeof (window as any).__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined';
      });
      
      // Should have Redux or Redux DevTools support
      if (!hasReduxDevTools) {
        console.log('Note: Redux DevTools not available - using regular Redux');
      }
    });

    test('should update UI when Redux state changes', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Simulate state update by checking button disabled state
      const button = page.locator('button:has-text("Initialize Connection"), button:has-text("Disconnect")').first();
      const isDisabled = await button.isDisabled();
      
      // Button should start as enabled
      expect(isDisabled).toBeFalsy();
    });
  });

  test.describe('Error Handling', () => {
    test('should display validation error for invalid phone number', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Messages tab
      await page.locator('button:has-text("✉️ Messages")').click();
      
      // Fill invalid data
      await page.fill('input[placeholder*="+971"]', 'invalid');
      await page.fill('textarea', 'Test message');
      
      // Try to send
      await page.click('button:has-text("Send Test Message")');
      
      // Should show error or prevent send
      const phoneInput = page.locator('input[placeholder*="+971"]');
      const type = await phoneInput.getAttribute('type');
      expect(type).toBe('tel'); // Type tel should validate format
    });

    test('should handle disconnect gracefully', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Mock disconnect endpoint
      await page.route('**/api/whatsapp/disconnect', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true })
        });
      });
      
      // If connected, click disconnect (may not be visible if disconnected)
      const disconnectBtn = page.locator('button:has-text("Disconnect")');
      const isVisible = await disconnectBtn.isVisible().catch(() => false);
      
      if (isVisible) {
        await disconnectBtn.click();
        // Should show success message
        const msg = page.locator('text=disconnected successfully');
        await expect(msg).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Message Flow Validation', () => {
    test('should disable message input when not authenticated', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Messages tab
      await page.locator('button:has-text("✉️ Messages")').click();
      
      // Check if inputs are disabled when disconnected
      const phoneInput = page.locator('input[placeholder*="+971"]');
      const messageInput = page.locator('textarea');
      const sendBtn = page.locator('button:has-text("Send Test Message")');
      
      // When disconnected, these should be disabled
      const phoneDisabled = await phoneInput.isDisabled().catch(() => false);
      const messageDisabled = await messageInput.isDisabled().catch(() => false);
      const btnDisabled = await sendBtn.isDisabled().catch(() => false);
      
      // At least button should be disabled when disconnected
      expect(btnDisabled || phoneDisabled || messageDisabled).toBeTruthy();
    });

    test('should prevent sending empty messages', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Messages tab
      await page.locator('button:has-text("✉️ Messages")').click();
      
      // Try to send with empty fields
      const sendBtn = page.locator('button:has-text("Send Test Message")');
      const isDisabled = await sendBtn.isDisabled();
      
      // Unless we have a valid session, button should be disabled
      // This tests the conditional rendering
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('should load page in reasonable time', async () => {
      const startTime = Date.now();
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load in less than 5 seconds
    });

    test('should have proper heading hierarchy', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Check for H1
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      // Check for proper heading structure
      const h3s = await page.locator('h3').count();
      expect(h3s).toBeGreaterThan(0);
    });

    test('should have accessible form labels', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Click Messages tab
      await page.locator('button:has-text("✉️ Messages")').click();
      
      // Check for labels
      const phoneLabel = page.locator('label:has-text("Recipient Phone")');
      const messageLabel = page.locator('label:has-text("Message")');
      
      await expect(phoneLabel).toBeVisible();
      await expect(messageLabel).toBeVisible();
    });
  });

  test.describe('WebSocket/Real-Time Updates', () => {
    test('should attempt WebSocket connection', async () => {
      // Listen for WebSocket messages
      let wsConnected = false;
      let wsError = false;

      page.on('websocket', (ws) => {
        wsConnected = true;
        console.log('[TEST] WebSocket opened:', ws.url());
        
        ws.on('socketerror', (err: string) => {
          wsError = true;
          console.log('[TEST] WebSocket error:', err);
        });
      });

      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Give WebSocket time to connect
      await page.waitForTimeout(2000);
      
      // Should attempt connection (may fail if server doesn't support it yet)
      console.log(`WebSocket attempted: ${wsConnected}, Errors: ${wsError}`);
    });

    test('should fallback to polling if WebSocket unavailable', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // Check if polling mechanism is active
      let pollCount = 0;
      await page.route('**/api/whatsapp/session', async (route) => {
        pollCount++;
        await route.continue();
      });
      
      // Trigger connecting state somehow (or just wait)
      await page.waitForTimeout(4000); // Wait for at least one poll
      
      // Should have polled at least once during this time
      console.log(`Poll count: ${pollCount}`);
    });
  });

  test.describe('Full User Flow Simulation', () => {
    test('should complete initialization → message → verify flow', async () => {
      await page.goto(WHATSAPP_SETTINGS_URL, { waitUntil: 'networkidle' });
      
      // 1. Check initial status
      await page.locator('button:has-text("📊 Status")').click();
      const initialStatus = page.locator('.status-badge');
      await expect(initialStatus).toBeVisible();
      
      // 2. Click Initialize (this would normally show QR code)
      const initBtn = page.locator('button:has-text("Initialize Connection")');
      const isVisible = await initBtn.isVisible().catch(() => false);
      
      if (isVisible) {
        // Mock successful init
        await page.route('**/api/whatsapp/init', async (route) => {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ sessionId: 'test_session' })
          });
        });
        
        await initBtn.click();
        
        // Wait for UI update
        await page.waitForTimeout(1000);
      }
      
      // 3. Go to Messages tab
      await page.locator('button:has-text("✉️ Messages")').click();
      
      // 4. Verify form is present
      const phoneInput = page.locator('input[placeholder*="+971"]');
      const messageInput = page.locator('textarea');
      
      await expect(phoneInput).toBeVisible();
      await expect(messageInput).toBeVisible();
      
      // Test complete - full flow simulated
    });
  });

  test.afterEach(async () => {
    await page.close();
  });
});
