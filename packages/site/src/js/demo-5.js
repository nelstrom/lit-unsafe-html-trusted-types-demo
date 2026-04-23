import {html, render} from 'lit-html';
import {unsafeHtmlTT} from 'lit-html/directives/unsafe-html-tt.js';
import {setupDemoArea} from './demo-utils.js';

const {showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;
  const target = document.getElementById('result');
  target.textContent = '';
  render(html`<div>${unsafeHtmlTT(userInput)}</div>`, target);
  showReset();
});
