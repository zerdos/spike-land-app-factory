import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, TrendingUp } from 'lucide-react';

interface Session {
  type: 'work' | 'break';
  duration: number;
  completedAt: string;
}

interface Stats {
  totalSessions: number;
  totalWorkTime: number;
  totalBreakTime: number;
  sessionsToday: number;
}

const PomodoroTimer: React.FC = () => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    totalWorkTime: 0,
    totalBreakTime: 0,
    sessionsToday: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      calculateStats(parsed);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
      calculateStats(sessions);
    }
  }, [sessions]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const calculateStats = (sessionList: Session[]) => {
    const today = new Date().toDateString();
    const todaySessions = sessionList.filter(
      (s) => new Date(s.completedAt).toDateString() === today
    );

    setStats({
      totalSessions: sessionList.length,
      totalWorkTime: sessionList
        .filter((s) => s.type === 'work')
        .reduce((acc, s) => acc + s.duration, 0),
      totalBreakTime: sessionList
        .filter((s) => s.type === 'break')
        .reduce((acc, s) => acc + s.duration, 0),
      sessionsToday: todaySessions.length,
    });
  };

  const handleSessionComplete = () => {
    setIsRunning(false);
    playNotificationSound();

    const completedSession: Session = {
      type: mode,
      duration: mode === 'work' ? workDuration : breakDuration,
      completedAt: new Date().toISOString(),
    };

    setSessions((prev) => [...prev, completedSession]);

    // Switch mode
    if (mode === 'work') {
      setMode('break');
      setTimeLeft(breakDuration * 60);
    } else {
      setMode('work');
      setTimeLeft(workDuration * 60);
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
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
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Pomodoro Timer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-6">
                  {mode === 'work' ? (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">Focus Session</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-5 h-5" />
                      <span className="font-semibold">Break Time</span>
                    </>
                  )}
                </div>

                <div className="text-8xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
                  {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={toggleTimer}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:shadow-md transform hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-gray-700 mb-3">Timer Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Work Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={workDuration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 25;
                        setWorkDuration(val);
                        if (mode === 'work' && !isRunning) {
                          setTimeLeft(val * 60);
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      disabled={isRunning}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={breakDuration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 5;
                        setBreakDuration(val);
                        if (mode === 'break' && !isRunning) {
                          setTimeLeft(val * 60);
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      disabled={isRunning}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Statistics
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Sessions Today</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {stats.sessionsToday}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.totalSessions}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Work Time</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatMinutes(stats.totalWorkTime)}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Break Time</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatMinutes(stats.totalBreakTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Sessions</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sessions.slice(-10).reverse().map((session, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      session.type === 'work'
                        ? 'bg-indigo-50 border-l-4 border-indigo-500'
                        : 'bg-orange-50 border-l-4 border-orange-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {session.type === 'work' ? (
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Coffee className="w-4 h-4 text-orange-600" />
                        )}
                        <span className="font-semibold text-sm capitalize">
                          {session.type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {session.duration}m
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(session.completedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No sessions yet. Start your first Pomodoro!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;