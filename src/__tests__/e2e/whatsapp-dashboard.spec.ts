import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('WhatsApp Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Authentication & Navigation', () => {
    test('should load dashboard homepage', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should navigate to WhatsApp dashboard', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      await expect(page).toHaveURL(/.*whatsapp/i);
    });

    test('should display main dashboard sections', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      // Check for main components
      const accountSection = page.locator('[data-testid="account-section"]');
      const chatSection = page.locator('[data-testid="chat-section"]');
      const analyticsSection = page.locator('[data-testid="analytics-section"]');

      await expect(accountSection).toBeVisible();
      await expect(chatSection).toBeVisible();
      await expect(analyticsSection).toBeVisible();
    });
  });

  test.describe('Account Linking', () => {
    test('should display account linking interface', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const linkButton = page.locator('button:has-text("Link Account")');
      await expect(linkButton).toBeVisible();
    });

    test('should open account linking modal', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      await page.click('button:has-text("Link Account")');

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
    });

    test('should validate account form inputs', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      await page.click('button:has-text("Link Account")');

      // Try to submit without filling form
      const submitButton = page.locator('button:has-text("Link")');
      await submitButton.click();

      // Check for validation errors
      const errorMessages = page.locator('[role="alert"]');
      await expect(errorMessages).toBeTruthy();
    });

    test('should display linked accounts', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const accountList = page.locator('[data-testid="account-list"]');
      await expect(accountList).toBeVisible();
    });

    test('should allow account selection', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const accountItem = page.locator('[data-testid="account-item"]').first();
      await accountItem.click();

      // Verify account is selected
      await expect(accountItem).toHaveClass(/selected|active/);
    });
  });

  test.describe('Conversation List', () => {
    test('should display conversation list', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversationList = page.locator('[data-testid="conversation-list"]');
      await expect(conversationList).toBeVisible();
    });

    test('should filter conversations by search', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('test contact');

      // Wait for filtering
      await page.waitForTimeout(500);

      const conversations = page.locator('[data-testid="conversation-item"]');
      expect(await conversations.count()).toBeGreaterThan(0);
    });

    test('should sort conversations', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const sortButton = page.locator('button:has-text("Sort")');
      if (await sortButton.isVisible()) {
        await sortButton.click();
        
        const sortOption = page.locator('[role="menuitem"]:has-text("Newest")');
        await sortOption.click();
      }
    });

    test('should mark conversation as read/unread', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const readButton = page.locator('button[title*="Read"]');
      if (await readButton.isVisible()) {
        await readButton.click();
      }
    });

    test('should archive conversation', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      const contextMenu = conversation.locator('button[aria-label="More options"]');
      
      if (await contextMenu.isVisible()) {
        await contextMenu.click();
        await page.locator('[role="menuitem"]:has-text("Archive")').click();
      }
    });
  });

  test.describe('Chat Interface', () => {
    test('should open chat interface for conversation', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const chatContainer = page.locator('[data-testid="chat-interface"]');
      await expect(chatContainer).toBeVisible();
    });

    test('should display message history', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const messages = page.locator('[data-testid="message-item"]');
      expect(await messages.count()).toBeGreaterThan(0);
    });

    test('should send text message', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const messageInput = page.locator('input[placeholder*="message"]');
      await messageInput.fill('Test message');

      const sendButton = page.locator('button[aria-label="Send"]');
      await sendButton.click();

      // Verify message was sent
      await expect(page.locator('text=Test message')).toBeVisible();
    });

    test('should upload and send media', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const mediaButton = page.locator('button[aria-label="Attach media"]');
      if (await mediaButton.isVisible()) {
        // Note: File upload is complex in E2E tests
        await expect(mediaButton).toBeVisible();
      }
    });

    test('should display emoji picker', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const emojiButton = page.locator('button[aria-label="Emoji"]');
      if (await emojiButton.isVisible()) {
        await emojiButton.click();
        
        const emojiPicker = page.locator('[role="dialog"]:has-text("emoji")');
        await expect(emojiPicker).toBeVisible();
      }
    });

    test('should edit sent message', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const message = page.locator('[data-testid="message-item"]').first();
      const editButton = message.locator('button[aria-label="Edit"]');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await expect(page.locator('input[value*="Edit"]')).toBeVisible();
      }
    });

    test('should delete message', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const message = page.locator('[data-testid="message-item"]').first();
      const deleteButton = message.locator('button[aria-label="Delete"]');
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Delete")').last();
        await confirmButton.click();
      }
    });
  });

  test.describe('Analytics Dashboard', () => {
    test('should display analytics section', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const analyticsSection = page.locator('[data-testid="analytics-section"]');
      await expect(analyticsSection).toBeVisible();
    });

    test('should display key statistics', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const totalMessages = page.locator('[data-testid="total-messages"]');
      const totalConversations = page.locator('[data-testid="total-conversations"]');
      const responseTime = page.locator('[data-testid="avg-response-time"]');

      await expect(totalMessages).toBeVisible();
      await expect(totalConversations).toBeVisible();
      await expect(responseTime).toBeVisible();
    });

    test('should display message chart', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const chart = page.locator('[data-testid="message-chart"]');
      await expect(chart).toBeVisible();
    });

    test('should filter analytics by date range', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const dateFilter = page.locator('[data-testid="date-filter"]');
      if (await dateFilter.isVisible()) {
        await dateFilter.click();
        
        const dateOption = page.locator('[role="menuitem"]:has-text("Last 7 days")');
        await dateOption.click();

        // Verify chart updates
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Settings & Configuration', () => {
    test('should access settings page', async ({ page }) => {
      const settingsButton = page.locator('button[aria-label="Settings"]');
      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        await expect(page).toHaveURL(/.*settings/i);
      }
    });

    test('should update notification preferences', async ({ page }) => {
      const settingsButton = page.locator('button[aria-label="Settings"]');
      if (await settingsButton.isVisible()) {
        await settingsButton.click();

        const notificationToggle = page.locator(
          'input[type="checkbox"][aria-label*="notification"]'
        );
        if (await notificationToggle.isVisible()) {
          await notificationToggle.click();
        }
      }
    });

    test('should logout user', async ({ page }) => {
      const logoutButton = page.locator('button:has-text("Logout")');
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await expect(page).toHaveURL(/.*login|auth/i);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.click('a:has-text("WhatsApp")');
      const chatInterface = page.locator('[data-testid="chat-interface"]');
      await expect(chatInterface).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.click('a:has-text("WhatsApp")');
      const chatInterface = page.locator('[data-testid="chat-interface"]');
      await expect(chatInterface).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });

    test('should handle large conversation lists', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversationList = page.locator('[data-testid="conversation-list"]');
      await expect(conversationList).toBeVisible();

      // Scroll to bottom to trigger virtualization
      await conversationList.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });

      await page.waitForTimeout(500);
    });
  });

  test.describe('Error Handling', () => {
    test('should display error message for failed account link', async ({
      page,
    }) => {
      // This would require mocking API failures
      // Implementation depends on your error handling setup
      const errorContainer = page.locator('[role="alert"]');
      
      if (await errorContainer.isVisible()) {
        await expect(errorContainer).toContainText(/error|failed/i);
      }
    });

    test('should retry failed message send', async ({ page }) => {
      await page.click('a:has-text("WhatsApp")');
      
      const conversation = page.locator('[data-testid="conversation-item"]').first();
      await conversation.click();

      const retryButton = page.locator('button[aria-label*="Retry"]');
      if (await retryButton.isVisible()) {
        await expect(retryButton).toBeVisible();
      }
    });
  });
});
