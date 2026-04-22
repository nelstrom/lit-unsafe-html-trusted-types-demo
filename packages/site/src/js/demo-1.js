import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

document.getElementById('run-btn').addEventListener('click', () => {
  const result = document.getElementById('result');
  result.className = 'result-box';
  result.innerHTML = '';

  const userInput = `<img src=x onerror="alert('XSS!')"> Hello!`;

  try {
    render(
      html`<div>${unsafeHTML(userInput)}</div>`,
      result
    );
    result.classList.add('error');
    result.insertAdjacentHTML('afterbegin',
      '<strong>⚠ XSS executed!</strong> Check for an alert dialog. The img tag with onerror was inserted as live HTML.<br><br>');
  } catch (e) {
    result.classList.add('error');
    result.textContent = `Error: ${e.message}`;
  }
});
