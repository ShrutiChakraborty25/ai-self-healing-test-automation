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