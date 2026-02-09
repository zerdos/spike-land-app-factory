import { useState, useEffect, useRef } from 'react';

export default function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, totalSeconds]);

  const handleStart = () => {
    if (!isRunning) {
      const total = minutes * 60 + seconds;
      if (total > 0) {
        setTotalSeconds(total);
        setIsRunning(true);
      }
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setMinutes(0);
    setSeconds(0);
  };

  const displayMinutes = Math.floor(totalSeconds / 60);
  const displaySeconds = totalSeconds % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Countdown Timer
        </h1>

        {/* Time Display */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6">
          <div className="text-7xl font-mono font-bold text-center text-gray-800">
            {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </div>
        </div>

        {/* Input Section */}
        {!isRunning && totalSeconds === 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-center text-2xl font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seconds
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-center text-2xl font-semibold"
              />
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!isRunning && totalSeconds === 0 && (
            <button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-yellow-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Pause
            </button>
          )}

          {!isRunning && totalSeconds > 0 && (
            <button
              onClick={() => setIsRunning(true)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Resume
            </button>
          )}

          {totalSeconds > 0 && (
            <button
              onClick={handleReset}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-rose-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}