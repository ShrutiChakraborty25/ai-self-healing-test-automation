const { test, expect } = require('@playwright/test');

test('manually heal a broken locator using a fallback', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  const primaryLocator = '#user-name';   // wrong, simulates a broken locator
  const fallbackLocator = '#username';   // correct, our "healed" alternative

  try {
    await page.locator(primaryLocator).fill('tomsmith', { timeout: 5000 });
    console.log('Primary locator worked:', primaryLocator);
  } catch (error) {
    console.log('Primary locator failed:', primaryLocator);
    console.log('Attempting fallback locator:', fallbackLocator);
    await page.locator(fallbackLocator).fill('tomsmith');
    console.log('Fallback locator succeeded:', fallbackLocator);
  }

  await page.locator('#password').fill('SuperSecretPassword!');
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('#flash')).toContainText('You logged into a secure area');
});