const { readHistory } = require('../src/executionHistory');

function toPercentage(part, whole) {
  if (whole === 0) return '0.0';
  return ((part / whole) * 100).toFixed(1);
}

function summarize() {
  const history = readHistory();

  if (history.length === 0) {
    console.log('No execution history found yet. Run some tests first.');
    return;
  }

  const totalAttempts = history.length;
  const primaryOkCount = history.filter((entry) => entry.status === 'primary_ok').length;
  const healedByAiCount = history.filter((entry) => entry.status === 'healed_by_ai').length;
  const healingFailedCount = history.filter((entry) => entry.status === 'healing_failed').length;

  const healingAttempted = healedByAiCount + healingFailedCount;

  console.log('=== Execution History Summary ===');
  console.log(`Total locator attempts logged: ${totalAttempts}`);
  console.log(`  Primary locator worked directly : ${primaryOkCount}  (${toPercentage(primaryOkCount, totalAttempts)}%)`);
  console.log(`  Healed successfully by AI       : ${healedByAiCount}  (${toPercentage(healedByAiCount, totalAttempts)}%)`);
  console.log(`  Healing failed (AI also wrong)  : ${healingFailedCount}  (${toPercentage(healingFailedCount, totalAttempts)}%)`);

  console.log('');
  console.log(`AI success rate (when healing was actually needed): ${toPercentage(healedByAiCount, healingAttempted)}%`);
  console.log(`  (based on ${healingAttempted} case(s) where the primary locator failed)`);

  console.log('');
  console.log('=== Selectors That Needed Healing ===');
  const healingCases = history.filter((entry) => entry.status !== 'primary_ok');
  if (healingCases.length === 0) {
    console.log('  None -- every primary locator worked directly.');
  } else {
    const counts = {};
    for (const entry of healingCases) {
      counts[entry.primarySelector] = (counts[entry.primarySelector] || 0) + 1;
    }
    for (const [selector, count] of Object.entries(counts)) {
      console.log(`  ${selector}  ->  failed ${count} time(s)`);
    }
  }
}

summarize();