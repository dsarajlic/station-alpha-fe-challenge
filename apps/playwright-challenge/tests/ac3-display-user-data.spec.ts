import { test, expect } from '@playwright/test';

test('AC3: Verify user data and links in website point to correct URL', async ({ page }) => {

    await page.route('https://jsonplaceholder.typicode.com/users', async (route) => {
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
    // Check if user table is visible
    await expect(page.locator('[data-testid="name-1"]')).toHaveText("John Doe");
    await expect(page.locator('[data-testid="username-1"]')).toHaveText("johndoe");
    await expect(page.locator('[data-testid="email-1"]')).toHaveText("john@example.com");
    await expect(page.locator('[data-testid="city-1"]')).toHaveText("New York");
    await expect(page.locator('[data-testid="phone-1"]')).toHaveText("555-123-4567");
    await expect(page.locator('[data-testid="website-1"]')).toHaveText("johndoe.com");
    await expect(page.locator('[data-testid="company-1"]')).toHaveText("ABC Corp");
    // After many variations of checking link value, this works
    await expect(page.locator('[data-testid="website-1"] a')).toHaveAttribute(
        "href",
        "https://johndoe.com"
    );
});

// Edge case: what if data is missing or malformed?
test('AC3: Verify application behavior with missing user data', async ({ page }) => {

    await page.route('https://jsonplaceholder.typicode.com/users', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    id: 1,
                    name: "",
                    username: "",
                    email: "invalid-email",
                    address: {
                        street: "",
                        suite: "",
                        city: "",
                        zipcode: ""
                    },
                    phone: "",
                    website: "not-a-url",
                    company: null
                }
            ])
        });
    });

    await page.goto('http://localhost:3677');

    // Username field - check for fallback behavior
    await expect(page.locator('[data-testid="username-1"]')).toHaveText("");

    // Invalid email - check if app validates or displays as-is
    await expect(page.locator('[data-testid="email-1"]')).toHaveText("invalid-email");
    await expect(page.locator('[data-testid="city-1"]')).toHaveText("");
    await expect(page.locator('[data-testid="phone-1"]')).toHaveText("");

    // Invalid website URL - check if it's still rendered or shows error
    await expect(page.locator('[data-testid="website-1"]')).toHaveText("not-a-url");

    // Website link behavior with invalid URL
    const websiteLink = page.locator('[data-testid="website-1"] a');
    if (await websiteLink.count() > 0) {
        // If link exists, check href attribute
        await expect(websiteLink).toHaveAttribute("href", "https://not-a-url");
    } else {
        // If no link, just text should be displayed
        await expect(page.locator('[data-testid="website-1"]')).toHaveText("not-a-url");
    }

    // Should show no-company icon
    await expect(page.locator('[data-testid="no-company-icon"]')).toBeVisible()
});