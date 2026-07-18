import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const AUTH_FILE ='playwright/.auth/user.json';

/**
 * AUTH SETUP - Runs ONCE before all other tests.
 * Logs in via the UI, saves browser state (cookies + localStorage)
 * to a JSON file. All other tests load this file to skip login.
 */

setup('authenticate and save session state', async ({ page }) => {
    // Step 1: Log in the normal way (via the UI)
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('Admin', 'admin123');

    // Step 2: Verify we're on the dashboard (login worked)
    await expect(page).toHaveURL(/dashboard/i);

    // Step 3: Save the entire browser state to a file
    // This captures cookies, localStorage, sessionStorage - everything
    await page.context().storageState({ path: AUTH_FILE });
    console.log(`[AUTH] Session saved to ${AUTH_FILE}`);
});

