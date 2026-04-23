import {html, render} from 'lit-html';
import {unsafeHtmlTT} from 'lit-html/directives/unsafe-html-tt.js';
import DOMPurify from 'dompurify';
import {setupDemoArea} from './demo-utils.js';

const {showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;
  const trustedHtml = DOMPurify.sanitize(userInput, {RETURN_TRUSTED_TYPE: true});
  const result = document.getElementById('result');
  result.textContent = '';
  const litTarget = document.createElement('div');
  result.appendChild(litTarget);
  render(html`<div>${unsafeHtmlTT(trustedHtml)}</div>`, litTarget);
  showReset();
});
