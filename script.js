let currentInput = '0';
let previousInput = '';
let operation = null;
let resetInput = false;

const display = document.getElementById('display');

const updateDisplay = () => {
    if (currentInput.length > 10) {
        display.textContent = parseFloat(currentInput).toExponential(4);
    } else {
        display.textContent = currentInput;
    }
    display.title = currentInput;
};

const appendNumber = (number) => {
    if (currentInput === '0' || resetInput) {
        currentInput = number;
        resetInput = false;
    } else {
        currentInput = `${currentInput}${number}`;
    }
    updateDisplay();
};

const appendDecimal = () => {
    if (resetInput) {
        currentInput = '0.';
        resetInput = false;
    } else if (!currentInput.includes('.')) {
        currentInput = `${currentInput}.`;
    }
    updateDisplay();
};

const appendOperator = (op) => {
    if (op === '±') {
        currentInput = `${parseFloat(currentInput) * -1}`;
        updateDisplay();
        return;
    }
    
    if (op === '%') {
        currentInput = `${parseFloat(currentInput) / 100}`;
        updateDisplay();
        return;
    }
    
    if (operation !== null) calculate();
    previousInput = currentInput;
    operation = op;
    resetInput = true;
    
    display.textContent = `${previousInput} ${operation}`;
};

const calculate = () => {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                display.classList.add('error');
                updateDisplay();
                resetInput = true;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = `${result}`;
    operation = null;
    resetInput = true;
    display.classList.remove('error');
    updateDisplay();
};

const clearDisplay = () => {
    currentInput = '0';
    previousInput = '';
    operation = null;
    display.classList.remove('error');
    updateDisplay();
};

document.addEventListener('keydown', (e) => {
    if (/[0-9]/.test(e.key)) {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendDecimal();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        appendOperator(e.key);
    } else if (e.key === '%') {
        appendOperator('%');
    }
});

updateDisplay();