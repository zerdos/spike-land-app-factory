import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
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
  }, [isRunning]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(ms).padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (time > 0) {
      setLaps([time, ...laps]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Stopwatch
        </h1>

        {/* Time Display */}
        <div className="bg-black/30 rounded-2xl p-8 mb-8">
          <div className="text-6xl font-mono font-bold text-white text-center tracking-wider">
            {formatTime(time)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleStartPause}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition-all ${
              isRunning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={24} />
                Pause
              </>
            ) : (
              <>
                <Play size={24} />
                Start
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        {/* Lap Button */}
        <button
          onClick={handleLap}
          disabled={!isRunning && time === 0}
          className="w-full py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all mb-6"
        >
          Lap
        </button>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="bg-black/20 rounded-xl p-4 max-h-64 overflow-y-auto">
            <h2 className="text-white font-semibold mb-3">Laps</h2>
            <div className="space-y-2">
              {laps.map((lap, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white/10 rounded-lg p-3"
                >
                  <span className="text-purple-300 font-semibold">
                    Lap {laps.length - index}
                  </span>
                  <span className="text-white font-mono">
                    {formatTime(lap)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
