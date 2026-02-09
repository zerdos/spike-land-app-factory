import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Heart, Star, ArrowRight, RotateCw } from "lucide-react";

export default function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const cards = [
    { id: 1, title: "Scale", color: "from-purple-500 to-pink-500", icon: Sparkles },
    { id: 2, title: "Rotate", color: "from-blue-500 to-cyan-500", icon: RotateCw },
    { id: 3, title: "Bounce", color: "from-green-500 to-emerald-500", icon: Zap },
    { id: 4, title: "Slide", color: "from-orange-500 to-red-500", icon: ArrowRight },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            Framer Motion Demo
          </h1>
          <p className="text-xl text-purple-200">
            Explore smooth animations and interactions
          </p>
        </motion.div>

        {/* Animated Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${card.color} p-6 rounded-2xl cursor-pointer shadow-2xl`}
                onClick={() => setSelectedCard(card)}
              >
                <Icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white">{card.title}</h3>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive Demos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Counter Demo */}
          <motion.div
            layout
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Counter Animation</h3>
            <motion.div
              key={count}
              initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-6xl font-bold text-purple-300 text-center mb-6"
            >
              {count}
            </motion.div>
            <button
              onClick={() => setCount(count + 1)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Increment!
            </button>
          </motion.div>

          {/* Toggle Visibility Demo */}
          <motion.div
            layout
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Enter/Exit Animation</h3>
            <div className="h-32 flex items-center justify-center mb-6">
              <AnimatePresence mode="wait">
                {isVisible && (
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 rounded-xl"
                  >
                    <Heart className="w-12 h-12 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              {isVisible ? "Hide" : "Show"}
            </button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="relative h-64 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden mb-12">
          <h3 className="text-2xl font-bold text-white text-center pt-8 mb-4">
            Continuous Animations
          </h3>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                y: [0, -30, 0],
                x: [0, 20, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: "50%",
              }}
            >
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`bg-gradient-to-br ${selectedCard.color} p-12 rounded-3xl max-w-md w-full shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                {React.createElement(selectedCard.icon, { className: "w-20 h-20 text-white mb-6 mx-auto" })}
                <h2 className="text-4xl font-bold text-white text-center mb-4">
                  {selectedCard.title}
                </h2>
                <p className="text-white/80 text-center mb-6">
                  This card animated with spring physics and rotation!
                </p>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}