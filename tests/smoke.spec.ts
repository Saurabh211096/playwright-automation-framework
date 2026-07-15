import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';

test.describe('OrangeHRM Smoke Tests with Web-First Assertions', () => {

    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let adminPage: AdminPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        adminPage = new AdminPage(page);
        await loginPage.navigateTo();
    });

    test('Valid login should land on Dashboard with correct heading', async ({ page }) => {
        // --- Action ---
        await loginPage.login('Admin', 'admin123');

        // --- Web-First Assertions (all auto-retry!) ---
        // Assert 1: URL should contain "dashboard" (page may still be loading)
        await expect(page).toHaveURL(/dashboard/i);

        // Assert 2: The Dashboard heading should be visible on screen
        //await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        await expect(dashboardPage.pageHeader).toBeVisible();

        // Assert 3: The page title should contain "OrangeHRM"
        await expect(page).toHaveTitle(/OrangeHRM/);
    });

    test('Navigate from Dashboard to Admin page', async ({ page }) => {
        // --- Setup: Login first ---
        await loginPage.login('Admin', 'admin123');
        await expect(page).toHaveURL(/dashboard/i);

        // --- Action: Click Admin in sidebar ---
        await dashboardPage.navigateToAdmin();

        // --- Web-First Assertions ---
        // Assert 1: URL should now contain "admin"
        await expect(page).toHaveURL(/viewSystemUsers/i);

        // Assert 2: Admin page heading should be visible
        //await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
        await expect(adminPage.mainHeader).toBeVisible();
    });

    test('Invalid login should show error and login button stays visible', async ({ page }) => {
        // --- Action ---
        await loginPage.login('WrongUser', 'wrongPass');

        // --- Web-First Assertions ---
        // Assert 1: Error alert should become visible (retries until it appears)
        //await expect(page.locator('.oxd-alert-content-text')).toBeVisible();
        await expect(loginPage.errorMessage).toBeVisible();

        // Assert 2: Error message should have the exact text
        //await expect(page.locator('.oxd-alert-content-text')).toHaveText('Invalid credentials');
        await expect(loginPage.errorMessage).toHaveText('Invalid credentials');

        // Assert 3: Login button should STILL be visible (we didn't navigate away)
        //await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();

        // Assert 4: URL should NOT contain "dashboard" (we should still be on login)
        await expect(page).toHaveURL(/login/i);
    });

});
