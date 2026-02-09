import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '×': return prev * current;
      case '÷': return prev / current;
      default: return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const Button = ({ children, onClick, className = '', variant = 'default' }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'default' | 'operation' | 'equals' | 'clear';
  }) => {
    const baseClasses = 'text-xl font-bold rounded-sm transition-all active:translate-y-0.5 active:shadow-inner shadow-md border-2 aspect-square flex items-center justify-center';
    const variantClasses = {
      default: 'bg-gradient-to-b from-gray-300 to-gray-400 border-gray-500 text-gray-900 hover:from-gray-200 hover:to-gray-300',
      operation: 'bg-gradient-to-b from-amber-600 to-amber-700 border-amber-800 text-white hover:from-amber-500 hover:to-amber-600',
      equals: 'bg-gradient-to-b from-emerald-700 to-emerald-800 border-emerald-900 text-white hover:from-emerald-600 hover:to-emerald-700',
      clear: 'bg-gradient-to-b from-rose-600 to-rose-700 border-rose-800 text-white hover:from-rose-500 hover:to-rose-600'
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Wood texture background */}
      <div className="absolute inset-0 bg-[#8B4513]">
        {/* Base wood grain */}
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-amber-900 via-amber-700 to-amber-900"></div>

        {/* Wood grain lines */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(90deg,
            transparent 0%,
            rgba(139, 69, 19, 0.3) 2%,
            transparent 4%,
            transparent 20%,
            rgba(92, 46, 13, 0.5) 22%,
            transparent 24%,
            transparent 45%,
            rgba(139, 69, 19, 0.2) 47%,
            transparent 49%,
            transparent 70%,
            rgba(92, 46, 13, 0.4) 72%,
            transparent 74%,
            transparent 100%)`
        }}></div>

        {/* Vertical grain variation */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `linear-gradient(180deg,
            rgba(139, 69, 19, 0.2) 0%,
            transparent 10%,
            rgba(92, 46, 13, 0.3) 30%,
            transparent 40%,
            rgba(139, 69, 19, 0.15) 60%,
            transparent 70%,
            rgba(92, 46, 13, 0.25) 90%,
            transparent 100%)`
        }}></div>

        {/* Wood knots and imperfections */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-radial from-amber-900/30 to-transparent blur-sm"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-radial from-amber-950/40 to-transparent blur-md"></div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          )`
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">
      <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-2xl p-6 border-4 border-gray-600">
        {/* Casio Branding */}
        <div className="text-center mb-3">
          <div className="text-gray-400 text-xs font-bold tracking-widest">CASIO</div>
          <div className="text-gray-500 text-[10px] tracking-wide">fx-82</div>
        </div>

        {/* LCD Display */}
        <div className="mb-6">
          <div className="bg-[#9CA777] rounded-sm p-4 mb-2 border-4 border-gray-600 shadow-inner relative">
            {/* LCD texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-900/5 to-green-900/10 pointer-events-none rounded-sm"></div>

            <div className="text-[#4A5A3A] text-xs text-right mb-1 h-5 font-mono opacity-70">
              {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
            </div>
            <div className="text-[#1a2410] text-4xl text-right font-mono overflow-x-auto tracking-wider font-bold relative z-10">
              {display}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <Button onClick={handleClear} variant="clear" className="col-span-2 aspect-[2/1]">
            Clear
          </Button>
          <Button onClick={handleBackspace} variant="clear">
            ⌫
          </Button>
          <Button onClick={() => handleOperation('÷')} variant="operation">
            ÷
          </Button>

          {/* Row 2 */}
          <Button onClick={() => handleNumber('7')}>7</Button>
          <Button onClick={() => handleNumber('8')}>8</Button>
          <Button onClick={() => handleNumber('9')}>9</Button>
          <Button onClick={() => handleOperation('×')} variant="operation">
            ×
          </Button>

          {/* Row 3 */}
          <Button onClick={() => handleNumber('4')}>4</Button>
          <Button onClick={() => handleNumber('5')}>5</Button>
          <Button onClick={() => handleNumber('6')}>6</Button>
          <Button onClick={() => handleOperation('-')} variant="operation">
            -
          </Button>

          {/* Row 4 */}
          <Button onClick={() => handleNumber('1')}>1</Button>
          <Button onClick={() => handleNumber('2')}>2</Button>
          <Button onClick={() => handleNumber('3')}>3</Button>
          <Button onClick={() => handleOperation('+')} variant="operation">
            +
          </Button>

          {/* Row 5 */}
          <Button onClick={() => handleNumber('0')} className="col-span-2 aspect-[2/1]">
            0
          </Button>
          <Button onClick={handleDecimal}>.</Button>
          <Button onClick={handleEquals} variant="equals">
            =
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}