import { useState, useEffect, useRef } from 'react';

export default function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
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
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft === 0 && (minutes > 0 || seconds > 0)) {
      const totalSeconds = minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      setIsRunning(true);
      setIsFinished(false);
    } else if (timeLeft > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsFinished(false);
  };

  const displayMinutes = Math.floor(timeLeft / 60);
  const displaySeconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Countdown Timer
        </h1>

        <div className="bg-gray-100 rounded-2xl p-8 mb-6">
          <div className="text-7xl font-mono font-bold text-center text-gray-800">
            {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </div>
          {isFinished && (
            <div className="text-center mt-4 text-2xl font-semibold text-red-500 animate-pulse">
              Time's Up! 🎉
            </div>
          )}
        </div>

        {!isRunning && timeLeft === 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
              <input
                type="number"
                min="0"
                max="99"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full px-4 py-3 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={timeLeft === 0 && minutes === 0 && seconds === 0}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            Reset
          </button>
        </div>

        {!isRunning && timeLeft === 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Quick Presets</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '1 min', m: 1, s: 0 },
                { label: '5 min', m: 5, s: 0 },
                { label: '10 min', m: 10, s: 0 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setMinutes(preset.m);
                    setSeconds(preset.s);
                  }}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}