const { expect, test } = require("@playwright/test");
const { expectHealthyPage } = require("./helpers/auth");

test.describe("booking journeys", () => {
  test("preserves hospital context through guest details", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/booking?hospitalId=default-hospital");
    await expect(page).toHaveURL(/\/getdetails\?hospitalId=default-hospital/);

    await page.fill('input[name="name"]', "Journey Tester");
    await page.selectOption('select[name="age"]', "26-35");
    await page.fill('input[name="contact"]', "9876543210");
    await page.fill('input[name="email"]', "journey.tester@example.com");
    await page.fill('input[name="city"]', "Noida");
    await page.selectOption('select[name="gender"]', "Female");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL(/\/booking\?hospitalId=default-hospital/);
    await expect(page.getByRole("heading", { name: /Choose your care path/i })).toBeVisible();
    await expect(await expectHealthyPage(page)).toMatchObject({
      overlay: false,
      brokenImages: 0,
      horizontalOverflow: false,
    });
  });

  test("does not redirect from doctor profile login prompt on outside click", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/profiledoctor/doctor-nisha-rao");
    await page.locator("#book-instantly").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "07 May 2026 appointment date" }).click();
    await page.getByRole("button", { name: "10:00 - 10:30" }).click();
    await page.getByRole("button", { name: "Book Instantly" }).click();

    await expect(page.getByRole("heading", { name: "You need to log in first to book instantly." })).toBeVisible();
    await page.mouse.click(16, 16);
    await expect(page.getByRole("heading", { name: "You need to log in first to book instantly." })).toBeVisible();
    await expect(page).toHaveURL(/\/profiledoctor\/doctor-nisha-rao/);

    await page.getByRole("button", { name: "Stay here" }).click();
    await expect(page.getByRole("heading", { name: "You need to log in first to book instantly." })).toBeHidden();
  });
});
