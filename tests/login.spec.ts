import { test, expect } from '@playwright/test';

test('OrangeHRM Login - Valid credentials should reach Dashboard', async ({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/i);
    await expect(page).toHaveTitle(/OrangeHRM/);
});