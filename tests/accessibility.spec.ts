import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Day 18 - Accessibility Testing', () => {

    test('TC001 - Scan OrangeHRM login page for accessibility violations', async ({page}) => {
        await page.goto('/web/index.php/auth/login');
        await page.waitForLoadState('networkidle');
        const accessibilityScanResults = await new AxeBuilder({page}).analyze();
        await test.info().attach('accessibility-scan-results', {
            body: JSON.stringify(accessibilityScanResults.violations, null, 2),
            contentType: 'application/json'
        });
        expect(accessibilityScanResults.violations).toEqual([]);
    });

});