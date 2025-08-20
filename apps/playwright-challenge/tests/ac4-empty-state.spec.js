import { expect, test } from "@playwright/test";

test("AC4: Check empty state is displayed", async ({ page }) => {
    await page.route("https://jsonplaceholder.typicode.com/users", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([]),
        });
    });

    await page.goto("http://localhost:3677");

    await expect(page.locator('[data-testid="no-users"]')).toHaveText("No users found.");
});