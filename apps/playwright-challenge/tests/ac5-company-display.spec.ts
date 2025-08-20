import { expect, test } from "@playwright/test";

test('AC5: Verify company information is displayed correctly', async ({ page }) => {
    await page.route('https://jsonplaceholder.typicode.com/users', async (route) => {

        // Simulate slow network, had to add this to see the loading-spinner
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
                },
                {
                    id: 2,
                    name: "Jane Smith",
                    username: "janesmith",
                    email: "jane@example.com",
                    address: {
                        street: "Second St",
                        suite: "Apt 456",
                        city: "Los Angeles",
                        zipcode: "90001",
                        geo: {
                            lat: "34.0522",
                            lng: "-118.2437"
                        }
                    },
                    phone: "555-987-6543",
                    website: "janesmith.com",
                    company: null
                }
            ])
        });
    });

    await page.goto('http://localhost:3677');

    await expect(page.locator('[data-testid="company-1"]')).toHaveText("ABC Corp");

    await expect(page.locator('[data-testid="company-2"] [data-testid="no-company-icon"]')).toBeVisible();
});