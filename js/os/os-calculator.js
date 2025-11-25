// Calculator App
const CalculatorApp = (function() {
  let displayValue = '0';
  let previousValue = null;
  let operation = null;
  let waitingForNewValue = false;
  
  function createCalculatorContent() {
    const container = document.createElement('div');
    container.className = 'calculator-container';
    container.style.cssText = 'height: 100%; display: flex; flex-direction: column; font-family: -apple-system, sans-serif; background: rgba(20, 20, 20, 0.95); padding: 20px;';
    
    // Display
    const display = document.createElement('div');
    display.className = 'calculator-display';
    display.id = 'calc-display';
    display.style.cssText = `
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(0, 255, 225, 0.2);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
      text-align: right;
      font-size: 48px;
      font-weight: 300;
      color: #00ffe1;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      overflow-x: auto;
      font-family: 'SF Mono', 'Monaco', monospace;
    `;
    display.textContent = displayValue;
    
    // Button grid
    const buttonGrid = document.createElement('div');
    buttonGrid.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; flex: 1;';
    
    const buttons = [
      { label: 'C', class: 'calc-btn-function', action: 'clear', colSpan: 1 },
      { label: '±', class: 'calc-btn-function', action: 'toggleSign', colSpan: 1 },
      { label: '%', class: 'calc-btn-function', action: 'percent', colSpan: 1 },
      { label: '÷', class: 'calc-btn-operator', action: 'divide', colSpan: 1 },
      { label: '7', class: 'calc-btn-number', action: '7', colSpan: 1 },
      { label: '8', class: 'calc-btn-number', action: '8', colSpan: 1 },
      { label: '9', class: 'calc-btn-number', action: '9', colSpan: 1 },
      { label: '×', class: 'calc-btn-operator', action: 'multiply', colSpan: 1 },
      { label: '4', class: 'calc-btn-number', action: '4', colSpan: 1 },
      { label: '5', class: 'calc-btn-number', action: '5', colSpan: 1 },
      { label: '6', class: 'calc-btn-number', action: '6', colSpan: 1 },
      { label: '−', class: 'calc-btn-operator', action: 'subtract', colSpan: 1 },
      { label: '1', class: 'calc-btn-number', action: '1', colSpan: 1 },
      { label: '2', class: 'calc-btn-number', action: '2', colSpan: 1 },
      { label: '3', class: 'calc-btn-number', action: '3', colSpan: 1 },
      { label: '+', class: 'calc-btn-operator', action: 'add', colSpan: 1 },
      { label: '0', class: 'calc-btn-number', action: '0', colSpan: 2 },
      { label: '.', class: 'calc-btn-number', action: 'decimal', colSpan: 1 },
      { label: '=', class: 'calc-btn-equals', action: 'equals', colSpan: 1 }
    ];
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = btn.class;
      button.textContent = btn.label;
      button.dataset.action = btn.action;
      
      if (btn.colSpan === 2) {
        button.style.gridColumn = 'span 2';
      }
      
      // Button styling
      const baseStyle = `
        border: none;
        border-radius: 12px;
        font-size: 24px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        padding: 20px;
        font-family: -apple-system, sans-serif;
      `;
      
      if (btn.class === 'calc-btn-number') {
        button.style.cssText = baseStyle + `
          background: rgba(50, 50, 50, 0.8);
          color: #e6e6e6;
        `;
        button.addEventListener('mouseenter', () => {
          button.style.background = 'rgba(70, 70, 70, 0.9)';
          button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.background = 'rgba(50, 50, 50, 0.8)';
          button.style.transform = 'scale(1)';
        });
      } else if (btn.class === 'calc-btn-operator') {
        button.style.cssText = baseStyle + `
          background: rgba(0, 255, 225, 0.2);
          color: #00ffe1;
          border: 1px solid rgba(0, 255, 225, 0.3);
        `;
        button.addEventListener('mouseenter', () => {
          button.style.background = 'rgba(0, 255, 225, 0.3)';
          button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.background = 'rgba(0, 255, 225, 0.2)';
          button.style.transform = 'scale(1)';
        });
      } else if (btn.class === 'calc-btn-function') {
        button.style.cssText = baseStyle + `
          background: rgba(100, 100, 100, 0.5);
          color: #e6e6e6;
        `;
        button.addEventListener('mouseenter', () => {
          button.style.background = 'rgba(120, 120, 120, 0.6)';
          button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.background = 'rgba(100, 100, 100, 0.5)';
          button.style.transform = 'scale(1)';
        });
      } else if (btn.class === 'calc-btn-equals') {
        button.style.cssText = baseStyle + `
          background: linear-gradient(135deg, #00ffe1, #2a82ff);
          color: #000;
          font-weight: 600;
        `;
        button.addEventListener('mouseenter', () => {
          button.style.transform = 'scale(0.95)';
          button.style.boxShadow = '0 4px 12px rgba(0, 255, 225, 0.4)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.transform = 'scale(1)';
          button.style.boxShadow = '';
        });
      }
      
      button.addEventListener('click', () => handleButtonClick(btn.action, display));
      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.9)';
      });
      button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
      });
      
      buttonGrid.appendChild(button);
    });
    
    container.appendChild(display);
    container.appendChild(buttonGrid);
    
    // Keyboard support
    setupKeyboardSupport(display);
    
    return container;
  }
  
  function setupKeyboardSupport(display) {
    document.addEventListener('keydown', (e) => {
      const activeWindow = OSState.getActiveWindow();
      if (!activeWindow || activeWindow.appName !== 'calculator') return;
      
      const key = e.key;
      
      if (key >= '0' && key <= '9') {
        handleButtonClick(key, display);
      } else if (key === '.') {
        handleButtonClick('decimal', display);
      } else if (key === '+') {
        handleButtonClick('add', display);
      } else if (key === '-') {
        handleButtonClick('subtract', display);
      } else if (key === '*') {
        handleButtonClick('multiply', display);
      } else if (key === '/') {
        e.preventDefault();
        handleButtonClick('divide', display);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleButtonClick('equals', display);
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleButtonClick('clear', display);
      } else if (key === '%') {
        handleButtonClick('percent', display);
      }
    });
  }
  
  function handleButtonClick(action, display) {
    if (action >= '0' && action <= '9') {
      inputNumber(action);
    } else if (action === 'decimal') {
      inputDecimal();
    } else if (action === 'clear') {
      clear();
    } else if (action === 'toggleSign') {
      toggleSign();
    } else if (action === 'percent') {
      percent();
    } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
      setOperation(action);
    } else if (action === 'equals') {
      calculate();
    }
    
    updateDisplay(display);
  }
  
  function inputNumber(num) {
    if (waitingForNewValue) {
      displayValue = num;
      waitingForNewValue = false;
    } else {
      displayValue = displayValue === '0' ? num : displayValue + num;
    }
  }
  
  function inputDecimal() {
    if (waitingForNewValue) {
      displayValue = '0.';
      waitingForNewValue = false;
    } else if (displayValue.indexOf('.') === -1) {
      displayValue += '.';
    }
  }
  
  function clear() {
    displayValue = '0';
    previousValue = null;
    operation = null;
    waitingForNewValue = false;
  }
  
  function toggleSign() {
    if (displayValue !== '0') {
      displayValue = displayValue.charAt(0) === '-' 
        ? displayValue.slice(1) 
        : '-' + displayValue;
    }
  }
  
  function percent() {
    displayValue = (parseFloat(displayValue) / 100).toString();
  }
  
  function setOperation(op) {
    const inputValue = parseFloat(displayValue);
    
    if (previousValue === null) {
      previousValue = inputValue;
    } else if (operation) {
      const result = performCalculation();
      displayValue = String(result);
      previousValue = result;
    }
    
    waitingForNewValue = true;
    operation = op;
  }
  
  function calculate() {
    if (previousValue === null || operation === null) return;
    
    const result = performCalculation();
    displayValue = String(result);
    previousValue = null;
    operation = null;
    waitingForNewValue = true;
  }
  
  function performCalculation() {
    const current = parseFloat(displayValue);
    const previous = previousValue;
    
    switch (operation) {
      case 'add':
        return previous + current;
      case 'subtract':
        return previous - current;
      case 'multiply':
        return previous * current;
      case 'divide':
        return previous / current;
      default:
        return current;
    }
  }
  
  function updateDisplay(display) {
    // Format number for display
    let formatted = displayValue;
    
    // Handle very long numbers
    if (formatted.length > 12) {
      const num = parseFloat(formatted);
      if (!isNaN(num)) {
        formatted = num.toExponential(6);
      }
    }
    
    // Handle decimal places
    if (formatted.indexOf('.') !== -1) {
      const parts = formatted.split('.');
      if (parts[1].length > 8) {
        formatted = parseFloat(formatted).toFixed(8);
      }
    }
    
    display.textContent = formatted;
  }
  
  function open() {
    const existing = WindowManager.getWindowByApp('calculator');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createCalculatorContent();
    WindowManager.createWindow('calculator', 'Calculator', content, {
      width: 320,
      height: 480
    });
  }
  
  return {
    open
  };
})();

window.CalculatorApp = CalculatorApp;

