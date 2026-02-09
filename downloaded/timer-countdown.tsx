import { useState, useEffect, useRef } from 'react';

export default function CountdownTimer() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft === 0) {
      const totalSeconds = minutes * 60 + seconds;
      if (totalSeconds > 0) {
        setTimeLeft(totalSeconds);
        setIsRunning(true);
        setIsCompleted(false);
      }
    } else {
      setIsRunning(true);
      setIsCompleted(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Countdown Timer
        </h1>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border-4 border-gray-200">
          <div className="text-7xl font-bold text-center tracking-wider text-gray-800 font-mono">
            {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
          </div>
          {isCompleted && (
            <div className="text-center mt-4 text-green-600 font-semibold text-xl animate-pulse">
              ⏰ Time's Up!
            </div>
          )}
        </div>

        {timeLeft === 0 && !isRunning && (
          <div className="grid grid-cols-2 gap-4 mb-8">
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold text-center"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold text-center"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={minutes === 0 && seconds === 0 && timeLeft === 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {timeLeft > 0 ? '▶ Resume' : '▶ Start'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              ⏸ Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            disabled={timeLeft === 0 && !isCompleted}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            ↻ Reset
          </button>
        </div>

        {timeLeft === 0 && !isRunning && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center font-medium">Quick Presets</p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 15].map((min) => (
                <button
                  key={min}
                  onClick={() => {
                    setMinutes(min);
                    setSeconds(0);
                  }}
                  className="py-2 px-3 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-lg font-medium transition-colors text-sm"
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}