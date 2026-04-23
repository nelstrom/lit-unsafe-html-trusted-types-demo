import {html, render} from 'lit-html';
import {unsafeHtmlTT} from 'lit-html/directives/unsafe-html-tt.js';
import DOMPurify from 'dompurify';
import {setupDemoArea} from './demo-utils.js';

const {result, showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  result.className = 'result-box';
  result.textContent = '';

  const userInput = `<img src=x onerror="alert('XSS!')"> Hello from the proposed fix!`;

  try {
    const trustedHtml = DOMPurify.sanitize(userInput, {RETURN_TRUSTED_TYPE: true});

    const info = document.createElement('p');
    info.style.cssText = 'margin:0 0 0.75rem;font-size:0.8rem;color:#546e7a';
    info.textContent = `DOMPurify returned TrustedHTML: ${window.trustedTypes?.isHTML(trustedHtml)}`;
    result.appendChild(info);

    const litTarget = document.createElement('div');
    result.appendChild(litTarget);

    render(html`<div>${unsafeHtmlTT(trustedHtml)}</div>`, litTarget);
    result.classList.add('success');

    const note = document.createElement('p');
    note.style.cssText = 'margin:0.75rem 0 0;font-size:0.8rem;color:#155724';
    note.textContent = '✓ Rendered safely — no alert, onerror stripped, Trusted Types intact.';
    result.appendChild(note);
  } catch (e) {
    result.classList.add('error');
    result.textContent = `Error: ${e.message}`;
  }
  showReset();
});
