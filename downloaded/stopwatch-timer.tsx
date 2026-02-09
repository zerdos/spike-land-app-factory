import React, { useState, useEffect, useRef } from 'react';

export default function StopwatchTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0'),
    };
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const { hours, minutes, seconds, milliseconds } = formatTime(time);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-8">
          Stopwatch Timer
        </h1>
        
        {/* Digital Display */}
        <div className="bg-gray-950 rounded-xl p-8 mb-8 border-2 border-gray-700 shadow-inner">
          <div className="flex items-center justify-center gap-2 font-mono">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold text-blue-400 tabular-nums">
                {hours}
              </div>
              <div className="text-xs text-gray-500 mt-2">HOURS</div>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-blue-400 pb-4">:</div>
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold text-blue-400 tabular-nums">
                {minutes}
              </div>
              <div className="text-xs text-gray-500 mt-2">MINUTES</div>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-blue-400 pb-4">:</div>
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold text-blue-400 tabular-nums">
                {seconds}
              </div>
              <div className="text-xs text-gray-500 mt-2">SECONDS</div>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-blue-500 pb-4 ml-1">
              .{milliseconds}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              ▶ Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              ⏸ Stop
            </button>
          )}
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            disabled={time === 0 && !isRunning}
          >
            ↻ Reset
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
            {isRunning ? 'Running' : 'Stopped'}
          </div>
        </div>
      </div>
    </div>
  );
}