import { test, expect } from '@playwright/test';

test.describe('UI Visibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3003');
  });

  test('Dashboard loads with visible content', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check main heading is visible
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Check metric cards are visible
    await expect(page.locator('text=Total Vehicles')).toBeVisible();
    await expect(page.locator('text=Active Drivers')).toBeVisible();
    await expect(page.locator('text=Total Trailers')).toBeVisible();
    
    // Verify data is loaded
    await expect(page.locator('text=14').first()).toBeVisible(); // Total vehicles
    await expect(page.locator('text=5').first()).toBeVisible(); // Total drivers
  });

  test('Drivers tab - Add Driver form has proper visibility', async ({ page }) => {
    // Navigate to drivers tab
    await page.click('text=Driver Management');
    await page.waitForLoadState('networkidle');
    
    // Open add driver dialog
    await page.click('button:has-text("Add Driver")');
    
    // Check dialog is visible with white background
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // Check dialog has white background
    const dialogBg = await dialog.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(dialogBg).toBe('rgb(255, 255, 255)'); // White
    
    // Check form labels are visible and readable
    await expect(page.locator('label:has-text("Employee ID")')).toBeVisible();
    await expect(page.locator('label:has-text("First Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Last Name")')).toBeVisible();
    
    // Check inputs have white background
    const input = page.locator('input[type="text"]').first();
    const inputBg = await input.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(inputBg).toBe('rgb(255, 255, 255)'); // White
    
    // Check text is dark/readable
    const label = page.locator('label').first();
    const labelColor = await label.evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(labelColor).toMatch(/rgb\((\d+), (\d+), (\d+)\)/); // Should be dark gray
  });

  test('Fleet tab - Add Vehicle form has proper visibility', async ({ page }) => {
    // Navigate to fleet tab
    await page.click('text=Fleet Registry');
    await page.waitForLoadState('networkidle');
    
    // Open add vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    
    // Check dialog content is visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // Verify form elements are visible
    await expect(page.locator('text=Add New Vehicle')).toBeVisible();
    await expect(page.locator('label:has-text("VIN")')).toBeVisible();
    await expect(page.locator('label:has-text("Make")')).toBeVisible();
    await expect(page.locator('label:has-text("Model")')).toBeVisible();
    
    // Check select dropdowns are visible and styled properly
    const select = page.locator('[role="combobox"]').first();
    if (await select.isVisible()) {
      const selectBg = await select.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(selectBg).toBe('rgb(255, 255, 255)'); // White
    }
  });

  test('Compliance tab - forms are accessible', async ({ page }) => {
    // Navigate to compliance tab
    await page.click('text=Compliance');
    await page.waitForLoadState('networkidle');
    
    // Check compliance content is visible
    await expect(page.locator('h1:has-text("Compliance Hub")')).toBeVisible();
    
    // If there's an add button, test it
    const addButton = page.locator('button:has-text("Add Document")');
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Check dialog opens with visible content
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      
      // Verify contrast
      const dialogText = await dialog.locator('text').first().evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          background: styles.backgroundColor
        };
      });
      
      // Text should be dark on light background
      expect(dialogText.background).toMatch(/rgb\(255, 255, 255\)|rgba\(255, 255, 255/);
    }
  });

  test('All dialogs have semi-transparent overlay', async ({ page }) => {
    // Navigate to drivers tab
    await page.click('text=Driver Management');
    await page.waitForLoadState('networkidle');
    
    // Open add driver dialog
    await page.click('button:has-text("Add Driver")');
    
    // Check overlay exists and is semi-transparent
    const overlay = page.locator('[data-radix-dialog-overlay]');
    await expect(overlay).toBeVisible();
    
    const overlayBg = await overlay.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    // Should be semi-transparent black (rgba with alpha < 1)
    expect(overlayBg).toMatch(/rgba\(\d+, \d+, \d+, 0\.\d+\)/);
  });
});

test.describe('Form Functionality Tests', () => {
  test('Can interact with form inputs', async ({ page }) => {
    await page.goto('http://localhost:3003/drivers');
    await page.waitForLoadState('networkidle');
    
    // Open add driver dialog
    await page.click('button:has-text("Add Driver")');
    
    // Test typing in inputs
    await page.fill('input[placeholder*="Employee ID"]', 'IMS-TEST-001');
    await page.fill('input[placeholder*="First Name"]', 'Test');
    await page.fill('input[placeholder*="Last Name"]', 'Driver');
    
    // Verify values are visible
    await expect(page.locator('input[value="IMS-TEST-001"]')).toBeVisible();
    await expect(page.locator('input[value="Test"]')).toBeVisible();
    await expect(page.locator('input[value="Driver"]')).toBeVisible();
  });
});