import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

document.getElementById('run-btn').addEventListener('click', () => {
  const result = document.getElementById('result');
  result.className = 'result-box';
  result.innerHTML = '';

  // Trusted Types is active on this page (see CSP meta tag).
  // Lit's internal 'lit-html' policy (createHTML: s => s) allows this to succeed.
  const payload = `<img src=x onerror="alert('TT bypass!')"> Trusted Types bypassed via lit-html policy!`;

  try {
    render(
      html`<div>${unsafeHTML(payload)}</div>`,
      result
    );
    result.classList.add('error');
    result.insertAdjacentHTML('afterbegin',
      '<strong>⚠ XSS executed despite Trusted Types!</strong><br>' +
      "Lit's internal <code>createHTML: (s) =&gt; s</code> policy blessed the raw string.<br><br>");
  } catch (e) {
    result.classList.add('error');
    result.textContent = `Error: ${e.message}`;
  }
});
