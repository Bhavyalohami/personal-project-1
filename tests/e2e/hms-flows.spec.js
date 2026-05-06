const { expect, test } = require("@playwright/test");
const { expectHealthyPage, signInAs } = require("./helpers/auth");

test.describe("hospital discovery and HMS flows", () => {
  test("hospital discovery opens a profile with appointment and test-slot CTAs", async ({ page }) => {
    await page.goto("/hospitals");
    await expect(page.getByRole("heading", { name: /Choose care by city/i })).toBeVisible();
    await page.getByRole("link", { name: /View Profile/i }).first().click();
    await expect(page).toHaveURL(/\/hospitals\//);
    await expect(page.getByRole("link", { name: /Book Appointment/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Book Test Slot/i })).toBeVisible();
    await expect(await expectHealthyPage(page)).toMatchObject({
      overlay: false,
      brokenImages: 0,
      horizontalOverflow: false,
    });
  });

  test("test slot booking requires patient login and then accepts demo patient", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/hospitals/default-hospital");
    await page.getByRole("button", { name: /Book Test Slot/i }).click();
    await expect(page).toHaveURL(/\/user\/login/);

    await signInAs(context, "patient");
    await page.goto("/hospitals/default-hospital");
    await page.getByRole("button", { name: /Book Test Slot/i }).click();
    await expect(page.getByRole("heading", { name: /Test slot booked/i })).toBeVisible();
  });

  test("patient can request chat and doctor can accept then close it", async ({ page, context }) => {
    await signInAs(context, "patient");
    await page.goto("/profiledoctor/doctor-nisha-rao");
    await page.getByRole("button", { name: "Request Chat" }).click();
    await page.getByRole("textbox").fill("I need advice after my appointment.");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByRole("heading", { name: "Request sent" })).toBeVisible();
    await page.getByRole("button", { name: /Open messages/i }).click();
    await expect(page).toHaveURL(/\/messages/);

    await signInAs(context, "doctor");
    await page.goto("/doctor/messages");
    await expect(page.getByText("demo.patient").first()).toBeVisible();
    await page.getByRole("button", { name: /Accept/i }).click();
    await expect(page.getByRole("button", { name: /Close/i })).toBeVisible();
    await page.getByRole("button", { name: /Close/i }).click();
    await page.getByRole("button", { name: "Close chat" }).click();
    await expect(page.getByText("closed").first()).toBeVisible();
  });
});
