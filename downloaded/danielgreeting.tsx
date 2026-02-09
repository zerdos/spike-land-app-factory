import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Code, Rocket, Zap, Star, Flame } from "lucide-react";

export default function App() {
  const [time, setTime] = useState(new Date());
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 100,
          icon: [Sparkles, Star, Zap, Flame][Math.floor(Math.random() * 4)],
          color: ['text-yellow-400', 'text-pink-400', 'text-blue-400', 'text-green-400'][Math.floor(Math.random() * 4)]
        }
      ]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (particles.length > 20) {
      setParticles(prev => prev.slice(-20));
    }
  }, [particles]);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const name = "Daniel";
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center p-6 overflow-hidden relative">
      
      {/* Floating Background Particles */}
      <AnimatePresence>
        {particles.map((particle) => {
          const Icon = particle.icon;
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 100, x: `${particle.x}vw`, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: -100, 
                scale: [0, 1.5, 1, 0],
                rotate: [0, 180, 360]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute pointer-events-none"
            >
              <Icon className={`w-8 h-8 ${particle.color}`} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Rotating Border Glow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(255,255,255,0.3) 41%, transparent 42%)"
        }}
      />

      <div className="max-w-4xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10, rotateY: 180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white border-opacity-20 relative overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          
          {/* Animated Border Pulse */}
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(255,255,255,0.3)",
                "0 0 60px rgba(255,255,255,0.6)",
                "0 0 20px rgba(255,255,255,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
          />

          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.5, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-16 h-16 text-green-500" />
              </motion.div>
            </motion.div>
          </div>

          {/* Animated Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-6xl md:text-7xl font-bold text-gray-800 text-center mb-4 flex flex-wrap justify-center gap-2"
          >
            <span>Hello,</span>
            <span className="inline-flex">
              {name.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={letterVariants}
                  whileHover={i === 0 ? { 
                    scale: [1.3, 2, 3, 4],
                    color: ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
                    rotate: [0, -180, -360, -540, -720],
                    transition: { duration: 2 }
                  } : { 
                    scale: 1.3, 
                    color: "#10b981",
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                  onHoverStart={() => {
                    if (i === 0) {
                      const card = document.querySelector('.bg-white.bg-opacity-10');
                      if (card) {
                        card.style.transition = 'transform 2s ease-out';
                        card.style.transform = 'rotateY(360deg) scale(1.2)';
                      }
                    }
                  }}
                  onHoverEnd={() => {
                    if (i === 0) {
                      const card = document.querySelector('.bg-white.bg-opacity-10');
                      if (card) {
                        card.style.transition = 'transform 2s ease-out';
                        card.style.transform = 'rotateY(0deg) scale(1)';
                      }
                    }
                  }}
                  className="text-green-500 inline-block cursor-pointer"
                >
                  {letter}
                </motion.span>
              ))}
              <motion.span
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-green-500"
              >
                !
              </motion.span>
            </span>
          </motion.h1>

          {/* Animated Greeting */}
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-2xl text-gray-600 text-center mb-8 font-light"
          >
            {greeting.split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ 
                  scale: 1.5,
                  color: "#f59e0b",
                  transition: { duration: 0.2 }
                }}
                className="inline-block"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
            <span>! Welcome back</span>
          </motion.p>

          {/* Animated Clock */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="text-5xl font-mono font-bold text-gray-800"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(0,0,0,0.1)",
                  "0 0 20px rgba(251,146,60,0.5)",
                  "0 0 10px rgba(0,0,0,0.1)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {time.toLocaleTimeString().split("").map((char, i) => (
                <motion.span
                  key={i}
                  animate={{ 
                    y: [0, -10, 0],
                    scale: char === ":" ? [1, 1.3, 1] : 1
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
            <motion.div 
              className="text-lg text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </motion.div>
          </motion.div>

          {/* Animated Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -100, rotate: -45 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center transition-all cursor-pointer relative overflow-hidden"
            >
              <motion.div
                animate={{ 
                  background: [
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
              />
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Heart className="w-10 h-10 text-red-400 mx-auto mb-3" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Creative</h3>
              <p className="text-gray-500 text-sm">Always thinking outside the box</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, 5, -5, 0],
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center transition-all cursor-pointer relative overflow-hidden"
            >
              <motion.div
                animate={{ 
                  background: [
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute inset-0"
              />
              <motion.div
                animate={{ 
                  rotateY: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Code className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovative</h3>
              <p className="text-gray-500 text-sm">Building amazing things</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 45 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center transition-all cursor-pointer relative overflow-hidden"
            >
              <motion.div
                animate={{ 
                  background: [
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                className="absolute inset-0"
              />
              <motion.div
                animate={{ 
                  y: [-5, 5, -5],
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Rocket className="w-10 h-10 text-green-400 mx-auto mb-3" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ambitious</h3>
              <p className="text-gray-500 text-sm">Reaching for the stars</p>
            </motion.div>
          </div>

          {/* Animated Quote Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-6 text-center relative overflow-hidden"
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            />
            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl font-semibold text-gray-800 italic relative z-10"
            >
              Today is a great day to create something amazing!
            </motion.p>
          </motion.div>

          {/* Enhanced Sparkle Rain */}
          <div className="relative mt-8 h-24 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [-20, -120],
                  x: [0, (Math.random() - 0.5) * 200],
                  scale: [0, 1.5, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
              >
                <Sparkles className={`w-6 h-6 ${['text-yellow-400', 'text-pink-400', 'text-blue-400', 'text-green-400'][i % 4]}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: "spring" }}
          className="text-center text-gray-100 text-lg mt-6 font-light drop-shadow-lg"
        >
          {["Have", "an", "awesome", "day,", "Daniel!"].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              whileHover={{ 
                scale: 1.3,
                color: "#fbbf24",
                transition: { duration: 0.2 }
              }}
              className="inline-block mx-1 cursor-pointer"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </div>
  );
}