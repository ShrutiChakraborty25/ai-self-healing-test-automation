# Project Progress Log

Tracks daily progress for the M.Tech project:
"AI-Powered Self-Healing Test Automation using Playwright and Local LLMs"

This log will be used later to write the final project report.

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