import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import DOMPurify from '/js/dompurify.js';

document.getElementById('run-btn').addEventListener('click', () => {
  const result = document.getElementById('result');
  result.className = 'result-box';
  result.innerHTML = '';

  const userInput = `<img src=x onerror="alert('XSS!')"> Hello!`;

  let trustedHtml;
  try {
    trustedHtml = DOMPurify.sanitize(userInput, {RETURN_TRUSTED_TYPE: true});
    const isTrustedHTML = window.trustedTypes?.isHTML(trustedHtml);

    const info = document.createElement('p');
    info.style.cssText = 'margin:0 0 0.75rem;font-size:0.8rem;color:#546e7a';
    info.textContent = `DOMPurify returned TrustedHTML: ${isTrustedHTML}. Now passing to unsafeHTML()...`;
    result.appendChild(info);
  } catch (e) {
    result.classList.add('error');
    result.textContent = `DOMPurify error: ${e.message}`;
    return;
  }

  try {
    render(
      html`<div>${unsafeHTML(trustedHtml)}</div>`,
      result
    );
  } catch (e) {
    result.classList.add('error');
    const msg = document.createElement('p');
    msg.innerHTML = `<strong>Error thrown by unsafeHTML():</strong><br><code>${e.message}</code>`;
    result.appendChild(msg);
  }
});
