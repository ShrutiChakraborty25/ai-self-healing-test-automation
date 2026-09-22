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

## Day 8 — [06/09/2026]
- Installed Ollama (local LLM runtime) on macOS
- Learned why Ollama runs as a background service exposing a REST API
  at localhost:11434
- Chose llama3.2 (3B) over Llama 3 (8B) for speed, while staying within
  the Llama 3 model family (documented reasoning in docs/llm-setup-notes.md)
- Pulled and verified the model (ollama pull, ollama list)
- Tested interactive chat (ollama run) with locator-suggestion style prompts
- Tested Ollama's REST API directly via curl -- confirmed programmatic
  access works, which is what src/llmClient.js will use in Week 3
- Created docs/llm-setup-notes.md documenting the full setup and reasoning

## Day 9 — [07/09/2026]
- Diagnosed why Day 8's prompt failed (no real HTML context, no explicit
  instruction against repeating the broken locator)
- Learned Node.js's built-in fetch() API for sending HTTP requests from code
- Created src/llmClient.js:
  - suggestLocator(brokenSelector, htmlSnippet) -- sends a prompt + real
    HTML context to Ollama, returns a cleaned locator suggestion
  - cleanLocatorResponse(rawText) -- strips backticks/quotes/extra lines
    from the model's raw output
- Created scripts/ folder (new top-level structure) for standalone dev/debug
  scripts, separate from src/ (framework) and tests/ (Playwright test cases)
- Created scripts/test-llm-client.js -- verified llmClient.js works correctly
  in isolation, before any Playwright integration
- Confirmed improved prompt produces a genuinely useful suggestion (#username)
  instead of yesterday's unhelpful repeat

  ## Day 10 — [08/09/2026]
- Identified the missing piece: HTML context must come from the LIVE page,
  not be typed manually
- Added getPageHtmlContext(page) to src/locatorHealer.js -- extracts nearest
  <form> HTML (or full <body> as fallback) to keep LLM prompts focused and fast
- Added healLocatorWithAI(page, primarySelector, timeout) -- full self-healing
  loop: try primary -> on failure, extract real HTML -> ask local LLM ->
  validate suggestion actually exists on page -> return working locator
- Created tests/self-heal-with-ai.spec.js -- first REAL end-to-end test:
  broken locator healed automatically by local LLM, login completes successfully
- Added nested try/catch for the case where the AI's suggestion is ALSO
  invalid -- throws a clear custom error instead of a confusing raw TimeoutError
- MILESTONE: full self-healing loop (Playwright + local LLM) working end-to-end
  for the first time