const { test, expect } = require('@playwright/test');
const { healLocator } = require('../src/locatorHealer');

test('self-heal login using reusable helper function', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  // Intentionally wrong primary locator -- forces the helper to fall back
  const usernameField = await healLocator(page, '#user-name', '#username');
  await usernameField.fill('tomsmith');

  // Correct primary locator -- helper should succeed immediately, no fallback needed
  const passwordField = await healLocator(page, '#password', '#password');
  await passwordField.fill('SuperSecretPassword!');

  const loginButton = await healLocator(page, 'button[type="submit"]', 'button[type="submit"]');
  await loginButton.click();

  await expect(page.locator('#flash')).toContainText('You logged into a secure area');
});