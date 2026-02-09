import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    const value = display;
    
    if (equation && !waitingForOperand) {
      handleEquals();
      setEquation(display + ' ' + op + ' ');
    } else {
      setEquation(value + ' ' + op + ' ');
    }
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    if (!equation || waitingForOperand) return;
    
    try {
      const fullEquation = equation + display;
      const sanitized = fullEquation.replace(/[^0-9+\-*/().\s]/g, '');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      
      setDisplay(String(result));
      setEquation('');
      setWaitingForOperand(true);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setWaitingForOperand(false);
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const Button = ({ value, onClick, className = '' }: { value: string; onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`h-16 text-xl font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-md ${className}`}
    >
      {value}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700">
        <div className="mb-6 bg-slate-900 rounded-xl p-6 border border-slate-700">
          <div className="text-slate-400 text-sm h-6 font-mono">
            {equation || '\u00A0'}
          </div>
          <div className="text-white text-4xl font-bold text-right mt-2 font-mono truncate">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Button value="C" onClick={handleClear} className="bg-red-600 hover:bg-red-500 text-white" />
          <Button value="⌫" onClick={handleBackspace} className="bg-slate-600 hover:bg-slate-500 text-white" />
          <Button value="/" onClick={() => handleOperator('/')} className="bg-orange-600 hover:bg-orange-500 text-white" />
          <Button value="×" onClick={() => handleOperator('*')} className="bg-orange-600 hover:bg-orange-500 text-white" />

          <Button value="7" onClick={() => handleNumber('7')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="8" onClick={() => handleNumber('8')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="9" onClick={() => handleNumber('9')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="−" onClick={() => handleOperator('-')} className="bg-orange-600 hover:bg-orange-500 text-white" />

          <Button value="4" onClick={() => handleNumber('4')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="5" onClick={() => handleNumber('5')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="6" onClick={() => handleNumber('6')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="+" onClick={() => handleOperator('+')} className="bg-orange-600 hover:bg-orange-500 text-white" />

          <Button value="1" onClick={() => handleNumber('1')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="2" onClick={() => handleNumber('2')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="3" onClick={() => handleNumber('3')} className="bg-slate-700 hover:bg-slate-600 text-white" />
          <Button value="=" onClick={handleEquals} className="bg-green-600 hover:bg-green-500 text-white row-span-2" />

          <Button value="0" onClick={() => handleNumber('0')} className="bg-slate-700 hover:bg-slate-600 text-white col-span-2" />
          <Button value="." onClick={handleDecimal} className="bg-slate-700 hover:bg-slate-600 text-white" />
        </div>
      </div>
    </div>
  );
}