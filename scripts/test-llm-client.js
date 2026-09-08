const { suggestLocator } = require('../src/llmClient');

async function main() {
  const brokenSelector = '#user-name';
  const htmlSnippet = `<input type="text" id="username" name="username" placeholder="Username">`;

  console.log('Broken selector:', brokenSelector);
  console.log('Asking local LLM for a suggestion...\n');

  const suggestion = await suggestLocator(brokenSelector, htmlSnippet);

  console.log('Raw model response:');
  console.log(suggestion);
}

main();