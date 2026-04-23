import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import DOMPurify from 'dompurify';
import {setupDemoArea} from './demo-utils.js';

const {result, showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  result.className = 'result-box';
  result.textContent = '';

  const userInput = `<img src=x onerror="alert('XSS!')"> Hello!`;

  let trustedHtml;
  try {
    trustedHtml = DOMPurify.sanitize(userInput, {RETURN_TRUSTED_TYPE: true});
    const info = document.createElement('p');
    info.style.cssText = 'margin:0 0 0.75rem;font-size:0.8rem;color:#546e7a';
    info.textContent = `DOMPurify returned TrustedHTML: ${window.trustedTypes?.isHTML(trustedHtml)}. Now passing to unsafeHTML()...`;
    result.appendChild(info);
  } catch (e) {
    result.classList.add('error');
    result.textContent = `DOMPurify error: ${e.message}`;
    showReset();
    return;
  }

  const litTarget = document.createElement('div');
  result.appendChild(litTarget);

  try {
    render(html`<div>${unsafeHTML(trustedHtml)}</div>`, litTarget);
  } catch (e) {
    result.classList.add('error');
    const heading = document.createElement('strong');
    heading.textContent = 'Error thrown by unsafeHTML():';
    const br = document.createElement('br');
    const code = document.createElement('code');
    code.textContent = e.message;
    result.append(heading, br, code);
  }
  showReset();
});
