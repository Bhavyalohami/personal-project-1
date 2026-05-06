const subroles = JSON.stringify([
  { roleId: "1", subroles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { roleId: "3", subroles: [1, 2, 3, 4, 7, 8, 10] },
  { roleId: "4", subroles: [1, 2, 3, 4, 5, 7, 11] },
  { roleId: "5", subroles: [1, 2, 3, 4, 7] },
  { roleId: "13", subroles: [1, 2, 3, 4, 7, 9] },
  { roleId: "19", subroles: [1, 2, 3, 4, 7] },
]);

const cookie = (name, value) => ({
  name,
  value: String(value),
  domain: "localhost",
  path: "/",
  sameSite: "Lax",
});

const roleCookies = {
  admin: [
    cookie("token", "demo-token-admin"),
    cookie("username", "admin"),
    cookie("uid", "demo-admin"),
    cookie("roles", JSON.stringify(["admin"])),
    cookie("is_superuser", "true"),
    cookie("is_staff", "true"),
    cookie("is_vendor", "false"),
    cookie("status", "200"),
    cookie("subroles", subroles),
  ],
  vendor: [
    cookie("token", "demo-token-vendor"),
    cookie("username", "vendor"),
    cookie("uid", "demo-vendor"),
    cookie("roles", JSON.stringify(["vendor"])),
    cookie("is_superuser", "false"),
    cookie("is_staff", "false"),
    cookie("is_vendor", "true"),
    cookie("status", "200"),
    cookie("subroles", subroles),
  ],
  doctor: [
    cookie("token", "demo-token-doctor"),
    cookie("username", "doctor"),
    cookie("uid", "demo-doctor"),
    cookie("roles", JSON.stringify(["doctor", "staff"])),
    cookie("is_superuser", "false"),
    cookie("is_staff", "true"),
    cookie("is_vendor", "false"),
    cookie("status", "200"),
    cookie("subroles", subroles),
  ],
  patient: [
    cookie("patient_token", "demo-token-patient"),
    cookie("patient_username", "demo.patient"),
    cookie("patient_uid", "demo-patient"),
  ],
};

async function signInAs(context, role) {
  await context.clearCookies();
  await context.addCookies(roleCookies[role] || []);
}

async function expectHealthyPage(page) {
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(300);

  const health = await page.evaluate(() => ({
    overlay: [...document.querySelectorAll("body *")].some((element) =>
      /Uncaught runtime errors|Compiled with problems/.test(element.textContent || ""),
    ),
    brokenImages: [...document.images].filter(
      (image) => image.complete && image.naturalWidth === 0,
    ).length,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 8,
  }));

  return health;
}

module.exports = { expectHealthyPage, signInAs };
