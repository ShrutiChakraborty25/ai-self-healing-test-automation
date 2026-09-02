const { test, expect } = require('@playwright/test');

test('login test with a WRONG locator on purpose', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  // Intentionally wrong id -- the real field id is "username", not "user-name"
  await page.locator('#user-name').fill('tomsmith');

  await page.locator('#password').fill('SuperSecretPassword!');
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('#flash')).toContainText('You logged into a secure area');
});