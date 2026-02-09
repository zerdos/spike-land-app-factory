import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Code, Rocket } from "lucide-react";

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl shadow-2xl p-12 border-4 border-amber-900"
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                #8B4513 0px,
                #A0522D 2px,
                #CD853F 4px,
                #DEB887 6px,
                #D2691E 8px,
                #8B4513 10px
              ),
              linear-gradient(
                to bottom,
                rgba(139, 69, 19, 0.9),
                rgba(160, 82, 45, 0.85),
                rgba(205, 133, 63, 0.8),
                rgba(139, 69, 19, 0.9)
              )
            `,
            backgroundBlendMode: 'overlay',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3), 0 10px 40px rgba(0,0,0,0.4)'
          }}
        >
          {/* Animated Sparkles */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-16 h-16 text-green-300" />
            </motion.div>
          </div>

          {/* Main Greeting */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold text-white text-center mb-4"
          >
            Hello, <span className="text-green-300">Zoltán</span>! 👋
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-white text-center mb-8 font-light"
          >
            {getGreeting()}! Welcome back 🌟
          </motion.p>

          {/* Time Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <div className="text-5xl font-mono font-bold text-white">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-lg text-white text-opacity-80 mt-2">
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all cursor-pointer"
            >
              <Heart className="w-10 h-10 text-red-300 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Creative</h3>
              <p className="text-white text-opacity-80 text-sm">Always thinking outside the box</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all cursor-pointer"
            >
              <Code className="w-10 h-10 text-blue-300 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Innovative</h3>
              <p className="text-white text-opacity-80 text-sm">Building amazing things</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-opacity-30 transition-all cursor-pointer"
            >
              <Rocket className="w-10 h-10 text-green-300 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Ambitious</h3>
              <p className="text-white text-opacity-80 text-sm">Reaching for the stars</p>
            </motion.div>
          </div>

          {/* Inspirational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-6 text-center"
          >
            <p className="text-xl font-semibold text-gray-800 italic">
              "Today is a great day to create something amazing!"
            </p>
          </motion.div>

          {/* Floating Particles */}
          <div className="relative mt-8 h-24 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [-20, -100],
                  x: [0, Math.random() * 100 - 50]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
              >
                <Sparkles className="w-6 h-6 text-yellow-200" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white text-lg mt-6 font-light drop-shadow-lg"
        >
          Have an awesome day, Zoltán! ✨
        </motion.p>
      </div>
    </div>
  );
}
