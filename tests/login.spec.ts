import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('OrangeHRM Login Tests', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo();
    });

    test('Valid credentials should reach Dashboard', async ({ page }) => {
        await loginPage.login('Admin', 'admin123');
        await expect(page).toHaveURL(/dashboard/i);
        await expect(page).toHaveTitle(/OrangeHRM/);
    });

    test('Invalid credentials should show error message', async () => {
        await loginPage.login('WrongUser', 'wrongPass');
        const errorText = await loginPage.getErrorMessageText();
        expect(errorText).toBe('Invalid credentials');
    });

});