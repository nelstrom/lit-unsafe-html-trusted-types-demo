import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {setupDemoArea} from './demo-utils.js';

const {result, showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  result.className = 'result-box error';
  result.textContent = '';

  const userInput = `<img src=x onerror="alert('XSS!')"> Hello!`;
  const litTarget = document.createElement('div');
  result.appendChild(litTarget);

  try {
    render(html`<div>${unsafeHTML(userInput)}</div>`, litTarget);
    const warning = document.createElement('strong');
    warning.textContent = '⚠ XSS executed! Check for an alert dialog.';
    result.prepend(warning, document.createElement('br'));
  } catch (e) {
    result.textContent = `Error: ${e.message}`;
  }
  showReset();
});
