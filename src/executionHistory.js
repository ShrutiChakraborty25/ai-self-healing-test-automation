const fs = require('fs');
const path = require('path');

// __dirname = the folder this file lives in (src/). '..' goes up one level
// to the project root, then into reports/ -- keeping this path correct
// regardless of which folder you run commands from.
const HISTORY_FILE_PATH = path.join(__dirname, '..', 'reports', 'execution-history.json');

/**
 * Reads the current execution history from disk.
 * Returns an empty array if the file doesn't exist yet (e.g. first ever run).
 *
 * @returns {Array<object>} the list of past history entries
 */
function readHistory() {
  if (!fs.existsSync(HISTORY_FILE_PATH)) {
    return [];
  }
  const fileContent = fs.readFileSync(HISTORY_FILE_PATH, 'utf-8');
  if (!fileContent.trim()) {
    return [];
  }
  return JSON.parse(fileContent);
}

/**
 * Appends one new event to the execution history file, adding a timestamp
 * automatically.
 *
 * @param {object} entry - e.g. { primarySelector, status, suggestedSelector }
 */
function appendHistoryEntry(entry) {
  const history = readHistory();
  const fullEntry = { timestamp: new Date().toISOString(), ...entry };
  history.push(fullEntry);
  fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(history, null, 2));
}

module.exports = { appendHistoryEntry, readHistory, HISTORY_FILE_PATH };