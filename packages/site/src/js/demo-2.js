import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import DOMPurify from 'dompurify';
import {setupDemoArea} from './demo-utils.js';

const {result, showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  result.className = 'result-box';
  result.textContent = '';

  const userInput = `<img src=x onerror="alert('XSS!')"> Hello!`;
  const sanitized = DOMPurify.sanitize(userInput);

  const note = document.createElement('p');
  note.style.cssText = 'margin:0 0 0.5rem;font-size:0.8rem;color:#546e7a';
  note.textContent = `DOMPurify output: ${sanitized}`;
  result.appendChild(note);

  const litTarget = document.createElement('div');
  result.appendChild(litTarget);

  try {
    render(html`<div>${unsafeHTML(sanitized)}</div>`, litTarget);
    result.classList.add('success');
  } catch (e) {
    result.classList.add('error');
    result.textContent = `Error: ${e.message}`;
  }
  showReset();
});
