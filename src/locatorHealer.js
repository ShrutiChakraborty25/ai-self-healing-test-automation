const { appendHistoryEntry } = require('./executionHistory');
const { suggestLocator } = require('./llmClient');

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


/**
 * Extracts relevant HTML context from the page to send to the LLM.
 * Prefers the nearest <form> (most interactive elements live inside one);
 * falls back to the full <body> if no form exists on the page.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string>} HTML context for the LLM prompt
 */
async function getPageHtmlContext(page) {
  const formCount = await page.locator('form').count();
  if (formCount > 0) {
    console.log('[Healer] Using nearest <form> as HTML context for LLM');
    return page.locator('form').first().innerHTML();
  }
  console.log('[Healer] No <form> found -- using full <body> as HTML context for LLM');
  return page.locator('body').innerHTML();
}

/**
 * Full AI-powered self-healing: tries the primary locator first. If it
 * fails, automatically extracts real page HTML, asks the local LLM for a
 * replacement locator, validates that suggestion actually exists on the
 * page, and returns it.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} primarySelector - the locator we expect to work
 * @param {number} timeout - ms to wait before triggering AI healing (default 5000)
 * @returns {Promise<import('@playwright/test').Locator>}
 */
async function healLocatorWithAI(page, primarySelector, timeout = 5000) {
  const primary = page.locator(primarySelector);

  try {
    await primary.waitFor({ state: 'attached', timeout });
    console.log(`[Healer] Primary locator OK: ${primarySelector}`);
    appendHistoryEntry({ primarySelector, status: 'primary_ok' });
    return primary;
  } catch (error) {
    console.log(`[Healer] Primary locator FAILED: ${primarySelector}`);
    console.log('[Healer] Extracting page HTML and asking local LLM...');

    const htmlContext = await getPageHtmlContext(page);
    const suggested = await suggestLocator(primarySelector, htmlContext);
    console.log(`[Healer] LLM suggested: ${suggested}`);

    const suggestedLocator = page.locator(suggested);

    try {
      await suggestedLocator.waitFor({ state: 'attached', timeout });
      console.log(`[Healer] Confirmed LLM suggestion works: ${suggested}`);
      appendHistoryEntry({
        primarySelector,
        status: 'healed_by_ai',
        suggestedSelector: suggested,
      });
      return suggestedLocator;
    } catch (secondError) {
      appendHistoryEntry({
        primarySelector,
        status: 'healing_failed',
        suggestedSelector: suggested,
      });
      throw new Error(
        `Self-healing failed. Primary locator "${primarySelector}" was not found, ` +
        `and the LLM's suggested locator "${suggested}" was also not found on the page.`
      );
    }
  }
}
module.exports = { healLocator, getPageHtmlContext, healLocatorWithAI };