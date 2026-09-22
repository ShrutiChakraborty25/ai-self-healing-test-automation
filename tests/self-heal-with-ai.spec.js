const { test, expect } = require('@playwright/test');
const { healLocatorWithAI } = require('../src/locatorHealer');

test('self-heal login using local LLM suggestion', async ({ page }) => {
  test.setTimeout(60000); // AI calls take longer than normal actions -- give this test extra time

  await page.goto('https://the-internet.herokuapp.com/login');

  // Intentionally wrong on purpose -- this forces the AI healing path to trigger
  const usernameField = await healLocatorWithAI(page, '#user-name');
  await usernameField.fill('tomsmith');

  const passwordField = await healLocatorWithAI(page, '#password');
  await passwordField.fill('SuperSecretPassword!');

  const loginButton = await healLocatorWithAI(page, 'button[type="submit"]');
  await loginButton.click();

  await expect(page.locator('#flash')).toContainText('You logged into a secure area');
});