import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="inline-block"
        >
          <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-white mb-4"
        >
          Hello Weyert!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl text-white/90 mb-8"
        >
          Welcome to your awesome page
        </motion.p>
        
        <div className="flex items-center justify-center gap-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            className="inline-block"
          >
            <Heart className="w-12 h-12 text-red-400 fill-red-400" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              repeatDelay: 0.5,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <Puppy />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function Puppy() {
  return (
    <div className="relative w-32 h-32">
      {/* Body */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-16 bg-amber-700 rounded-full" />
      
      {/* Head */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-20 bg-amber-600 rounded-full">
        {/* Ears */}
        <div className="absolute -left-2 top-2 w-8 h-12 bg-amber-700 rounded-full rotate-[-20deg]" />
        <div className="absolute -right-2 top-2 w-8 h-12 bg-amber-700 rounded-full rotate-[20deg]" />
        
        {/* Snout */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-8 bg-amber-500 rounded-full">
          {/* Nose */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-3 bg-black rounded-full" />
        </div>
        
        {/* Eyes */}
        <div className="absolute top-6 left-5 w-3 h-3 bg-black rounded-full">
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
        </div>
        <div className="absolute top-6 right-5 w-3 h-3 bg-black rounded-full">
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
        </div>
        
        {/* Eyebrows for cuteness */}
        <div className="absolute top-4 left-4 w-4 h-1 bg-amber-800 rounded-full rotate-[-10deg]" />
        <div className="absolute top-4 right-4 w-4 h-1 bg-amber-800 rounded-full rotate-[10deg]" />
      </div>
      
      {/* Front legs */}
      <div className="absolute bottom-0 left-8 w-4 h-8 bg-amber-700 rounded-lg" />
      <div className="absolute bottom-0 left-14 w-4 h-8 bg-amber-700 rounded-lg" />
      
      {/* Tail */}
      <motion.div
        animate={{ rotate: [0, 20, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0 }}
        className="absolute bottom-8 right-2 w-3 h-10 bg-amber-700 rounded-full origin-top rotate-[30deg]"
      />
      
      {/* Spots for extra cuteness */}
      <div className="absolute top-8 left-10 w-3 h-3 bg-amber-800 rounded-full" />
      <div className="absolute bottom-10 left-6 w-2 h-2 bg-amber-800 rounded-full" />
    </div>
  );
}