import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {setupDemoArea} from './demo-utils.js';

const {showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;
  const target = document.getElementById('result');
  target.textContent = '';
  render(html`<div>${unsafeHTML(userInput)}</div>`, target);
  showReset();
});
