# Local LLM Setup Notes

## Tool Used
Ollama (https://ollama.com) — runs LLMs fully locally, no internet or API key
required after initial model download. Exposes a REST API on
`http://localhost:11434`.

## Model Selected
**llama3.2** (3B parameters, ~2GB)

### Why this model instead of the larger Llama 3 (8B)
- Significantly faster response times on a standard laptop (CPU inference)
- Locator suggestion is a narrow, structured task -- doesn't require the
  reasoning capacity of a larger model
- Still part of the official Meta Llama 3 model family
- Can be swapped for a larger model later with a one-line change, since our
  integration code will only reference the model by name

## Installation Steps (macOS)
1. Downloaded installer from ollama.com/download
2. Installed app, runs as a background menu-bar service
3. Verified with `ollama --version`
4. Downloaded model: `ollama pull llama3.2`
5. Verified with `ollama list`

## Verified Working
- Interactive chat: `ollama run llama3.2` -- confirmed coherent responses
  to locator-suggestion style prompts
- REST API: confirmed `curl` request to `http://localhost:11434/api/generate`
  returns a valid JSON response with a `"response"` field containing the
  model's answer

## Key Observation
The model does not always strictly follow "respond with ONLY X" instructions --
sometimes adds explanation text. This will need to be handled in our
integration code (Week 3) via prompt engineering and/or response parsing,
not assumed to be reliable by default.

## Next Step
Build src/llmClient.js -- a Node.js module that sends this same kind of
request programmatically (instead of via curl) and extracts the locator
suggestion from the response.

## Prompt Engineering Lesson (Day 9)
Our first attempt (Day 8) asked the model for an "alternate locator" without
providing real HTML context, and without explicitly forbidding it from
repeating the original. Result: the model just echoed back the same broken
selector -- unhelpful.

Fix: the improved prompt (Day 9) does two things differently:
1. Includes the actual relevant HTML snippet from the page as context
2. Explicitly states the answer "MUST be different" from the broken selector

This produced a correct suggestion. Lesson: prompt quality and context are
just as important as model choice for this use case.

## Response Cleaning
The model does not always output a perfectly clean locator string -- it may
wrap it in backticks/quotes or add extra lines. src/llmClient.js includes a
cleanLocatorResponse() function to strip this reliably before the locator
is used anywhere else in the framework.