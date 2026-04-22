document.getElementById('run-btn').addEventListener('click', () => {
  const result = document.getElementById('result');
  result.className = 'result-box';
  result.innerHTML = '';

  const userInput = `<img src=x onerror="alert('XSS!')"><p>Hello from setHTML()!</p>`;

  if ('setHTML' in Element.prototype) {
    // setHTML() is a safe sink — the browser sanitizes before insertion.
    // No TrustedHTML needed; no alert fires.
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
});
