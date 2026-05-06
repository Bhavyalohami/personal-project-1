const { expect, test } = require("@playwright/test");
const { expectHealthyPage, signInAs } = require("./helpers/auth");

const loginRoutes = [
  ["/user/login", "Patient Login", "demo.patient"],
  ["/admin/login", "Admin Login", "admin"],
  ["/doctor/login", "Doctor Login", "doctor"],
  ["/vendor/login", "Vendor Login", "vendor"],
];

test.describe("login pages", () => {
  for (const [route, heading, username] of loginRoutes) {
    test(`${heading} supports demo login`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', "Demo123!");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).not.toHaveURL(new RegExp(`${route}$`));
      await expect(await expectHealthyPage(page)).toMatchObject({
        overlay: false,
        brokenImages: 0,
        horizontalOverflow: false,
      });
    });
  }
});

test.describe("role guards", () => {
  test("redirects unauthenticated role panels to the matching login page", async ({ page, context }) => {
    await context.clearCookies();

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto("/vendor");
    await expect(page).toHaveURL(/\/vendor\/login/);

    await page.goto("/doctor");
    await expect(page).toHaveURL(/\/doctor\/login/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/user\/login/);
  });

  test("keeps doctor accounts out of the admin panel", async ({ page, context }) => {
    await signInAs(context, "doctor");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/doctor$/);
  });
});
