import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Visual Regression Tests', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo();
    });

    test('Login page should match baseline screenshot', async ({ page }) => {
        // Wait for the page to fully load before taking screenshot
        await expect(loginPage.loginButton).toBeVisible({ timeout: 15000 });

        // Take a full-page screenshot and compare to baseline
        await expect(page).toHaveScreenshot('login-page.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.05,
        });
    });
});