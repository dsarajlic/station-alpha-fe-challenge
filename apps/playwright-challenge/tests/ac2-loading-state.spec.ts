import { test, expect } from '@playwright/test';

test('AC2: Verify the application displays the user table once loaded', async ({ page }) => {
    await page.route('https://jsonplaceholder.typicode.com/users', async (route) => {

        // Simulate slow network: had to add this to see the loading-spinner, failed intermittently
        await new Promise(resolve => setTimeout(resolve, 1000));

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    id: 1,
                    name: "John Doe",
                    username: "johndoe",
                    email: "john@example.com",
                    address: {
                        street: "Main St",
                        suite: "Apt 123",
                        city: "New York",
                        zipcode: "10001",
                        geo: {
                            lat: "40.7128",
                            lng: "-74.0060"
                        }
                    },
                    phone: "555-123-4567",
                    website: "johndoe.com",
                    company: {
                        name: "ABC Corp",
                        catchPhrase: "Making things happen",
                        bs: "innovative solutions"
                    }
                }
            ])
        });
    });

    await page.goto('http://localhost:3677');
    // Check appearance/disappearance of loading spinner
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeHidden();
    // Check if user table is visible
    await expect(page.locator('table.user-table')).toBeVisible();
    // Confirm data is loaded
    await expect(page.locator('text=John Doe')).toBeVisible();
});