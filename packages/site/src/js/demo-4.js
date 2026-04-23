import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import DOMPurify from 'dompurify';
import {setupDemoArea} from './demo-utils.js';

setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;
  const trustedHtml = DOMPurify.sanitize(userInput, {RETURN_TRUSTED_TYPE: true});
  const target = document.getElementById('result');
  target.textContent = '';
  render(html`<div>${unsafeHTML(trustedHtml)}</div>`, target);
});
