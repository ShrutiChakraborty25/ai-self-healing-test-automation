const { test, expect } = require('@playwright/test');

test('homepage loads with correct title', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await expect(page).toHaveTitle('The Internet');
});