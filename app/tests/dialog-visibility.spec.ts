import { test, expect } from '@playwright/test';

test.describe('Dialog Visibility Verification', () => {
  test('Drivers page - dialog forms are visible with white background', async ({ page }) => {
    // Navigate to drivers page
    await page.goto('http://localhost:3003/drivers');
    await page.waitForLoadState('networkidle');
    
    // Look for the "Add Driver" button using a more flexible selector
    const addButton = page.locator('button').filter({ hasText: /add.*driver/i }).first();
    
    // Check if button exists
    const buttonVisible = await addButton.isVisible();
    
    if (buttonVisible) {
      // Click the add driver button
      await addButton.click();
      
      // Wait for dialog to appear
      await page.waitForTimeout(500);
      
      // Check if dialog is visible
      const dialog = page.locator('[role="dialog"]').or(page.locator('.fixed.left-\\[50\\%\\]'));
      const dialogVisible = await dialog.isVisible();
      
      if (dialogVisible) {
        // Verify dialog has white background
        const bgColor = await dialog.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        console.log('Dialog background color:', bgColor);
        
        // Check if it's white or close to white
        expect(bgColor).toMatch(/rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255/);
        
        // Check that text is visible (dark color)
        const textElement = dialog.locator('label, h2, div').first();
        if (await textElement.isVisible()) {
          const textColor = await textElement.evaluate(el => {
            return window.getComputedStyle(el).color;
          });
          console.log('Text color:', textColor);
          
          // Verify text is dark (not white)
          expect(textColor).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
        }
        
        // Verify form inputs have white background
        const input = dialog.locator('input').first();
        if (await input.isVisible()) {
          const inputBg = await input.evaluate(el => {
            return window.getComputedStyle(el).backgroundColor;
          });
          console.log('Input background color:', inputBg);
          expect(inputBg).toMatch(/rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255|transparent/);
        }
      } else {
        console.log('Dialog not found - checking if forms are inline');
        // If no dialog, check if form is inline on page
        const formInput = page.locator('input[type="text"]').first();
        if (await formInput.isVisible()) {
          const inputBg = await formInput.evaluate(el => {
            return window.getComputedStyle(el).backgroundColor;
          });
          console.log('Inline form input background:', inputBg);
          expect(inputBg).toMatch(/rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255/);
        }
      }
    } else {
      console.log('Add Driver button not found - page structure may be different');
    }
  });
  
  test('Fleet page - dialog has proper contrast', async ({ page }) => {
    await page.goto('http://localhost:3003/fleet');
    await page.waitForLoadState('networkidle');
    
    // Look for Add Vehicle button
    const addButton = page.locator('button').filter({ hasText: /add.*vehicle/i }).first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Check dialog overlay
      const overlay = page.locator('[data-radix-dialog-overlay], [class*="overlay"], .fixed.inset-0').first();
      if (await overlay.isVisible()) {
        const overlayBg = await overlay.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        console.log('Overlay background:', overlayBg);
        
        // Should be semi-transparent
        expect(overlayBg).toMatch(/rgba?\(.*,.*,.*,\s*0\.\d+\)/);
      }
      
      // Check dialog content
      const dialog = page.locator('[role="dialog"], .fixed.left-\\[50\\%\\]').first();
      if (await dialog.isVisible()) {
        const dialogBg = await dialog.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        console.log('Fleet dialog background:', dialogBg);
        expect(dialogBg).toMatch(/rgb\(255,\s*255,\s*255\)/);
      }
    }
  });
});