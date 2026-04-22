import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

document.getElementById('run-btn').addEventListener('click', () => {
  const result = document.getElementById('result');
  result.className = 'result-box';
  // Use textContent to clear — innerHTML assignment is blocked by Trusted Types
  result.textContent = '';

  // Trusted Types is active on this page (see CSP meta tag).
  // Lit's internal 'lit-html' policy (createHTML: s => s) allows this to succeed.
  const payload = `<img src=x onerror="alert('TT bypass!')"> Trusted Types bypassed via lit-html policy!`;

  try {
    render(
      html`<div>${unsafeHTML(payload)}</div>`,
      result
    );
    result.classList.add('error');
    // Build warning message with DOM APIs (no innerHTML — TT would block it)
    const warning = document.createElement('strong');
    warning.textContent = '⚠ XSS executed despite Trusted Types!';
    const br = document.createElement('br');
    const detail = document.createElement('span');
    detail.textContent = "Lit's internal createHTML: (s) => s policy blessed the raw string.";
    result.prepend(detail, br, warning);
  } catch (e) {
    result.classList.add('error');
    result.textContent = `Error: ${e.message}`;
  }
});
