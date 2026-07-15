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
        await loginPage.login('Admin', 'admin123');
        await expect(page).toHaveURL(/dashboard/i);
        await expect(dashboardPage.pageHeader).toBeVisible();
        await expect(page).toHaveTitle(/OrangeHRM/);
    });

    test('Navigate from Dashboard to Admin page', async ({ page }) => {
        await loginPage.login('Admin', 'admin123');
        await expect(page).toHaveURL(/dashboard/i);
        await dashboardPage.navigateToAdmin();
        await expect(page).toHaveURL(/viewSystemUsers/i);
        await expect(adminPage.mainHeader).toBeVisible();
    });

    test('Invalid login should show error and login button stays visible', async ({ page }) => {
        await loginPage.login('WrongUser', 'wrongPass');
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
        await expect(loginPage.loginButton).toBeVisible();
        await expect(page).toHaveURL(/login/i);
    });

});