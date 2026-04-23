/**
 * Shared demo area setup: inserts a Reset button after the Run button
 * and returns helpers for each demo script to use.
 */
export function setupDemoArea() {
  const runBtn = document.getElementById('run-btn');
  const result = document.getElementById('result');

  // Insert Reset button next to Run — done via DOM to avoid innerHTML (TT safe)
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.className = 'reset-btn';
  resetBtn.style.display = 'none';
  runBtn.insertAdjacentElement('afterend', resetBtn);

  resetBtn.addEventListener('click', () => {
    result.textContent = '';
    resetBtn.style.display = 'none';
  });

  return {
    result,
    showReset() {
      resetBtn.style.display = '';
    },
  };
}
