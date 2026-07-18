import { test, expect } from '@playwright/test';

test.describe('Storage State Magic', () => {

    test('should be already logged in - no login code needed!', async ({ page }) => {
        await page.goto('/web/index.php/dashboard/index');
        await expect(page).toHaveURL(/dashboard/i);
        await expect(page.locator('.oxd-topbar-header-breadcrumb')).toBeVisible();
        console.log('[MAGIC] Skipped login entirely! Just like showing a wristband.');
    });

});