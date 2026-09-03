/**
 * Attempts to use a primary locator. If it doesn't appear within the given
 * timeout, falls back to an alternate locator instead.
 *
 * @param {import('@playwright/test').Page} page - the Playwright page object
 * @param {string} primarySelector - the locator we expect to work
 * @param {string} fallbackSelector - the alternate locator to try if primary fails
 * @param {number} timeout - how long (ms) to wait before falling back (default 5000)
 * @returns {Promise<import('@playwright/test').Locator>} a working Playwright locator
 */
async function healLocator(page, primarySelector, fallbackSelector, timeout = 5000) {
  const primary = page.locator(primarySelector);

  try {
    // waitFor() checks if the element exists in the page's HTML within `timeout`
    // It throws an error if the element never appears -- same TimeoutError we saw on Day 5
    await primary.waitFor({ state: 'attached', timeout });
    console.log(`[Healer] Primary locator OK: ${primarySelector}`);
    return primary;
  } catch (error) {
    console.log(`[Healer] Primary locator FAILED: ${primarySelector}`);
    console.log(`[Healer] Falling back to: ${fallbackSelector}`);
    return page.locator(fallbackSelector);
  }
}

module.exports = { healLocator };