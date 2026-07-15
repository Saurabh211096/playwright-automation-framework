import { type Page, type Locator } from '@playwright/test';

/**
 * LoginPage - Page Object for the OrangeHRM Login Screen.
 * 
 * Encapsulates all locators and actions related to the login page.
 * Tests should NEVER directly touch login page elements — they use
 * this class's methods instead.
 */
export class LoginPage {

    // --- Private Property: The Browser Page Handle ---
    private page: Page;

    // --- Constructor: Receives the page from the test ---
    constructor(page: Page) {
        this.page = page;
    }

    // ====================================================
    //  LOCATORS (Lazy-evaluated — no DOM search happens here)
    // ====================================================

    /** Username input field — found by its placeholder text */
    private get usernameField(): Locator {
        return this.page.getByPlaceholder('Username');
    }

    /** Password input field — found by its placeholder text */
    private get passwordField(): Locator {
        return this.page.getByPlaceholder('Password');
    }

    /** Login button — found by its accessible role + visible name */
    public get loginButton(): Locator {
        return this.page.getByRole('button', { name: 'Login' });
    }

    /** Error alert — shown when login fails (wrong credentials) */
    public get errorMessage(): Locator {
        return this.page.locator('.oxd-alert-content-text');
    }

    // ====================================================
    //  ACTIONS (These actually interact with the page)
    // ====================================================

    /**
     * Navigate to the OrangeHRM login page.
     */
    async navigateTo(): Promise<void> {
        await this.page.goto('/web/index.php/auth/login');
    }

    /**
     * Type a username into the username field.
     * @param username - The username string to enter
     */
    async enterUsername(username: string): Promise<void> {
        await this.usernameField.fill(username);
    }

    /**
     * Type a password into the password field.
     * @param password - The password string to enter
     */
    async enterPassword(password: string): Promise<void> {
        await this.passwordField.fill(password);
    }

    /**
     * Click the Login button.
     */
    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    /**
     * Combined action: Fill both fields and click login.
     * This is a convenience method so tests can login in one line.
     * @param username - The username to enter
     * @param password - The password to enter
     */
    async login(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    /**
     * Get the text of the error message shown after a failed login.
     * @returns The visible error message text
     */
    async getErrorMessageText(): Promise<string> {
        return await this.errorMessage.textContent() ?? '';
    }
}
