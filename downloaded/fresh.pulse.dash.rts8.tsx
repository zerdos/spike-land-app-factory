import React, { useState, useEffect } from "react";
import { Sparkles, Zap, Star, Heart, TrendingUp, Bell } from "lucide-react";

export default function App() {
  const [attention, setAttention] = useState(100);
  const [clicks, setClicks] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [pulse, setPulse] = useState(false);
  const [streak, setStreak] = useState(0);

  // Constant notification spam
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "🔥 Someone just clicked!",
        "⚡ You're missing out!",
        "💎 Trending NOW!",
        "🎯 Don't stop clicking!",
        "✨ 1,247 people are here!",
        "🚀 Almost at a milestone!",
        "💫 Your streak is hot!",
        "⭐ Keep going!",
      ];
      setNotifications(prev => [...prev.slice(-5), messages[Math.floor(Math.random() * messages.length)]]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Attention decay (you lose if you don't click!)
  useEffect(() => {
    const interval = setInterval(() => {
      setAttention(prev => Math.max(0, prev - 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    setAttention(prev => Math.min(100, prev + 15));
    setStreak(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 overflow-hidden relative">
      {/* Floating notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notif, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-2xl px-4 py-2 animate-bounce border-2 border-yellow-400"
          >
            <div className="flex items-center gap-2">
              <Bell className="text-red-500" size={16} />
              <span className="font-bold text-sm">{notif}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Attention meter */}
      <div className="fixed top-4 left-4 bg-white rounded-lg p-4 shadow-2xl border-4 border-yellow-400">
        <div className="text-sm font-bold text-gray-700 mb-2">ATTENTION LEVEL</div>
        <div className="w-48 h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
          <div
            className={`h-full transition-all duration-300 ${
              attention > 60 ? 'bg-green-500' : attention > 30 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
            }`}
            style={{ width: `${attention}%` }}
          />
        </div>
        {attention < 30 && (
          <div className="text-red-600 font-bold text-xs mt-1 animate-pulse">
            ⚠️ CLICK NOW OR LOSE!
          </div>
        )}
      </div>

      {/* Stats counter */}
      <div className="fixed top-24 left-4 bg-yellow-300 rounded-lg p-4 shadow-2xl border-4 border-black transform rotate-2">
        <div className="text-2xl font-black">🔥 {clicks} CLICKS!</div>
        <div className="text-sm font-bold">STREAK: {streak}</div>
      </div>

      {/* Main content - THE BUTTON */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-black text-white mb-8 animate-pulse drop-shadow-2xl">
            DON'T STOP CLICKING!
          </h1>
          
          <button
            onClick={handleClick}
            className={`
              relative
              ${pulse ? 'scale-110' : 'scale-100'}
              transition-all duration-300
              bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500
              text-white font-black text-4xl
              px-20 py-12
              rounded-full
              shadow-2xl
              border-8 border-white
              hover:scale-105
              active:scale-95
              cursor-pointer
              transform
              animate-bounce
            `}
          >
            <div className="flex items-center gap-4">
              <Sparkles className="animate-spin" size={48} />
              <span>CLICK ME!</span>
              <Zap className="animate-ping" size={48} />
            </div>
            
            {/* Floating icons */}
            <Star className="absolute -top-8 -left-8 text-yellow-300 animate-spin" size={32} />
            <Heart className="absolute -top-8 -right-8 text-pink-300 animate-pulse" size={32} />
            <TrendingUp className="absolute -bottom-8 left-1/2 text-green-300 animate-bounce" size={32} />
          </button>

          <div className="mt-8 text-white text-2xl font-bold animate-pulse">
            ⚡ {Math.floor(Math.random() * 9000) + 1000} PEOPLE WATCHING YOU! ⚡
          </div>

          <div className="mt-4 text-yellow-200 text-lg font-bold">
            🎯 NEXT REWARD IN {10 - (clicks % 10)} CLICKS!
          </div>
        </div>
      </div>

      {/* Random popups */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-lg shadow-2xl border-4 border-yellow-300 animate-bounce">
        <div className="font-black text-xl">
          💥 LIMITED TIME: Click now for NOTHING! 💥
        </div>
      </div>
    </div>
  );
}