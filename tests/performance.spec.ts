import { test, expect, chromium } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Performance Metrics Tests', () => {

    test('Login page should load within acceptable time', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo();
        await expect(loginPage.loginButton).toBeVisible({ timeout: 15000 });

        // Technique 1: Navigation Timing via window.performance
        const performanceData = await page.evaluate(() => {
            const timing = performance.getEntriesByType('navigation')[0] as 
            PerformanceNavigationTiming;
            return {
                // Total page load time (from start to fully loaded)
                pageLoadTime: timing.loadEventEnd - timing.startTime,
                // DOM parsing time (HTML parsed, before images/CSS)
                domContentLoaded: timing.domContentLoadedEventEnd - timing.startTime,
                // Server response time (how fast the server replied)
                serverResponseTime: timing.responseEnd - timing.requestStart,
            };
        });

        console.log('=== PERFORMANCE METRICS ===');
        console.log(`Page Load Time: ${performanceData.pageLoadTime.toFixed(0)} ms`);
        console.log(`DOM Content Loaded: ${performanceData.domContentLoaded.toFixed(0)} ms`);
        console.log(`Server Response: ${performanceData.serverResponseTime.toFixed(0)} ms`);

        // Assert: Page should load within 10 seconds (generous for demo site)
        expect(performanceData.pageLoadTime).toBeLessThan(10000);
        expect(performanceData.serverResponseTime).toBeLessThan(5000);

    });

    test('Dashboard should not have excessive memory usage', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Login first
        await loginPage.navigateTo();
        await loginPage.login('Admin', 'admin123');
        await expect(page).toHaveURL(/dashboard/i);

        // Technique 2: Memory Metrics via CDP Session
        const cdpSession = await page.context().newCDPSession(page);
        const metrics = await cdpSession.send('Performance.getMetrics');

        // Extract JS Heap Size from the metrics array
        const jsHeapSize = metrics.metrics.find(
            (m: { name: string }) => m.name === 'JSHeapUsedSize'
        );
        
        const heapInMB = jsHeapSize ? (jsHeapSize.value / (1024 * 1024)).toFixed(2) : 'N/A';
        console.log('=== MEMORY METRICS ===');
        console.log(`JS Heap Used: ${heapInMB} MB`);

        // Assert JS heap should be under 50 MB (reasonable for a web app)
        if (jsHeapSize) {
            const heapMB = jsHeapSize.value / (1024 * 1024);
            expect(heapMB).toBeLessThan(50);
        }
    });

});