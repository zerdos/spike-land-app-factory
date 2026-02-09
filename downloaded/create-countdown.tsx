import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Calendar, Trash2, Share2, Plus, Clock, PartyPopper, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[100px] shadow-xl"
  >
    <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-xs uppercase tracking-widest text-white/70 font-medium mt-1">
      {label}
    </span>
  </motion.div>
);

export default function CountdownApp() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('00:00');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const calculateTimeLeft = useCallback(() => {
    if (!date) return null;
    const target = new Date(`${date}T${time || '00:00'}`).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    };
  }, [date, time]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining && remaining.total <= 0) {
        setIsActive(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, calculateTimeLeft]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      setTimeLeft(calculateTimeLeft());
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(null);
  };

  const isFinished = timeLeft && timeLeft.total <= 0;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans text-slate-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!isActive ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-500/20 rounded-2xl">
                  <Timer className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Create Countdown</h1>
                  <p className="text-slate-400 text-sm">Set your target date and time</p>
                </div>
              </div>

              <form onSubmit={handleStart} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Event Name</label>
                  <input
                    type="text"
                    placeholder="Vacation, Birthday, Deadline..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Start Countdown
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-12"
            >
              <div className="space-y-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mx-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to settings
                </button>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {title || 'Countdown'}
                </h2>
                <p className="text-slate-400">
                  Target: {new Date(`${date}T${time}`).toLocaleString()}
                </p>
              </div>

              {isFinished ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-6 py-12"
                >
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
                    <PartyPopper className="w-12 h-12 text-green-400" />
                  </div>
                  <h3 className="text-4xl font-bold text-white">Time's Up!</h3>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TimeBlock value={timeLeft?.days || 0} label="Days" />
                  <TimeBlock value={timeLeft?.hours || 0} label="Hours" />
                  <TimeBlock value={timeLeft?.minutes || 0} label="Minutes" />
                  <TimeBlock value={timeLeft?.seconds || 0} label="Seconds" />
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard! (Mock share)');
                  }}
                  className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700"
                  title="Share"
                >
                  <Share2 className="w-6 h-6 text-slate-300" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all border border-red-500/20"
                  title="Delete"
                >
                  <Trash2 className="w-6 h-6 text-red-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}