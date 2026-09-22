/**
 * Sends a request to a locally running Ollama instance, asking it to
 * suggest an alternate CSS locator for an element whose original locator
 * failed, using real HTML from the page as context.
 *
 * @param {string} brokenSelector - the locator that failed (e.g. "#user-name")
 * @param {string} htmlSnippet - relevant HTML from the page, for context
 * @returns {Promise<string>} the model's raw suggested locator text
 */
async function suggestLocator(brokenSelector, htmlSnippet) {
  const prompt = `
The following CSS locator could not be found on a webpage: ${brokenSelector}

Here is the relevant HTML from that page:
${htmlSnippet}

Suggest ONE alternate CSS locator that correctly matches the intended element
in this HTML. The locator MUST be different from "${brokenSelector}".
Respond with ONLY the CSS locator itself, on a single line. No explanation.
`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: prompt,
      stream: false,
    }),
  });

  

  const data = await response.json();
   return cleanLocatorResponse(data.response);
}

/**
 * Cleans up raw LLM output, since models sometimes wrap answers in
 * backticks/quotes or add extra lines of explanation despite instructions.
 *
 * @param {string} rawText - the raw "response" field from Ollama
 * @returns {string} a cleaned, single-line locator string
 */
function cleanLocatorResponse(rawText) {
  return rawText
    .trim()
    .split('\n')[0]         // keep only the first line, in case extra text follows
    .replace(/`/g, '')       // remove backticks
    .replace(/^"|"$/g, '')   // remove leading/trailing double quotes
    .trim();
}

module.exports = { suggestLocator, cleanLocatorResponse };

