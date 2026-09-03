# Architecture Overview

This document describes the design of the self-healing test automation framework,
and evolves as the project grows. Current status: Week 1 (foundation).

## Current Components (as of Week 1)

### 1. Test Layer (`tests/`)
Contains Playwright test specifications. Each test represents a real user
workflow (e.g. login) and calls into the framework layer (`src/`) instead of
containing raw try/catch logic itself.

### 2. Framework Layer (`src/`)
Contains reusable logic shared across all tests.

- **`locatorHealer.js`**
  - Function: `healLocator(page, primarySelector, fallbackSelector, timeout)`
  - Responsibility: given a primary locator, checks if it exists on the page
    within a timeout window. If not found, returns a fallback locator instead.
  - Design principle: this function is *action-agnostic* -- it only resolves
    which locator to use, and does not decide what action (click/fill/etc)
    to perform with it. This keeps it reusable across any kind of interaction.

## Current Data Flow (Week 1 version)

Test file (tests/*.spec.js)
|
| calls healLocator(page, primary, fallback)
v
src/locatorHealer.js
|
| tries primary locator (page.locator(primary).waitFor)
|
+-- SUCCESS --> returns primary locator to test
|
+-- FAILURE --> logs failure --> returns fallback locator to test
|
v
Test continues using
whichever locator was returned


## Known Limitations (to be solved in later weeks)

1. **Fallback locator is hardcoded** by whoever writes the test -- it is not
   generated dynamically. This is the next major gap: integrating a local LLM
   (Ollama + Llama3) to generate the fallback locator automatically by
   analyzing the page's HTML when the primary locator fails.
2. **No execution history** is currently recorded -- healing events are only
   printed to the console (`console.log`), not saved anywhere permanent.
3. **No structured reporting** of healing events yet -- Playwright's default
   HTML report doesn't show which tests self-healed vs ran normally.

## Planned Components (future weeks)

- `src/llmClient.js` -- sends failed locator + page HTML to a local LLM
  (via Ollama) and receives a suggested alternate locator
- `src/executionHistory.js` -- logs every healing event (timestamp, test name,
  primary locator, fallback used, success/failure) to a persistent file
- Custom reporting layer to visualize healing activity per test run