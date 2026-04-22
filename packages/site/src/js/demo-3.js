import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {setupDemoArea} from './demo-utils.js';

const {result, showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  result.className = 'result-box error';
  result.textContent = '';

  const payload = `<img src=x onerror="alert('TT bypass!')"> Trusted Types bypassed via lit-html policy!`;
  const litTarget = document.createElement('div');
  result.appendChild(litTarget);

  try {
    render(html`<div>${unsafeHTML(payload)}</div>`, litTarget);
    const warning = document.createElement('strong');
    warning.textContent = '⚠ XSS executed despite Trusted Types!';
    const detail = document.createElement('span');
    detail.textContent = " Lit's internal createHTML: (s) => s policy blessed the raw string.";
    result.prepend(warning, detail, document.createElement('br'));
  } catch (e) {
    result.textContent = `Error: ${e.message}`;
  }
  showReset();
});
