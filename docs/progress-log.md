# Project Progress Log

Tracks daily progress for the M.Tech project:
"AI-Powered Self-Healing Test Automation using Playwright and Local LLMs"

This log will be used later to write the final project report.

---
## 📆 Week 1 Summary (Days 1–7)

**Goal for the week:** Set up environment, GitHub repo, Playwright basics,
and prototype self-healing logic manually (no AI yet).

**Achieved:**
- Full dev environment set up (Node.js, Git, VS Code, GitHub)
- Clean GitHub repository with proper structure (src/, tests/, docs/, reports/)
- Playwright installed and configured; wrote first custom tests
- Deeply studied Playwright's TimeoutError and locator failure behavior
- Built src/locatorHealer.js -- a reusable, action-agnostic self-healing
  helper function (currently uses a hardcoded fallback locator)
- Documented system design in docs/architecture.md

**Key engineering concepts learned:**
async/await, locators, try/catch, module.exports/require, DRY principle,
default function parameters, npm scripts

**Known gap going into Week 2:**
Fallback locators are currently hardcoded by the test author. Week 2 begins
integrating a local LLM (Ollama + Llama3) so the fallback can be generated
dynamically instead.

---
## Day 1 — [30/08/2026]
- Installed Node.js, Git, VS Code
- Created GitHub account

## Day 2 — [31/08/2026]
- Configured Git identity
- Created GitHub repository (public, MIT license, Node .gitignore)
- Created folder structure: src/, tests/, docs/, reports/
- Wrote README.md
- First commit and push

## Day 3 — [01/09/2026]
- Installed Playwright via `npm init playwright@latest`
- Chose JavaScript, reused existing tests/ folder, installed browsers
- Explored package.json, playwright.config.js, example test
- Ran sample tests successfully across Chromium, Firefox, WebKit
- Verified .gitignore excludes node_modules and report folders

## Day 4 — [02/09/2026]
- Learned anatomy of a Playwright test file (test, expect, async/await, page, locators)
- Wrote first custom test file: tests/first-test.spec.js
  - Test 1: verifies homepage title loads correctly
  - Test 2: fills login form using locators, submits, asserts success message
- Ran tests in headed mode to visually confirm browser interactions
- Removed auto-generated boilerplate (example.spec.js, tests-examples/)
- Target practice site chosen: https://the-internet.herokuapp.com
  (will reuse this site later to simulate broken locators for self-healing feature)

  ## Day 5 — [03/09/2026]
- Created tests/broken-locator.spec.js to deliberately trigger a locator failure
- Studied Playwright's TimeoutError structure: error type, message, default 30s retry behavior
- Learned try/catch in JavaScript to handle errors in our own code
- Created tests/catch-failure-demo.spec.js: caught a locator failure manually,
  logged error.name and error.message, used custom timeout (5000ms) to fail fast
- Created tests/manual-self-heal-demo.spec.js: first working prototype of
  self-healing logic -- try primary locator, catch failure, attempt hardcoded
  fallback locator, continue test successfully
- Key insight: this manual fallback will later be replaced by a local LLM
  that generates the fallback locator dynamically instead of being hardcoded

  ## Day 6 — [04/09/2026]
- Learned the DRY principle and why reusable logic belongs in src/, not tests/
- Created src/locatorHealer.js -- first real framework module
  - healLocator(page, primarySelector, fallbackSelector, timeout) function
  - Uses page.locator().waitFor({ state: 'attached' }) to check existence
    without deciding what action to perform (action-agnostic design)
  - Learned module.exports and require() for sharing code between files
  - Learned relative paths (../) for importing across folders
- Created tests/self-heal-with-helper.spec.js using the new helper
  - Demonstrates both paths: primary locator failing (fallback triggered)
    and primary locator succeeding (no fallback needed)
- Annotated manual-self-heal-demo.spec.js as superseded, kept for learning history

## Day 7 — [05/09/2026]
- Ran full test suite together (not just individual files) -- confirmed
  4 passed, 1 failed (broken-locator.spec.js fails on purpose, as expected)
- Reviewed full project file structure end-to-end
- Removed unnecessary .gitkeep files from src/ and tests/ (folders now have real content)
- Added npm scripts (test:chromium, test:headed, report) to package.json
- Created docs/architecture.md -- first architecture document, including
  current data flow diagram and known limitations going into Week 2
- Consolidated Week 1 summary at top of this progress log