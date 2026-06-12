const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

function appendValue(value) {
  const current = display.value;

  if (current === '0' && value !== '.' && !['+', '-', '*', '/', '%'].includes(value)) {
    display.value = value;
    return;
  }

  if (value === '%' && current !== '0') {
    const sanitized = current.replace(/[^\d.+\-*/%]/g, '');
    display.value = sanitized + value;
    return;
  }

  if (value === '.' && /\d+\.\d*$/.test(current)) {
    return;
  }

  display.value += value;
}

function clearDisplay() {
  display.value = '0';
}

function deleteLast() {
  display.value = display.value.length <= 1 ? '0' : display.value.slice(0, -1);
}

function evaluateExpression() {
  try {
    const expression = display.value.replace(/%/g, '/100');
    const result = Function(`"use strict"; return (${expression})`)();

    if (!Number.isFinite(result)) {
      display.value = 'Error';
      return;
    }

    display.value = String(result);
  } catch (error) {
    display.value = 'Error';
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'clear') {
      clearDisplay();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'equals') {
      evaluateExpression();
      return;
    }

    appendValue(value);
  });
});

window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9%+\-*/.=]$/.test(key)) {
    if (key === '=') {
      evaluateExpression();
      return;
    }

    if (key === 'Backspace') {
      deleteLast();
      return;
    }

    appendValue(key);
  }

  if (key === 'Escape') {
    clearDisplay();
  }
});
