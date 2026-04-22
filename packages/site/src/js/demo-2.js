import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import DOMPurify from '/js/dompurify.js';

document.getElementById('run-btn').addEventListener('click', () => {
  const result = document.getElementById('result');
  result.className = 'result-box';
  result.innerHTML = '';

  const userInput = `<img src=x onerror="alert('XSS!')"> Hello!`;
  const sanitized = DOMPurify.sanitize(userInput);

  const note = document.createElement('p');
  note.style.cssText = 'margin:0 0 0.5rem;font-size:0.8rem;color:#546e7a';
  note.textContent = `DOMPurify output: ${sanitized}`;
  result.appendChild(note);

  try {
    const container = document.createElement('div');
    render(
      html`<div>${unsafeHTML(sanitized)}</div>`,
      container
    );
    result.appendChild(container);
    result.classList.add('success');
  } catch (e) {
    result.classList.add('error');
    result.textContent = `Error: ${e.message}`;
  }
});
