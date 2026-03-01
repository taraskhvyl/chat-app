import { test, expect } from "@playwright/test";

test.describe("Chat", () => {
  test("loads chat page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("log")).toBeVisible({ timeout: 10000 });
  });

  test("can send a message", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("log")).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder("Message").fill("Hello from E2E");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Hello from E2E")).toBeVisible({
      timeout: 5000,
    });
  });
});
