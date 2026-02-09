import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Settings, Coffee, Briefcase, Timer, CheckCircle, Volume2, VolumeX } from "lucide-react";

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

export default function App() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isActive, setIsActive] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(25 * 60);

  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? JSON.parse(saved) : {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      soundEnabled: true
    };
  });

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  const modeConfig = {
    pomodoro: {
      label: 'Focus Time',
      duration: settings.pomodoro * 60,
      color: 'from-orange-900 via-orange-800 to-orange-900',
      accent: 'bg-orange-500',
      icon: Briefcase,
      message: 'Time to focus and get things done!'
    },
    shortBreak: {
      label: 'Short Break',
      duration: settings.shortBreak * 60,
      color: 'from-teal-900 via-teal-800 to-teal-900',
      accent: 'bg-teal-500',
      icon: Coffee,
      message: 'Take a quick break, you earned it!'
    },
    longBreak: {
      label: 'Long Break',
      duration: settings.longBreak * 60,
      color: 'from-blue-900 via-blue-800 to-blue-900',
      accent: 'bg-blue-500',
      icon: Timer,
      message: 'Great work! Enjoy a longer break.'
    }
  };

  const currentConfig = modeConfig[mode];

  useEffect(() => {
    setTimeLeft(currentConfig.duration);
    remainingTimeRef.current = currentConfig.duration;
    setIsActive(false);
  }, [mode, settings]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      startTimeRef.current = Date.now();
      remainingTimeRef.current = timeLeft;

      intervalRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        const newTimeLeft = Math.max(0, remainingTimeRef.current - elapsed);
        setTimeLeft(newTimeLeft);

        if (newTimeLeft === 0) {
          handleTimerComplete();
        }
      }, 100);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isActive, timeLeft]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.title = isActive 
      ? `(${minutes}:${seconds.toString().padStart(2, '0')}) ${currentConfig.label}`
      : 'Pomodoro Timer';
  }, [timeLeft, isActive, currentConfig.label]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (settings.soundEnabled) {
      playSound();
    }

    if (mode === 'pomodoro') {
      const newRounds = roundsCompleted + 1;
      setRoundsCompleted(newRounds);
      
      if (newRounds % 4 === 0) {
        if (settings.autoStartBreaks) {
          setMode('longBreak');
          setTimeout(() => setIsActive(true), 1000);
        } else {
          setMode('longBreak');
        }
      } else {
        if (settings.autoStartBreaks) {
          setMode('shortBreak');
          setTimeout(() => setIsActive(true), 1000);
        } else {
          setMode('shortBreak');
        }
      }
    } else {
      if (settings.autoStartPomodoros) {
        setMode('pomodoro');
        setTimeout(() => setIsActive(true), 1000);
      } else {
        setMode('pomodoro');
      }
    }
  };

  const playSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(currentConfig.duration);
    remainingTimeRef.current = currentConfig.duration;
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentConfig.duration - timeLeft) / currentConfig.duration) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentConfig.color} p-8 flex flex-col justify-center transition-all duration-1000`}>
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block mb-4"
        >
          {React.createElement(currentConfig.icon, { className: "w-16 h-16 text-green-400 mx-auto" })}
        </motion.div>
        <h1 className="text-5xl font-bold text-white mb-2">
          Pomodoro Timer
        </h1>
        <p className="text-slate-300 text-lg">{currentConfig.message}</p>
      </motion.div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-4 mb-8 max-w-3xl mx-auto w-full">
        {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <motion.button
            key={m}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchMode(m)}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              mode === m 
                ? 'bg-white text-slate-900 shadow-lg' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {modeConfig[m].label}
          </motion.button>
        ))}
      </div>

      {/* Main Timer Card */}
      <motion.div
        layout
        className="max-w-2xl mx-auto w-full bg-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-700"
      >
        {/* Circular Progress */}
        <div className="relative w-80 h-80 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-700"
            />
            <motion.circle
              cx="160"
              cy="160"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              className={`${currentConfig.accent.replace('bg-', 'text-')} transition-colors duration-1000`}
              initial={{ strokeDasharray: "0 880" }}
              animate={{ strokeDasharray: `${(progress / 100) * 880} 880` }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div 
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-7xl font-bold text-white mb-2"
              >
                {formatTime(timeLeft)}
              </motion.div>
              <div className="text-slate-400 text-lg">{currentConfig.label}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTimer}
            className={`${currentConfig.accent} text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg flex items-center gap-3`}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            {isActive ? 'Pause' : 'Start'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="bg-slate-700 text-white px-8 py-4 rounded-full font-bold shadow-lg"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{roundsCompleted}</div>
            <div className="text-slate-400 text-sm">Rounds Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{roundsCompleted % 4}/4</div>
            <div className="text-slate-400 text-sm">Until Long Break</div>
          </div>
        </div>
      </motion.div>

      {/* Settings Button - Floating */}
      <motion.button
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.2, cursor: "grabbing" }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        onClick={() => setShowSettings(true)}
        className="fixed top-8 right-8 bg-slate-700 p-4 rounded-full shadow-lg cursor-grab active:cursor-grabbing"
      >
        <Settings className="w-8 h-8 text-white" />
      </motion.button>

      {/* Sound Toggle - Floating */}
      <motion.button
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.2, cursor: "grabbing" }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
        className="fixed bottom-8 right-8 bg-amber-600 p-4 rounded-full shadow-lg cursor-grab active:cursor-grabbing"
      >
        {settings.soundEnabled ? <Volume2 className="w-8 h-8 text-white" /> : <VolumeX className="w-8 h-8 text-white" />}
      </motion.button>

      {/* Settings Dialog */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-slate-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Time Settings */}
                  <div>
                    <label className="text-white font-semibold mb-2 block">Focus Time (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.pomodoro}
                      onChange={(e) => setSettings({ ...settings, pomodoro: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">Short Break (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.shortBreak}
                      onChange={(e) => setSettings({ ...settings, shortBreak: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">Long Break (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.longBreak}
                      onChange={(e) => setSettings({ ...settings, longBreak: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Auto-start toggles */}
                  <div className="pt-4 border-t border-slate-700 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-white">Auto-start Breaks</span>
                      <div 
                        onClick={() => setSettings({ ...settings, autoStartBreaks: !settings.autoStartBreaks })}
                        className={`w-14 h-7 rounded-full transition-colors ${settings.autoStartBreaks ? 'bg-green-500' : 'bg-slate-600'}`}
                      >
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className={`w-6 h-6 bg-white rounded-full mt-0.5 ${settings.autoStartBreaks ? 'ml-7' : 'ml-1'}`}
                        />
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-white">Auto-start Pomodoros</span>
                      <div 
                        onClick={() => setSettings({ ...settings, autoStartPomodoros: !settings.autoStartPomodoros })}
                        className={`w-14 h-7 rounded-full transition-colors ${settings.autoStartPomodoros ? 'bg-green-500' : 'bg-slate-600'}`}
                      >
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className={`w-6 h-6 bg-white rounded-full mt-0.5 ${settings.autoStartPomodoros ? 'ml-7' : 'ml-1'}`}
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Save Settings
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}