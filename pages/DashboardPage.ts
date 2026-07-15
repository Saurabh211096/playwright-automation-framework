import { type Page, type Locator } from "@playwright/test";

export class DashboardPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators

    private get adminLink(): Locator {
        //return this.page.getByText('Admin');
        return this.page.getByRole('link', { name: 'Admin' });
    }

    public get pageHeader(): Locator {
        return this.page.getByRole('heading', {name: 'Dashboard'});
    }

    // Action method

    async getPageHeading(): Promise<string> {
        return await this.pageHeader.textContent() ?? '';
    }

    async navigateToAdmin(): Promise<void> {
        await this.adminLink.click();
    }
}