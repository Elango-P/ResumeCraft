import { expect, test } from "@playwright/test";

test("creates a resume and opens the print export flow", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Create a job-winning resume in minutes." }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Create My Resume" }).first().click();
  await expect(page).toHaveURL(/\/builder/);
  await expect(page.getByTestId("resume-preview")).toBeVisible({ timeout: 20_000 });

  const nameField = page.getByLabel("Full name");
  await nameField.fill("Priya Sharma");
  await expect(page.getByTestId("resume-preview").getByText("Priya Sharma")).toBeVisible();

  await page.evaluate(() => {
    Object.defineProperty(window, "__printCalled", {
      value: false,
      writable: true,
    });
    window.print = () => {
      window.__printCalled = true;
    };
  });

  await page.getByRole("button", { name: "Download PDF" }).first().click();
  expect(await page.evaluate(() => window.__printCalled)).toBe(true);
});

declare global {
  interface Window {
    __printCalled: boolean;
  }
}
