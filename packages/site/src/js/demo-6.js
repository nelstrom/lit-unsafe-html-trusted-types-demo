import {setupDemoArea} from './demo-utils.js';

const {result, showReset} = setupDemoArea();

document.getElementById('run-btn').addEventListener('click', () => {
  result.className = 'result-box';
  result.textContent = '';

  const userInput = `<img src=x onerror="alert('XSS!')"><p>Hello from setHTML()!</p>`;

  if ('setHTML' in Element.prototype) {
    const container = document.createElement('div');
    container.setHTML(userInput);
    result.appendChild(container);
    result.classList.add('success');

    const note = document.createElement('p');
    note.style.cssText = 'margin:0.75rem 0 0;font-size:0.8rem;color:#155724';
    note.textContent = '✓ setHTML() sanitized the input natively — no alert fired.';
    result.appendChild(note);
  } else {
    result.textContent =
      'setHTML() is not available in this browser. ' +
      'It is currently supported in Firefox 148+ and Chrome (with the Sanitizer API flag enabled). ' +
      'In production, a safeHtml directive would fall back to DOMPurify + unsafeHtmlTT.';
  }
  showReset();
});
