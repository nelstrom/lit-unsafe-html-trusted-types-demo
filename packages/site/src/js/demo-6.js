import {html, render} from 'lit-html';
import {unsafeHtmlTT} from 'lit-html/directives/unsafe-html-tt.js';
import DOMPurify from 'dompurify';
import {setupDemoArea} from './demo-utils.js';

const {showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;
  const sanitized = DOMPurify.sanitize(userInput);
  const target = document.getElementById('result');
  target.textContent = '';
  render(html`<div>${unsafeHtmlTT(sanitized)}</div>`, target);
  showReset();
});
