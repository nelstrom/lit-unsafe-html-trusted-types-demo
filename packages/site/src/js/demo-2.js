import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import DOMPurify from 'dompurify';
import {setupDemoArea} from './demo-utils.js';

const {showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;
  const sanitized = DOMPurify.sanitize(userInput);
  const result = document.getElementById('result');
  result.textContent = '';
  const litTarget = document.createElement('div');
  result.appendChild(litTarget);
  render(html`<div>${unsafeHTML(sanitized)}</div>`, litTarget);
  showReset();
});
