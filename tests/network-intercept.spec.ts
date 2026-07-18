import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Day 18 - Network Interception with page.route()', () => {

    test('TC001 - Log all network requests made during login', async ({ page }) => {
        await page.route('**', async (route) => {
            const url = route.request().url();
            const method = route.request().method();
            const resourceType = route.request().resourceType();

            // Only print if it's an API/XHR call, not images/scripts/fonts
            if (resourceType === 'xhr' || resourceType === 'fetch') {
                console.log(`[API CALL] ${method} ${url}`);
            }

            await route.continue();
        });

        // Normal login - watch the console!
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo();
        await loginPage.login('Admin', 'admin123');
        await expect(page).toHaveURL(/dashboard/i);
        console.log('[VERIFY] Login successful!');
    });

    test.only('TC002 - Mock the translations API to return fake data', async ({ page }) => {
        await page.route('**/web/index.php/core/i18n/messages', async (route) => {
            console.log('[MOCK] Faking translation response');
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    // Our fake translations, we only provide english.
                    "Dashboard": "Dashboard (MOCKED!)",
                    "Admin": "Admin (MOCKED!)",
                    "PIM": "PIM (MOCKED!)",
                    "Leave": "Leave (MOCKED!)"
                })
            })
        });

        // Login normally
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo();
        await loginPage.login('Admin', 'admin123');

        await expect(page).toHaveURL(/dashboard/i);
        console.log('[VERIFY] Logged in with mocked translations!');

        await page.waitForTimeout(2000);
        
    });

});