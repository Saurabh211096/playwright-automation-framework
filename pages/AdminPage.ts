import { type Page, type Locator } from "@playwright/test";

export class AdminPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators

    public get mainHeader(): Locator {
        return this.page.getByRole('heading', {name: 'User Management'});
    }

    // Action method
    async getPageHeading(): Promise<string> {
        return await this.mainHeader.textContent() ?? '';
    }
}