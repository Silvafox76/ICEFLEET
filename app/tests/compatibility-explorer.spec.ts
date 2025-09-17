import { test, expect } from '@playwright/test';

test.describe('Compatibility Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/compatibility');
    await page.waitForLoadState('networkidle');
  });

  test('should load compatibility explorer page', async ({ page }) => {
    // Check page title and description
    await expect(page.locator('h1')).toContainText('Compatibility Explorer');
    await expect(page.locator('p')).toContainText('Ensure safe vehicle-trailer pairing');
  });

  test('should display vehicle and trailer selection', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="vehicle-select"]', { timeout: 10000 });
    
    // Check vehicle selector is present
    await expect(page.locator('[data-testid="vehicle-select"]')).toBeVisible();
    
    // Check trailer selector is present
    await expect(page.locator('[data-testid="trailer-select"]')).toBeVisible();
  });

  test('should show compatibility results when selections are made', async ({ page }) => {
    // Wait for selectors to be available
    await page.waitForSelector('[data-testid="vehicle-select"]', { timeout: 10000 });
    
    // Select a vehicle
    await page.click('[data-testid="vehicle-select"]');
    await page.click('[role="option"]:first-child');
    
    // Select a trailer
    await page.click('[data-testid="trailer-select"]');
    await page.click('[role="option"]:first-child');
    
    // Wait for compatibility check to complete
    await page.waitForSelector('[data-testid="compatibility-result"]', { timeout: 5000 });
    
    // Check compatibility result is displayed
    await expect(page.locator('[data-testid="compatibility-result"]')).toBeVisible();
  });

  test('should show compatibility status badge', async ({ page }) => {
    // Make selections
    await page.waitForSelector('[data-testid="vehicle-select"]', { timeout: 10000 });
    await page.click('[data-testid="vehicle-select"]');
    await page.click('[role="option"]:first-child');
    
    await page.click('[data-testid="trailer-select"]');
    await page.click('[role="option"]:first-child');
    
    // Check status badge appears
    await page.waitForSelector('[data-testid="compatibility-status"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="compatibility-status"]')).toBeVisible();
  });

  test('should display compatibility details', async ({ page }) => {
    // Make selections
    await page.waitForSelector('[data-testid="vehicle-select"]', { timeout: 10000 });
    await page.click('[data-testid="vehicle-select"]');
    await page.click('[role="option"]:first-child');
    
    await page.click('[data-testid="trailer-select"]');
    await page.click('[role="option"]:first-child');
    
    // Check compatibility details are shown
    await page.waitForSelector('[data-testid="compatibility-details"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="compatibility-details"]')).toBeVisible();
  });

  test('should show provincial requirements', async ({ page }) => {
    // Make selections
    await page.waitForSelector('[data-testid="vehicle-select"]', { timeout: 10000 });
    await page.click('[data-testid="vehicle-select"]');
    await page.click('[role="option"]:first-child');
    
    await page.click('[data-testid="trailer-select"]');
    await page.click('[role="option"]:first-child');
    
    // Check provincial requirements section
    await page.waitForSelector('[data-testid="provincial-requirements"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="provincial-requirements"]')).toBeVisible();
  });

  test('should allow province selection', async ({ page }) => {
    // Check province selector is present
    await expect(page.locator('[data-testid="province-select"]')).toBeVisible();
    
    // Change province
    await page.click('[data-testid="province-select"]');
    await page.click('[role="option"]:has-text("BC")');
    
    // Verify province changed
    await expect(page.locator('[data-testid="province-select"]')).toContainText('BC');
  });

  test('should show loading state while fetching data', async ({ page }) => {
    // Check loading indicator is shown initially
    await expect(page.locator('text=Loading fleet data...')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('[data-testid="vehicle-select"]', { timeout: 10000 });
    await expect(page.locator('text=Loading fleet data...')).not.toBeVisible();
  });

  test('should handle error state gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/fleet*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    // Reload page to trigger error
    await page.reload();
    
    // Check error handling (should still show some UI)
    await expect(page.locator('h1')).toContainText('Compatibility Explorer');
  });

  test('should save compatibility check results', async ({ page }) => {
    // Make selections
    await page.waitForSelector('[data-testid="vehicle-select"]', { timeout: 10000 });
    await page.click('[data-testid="vehicle-select"]');
    await page.click('[role="option"]:first-child');
    
    await page.click('[data-testid="trailer-select"]');
    await page.click('[role="option"]:first-child');
    
    // Wait for results
    await page.waitForSelector('[data-testid="compatibility-result"]', { timeout: 5000 });
    
    // Click save button if present
    const saveButton = page.locator('[data-testid="save-compatibility"]');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Check for success message
      await expect(page.locator('text=Compatibility check saved')).toBeVisible();
    }
  });
});
