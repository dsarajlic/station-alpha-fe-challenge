import { test, expect } from '@playwright/test';

test('AC6: Verify the application handles API errors correctly', async ({ page }) => {
    await page.route('https://jsonplaceholder.typicode.com/users', async (route) => {
        // Mock API error response
        await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({
                error: 'Not Found',
                message: 'Failed to fetch users'
            })
        });
    });

    await page.goto('http://localhost:3677');

    // Verify modal is visible
    await expect(page.locator('[data-testid="error-modal"]')).toBeVisible();
    // Confirm error message is correct
    await expect(page.locator('[data-testid="error-message"]')).toHaveText('Failed to load users. Please try again later.');
    // Dismiss button is visible
    await expect(page.locator('[data-testid="error-action-button"]')).toBeVisible();
    // Click visible button
    await page.locator('[data-testid="error-action-button"]').click();
    // Confirm button is hidden after click
    await expect(page.locator('[data-testid="error-action-button"]')).toBeHidden();
    // Finally check your on empty state
    await expect(page.locator('[data-testid="no-users"]')).toHaveText("No users found.");
});