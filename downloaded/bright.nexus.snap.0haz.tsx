import React, { useState } from "react";
import { RefreshCw, Twitter, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  }
];

export default function App() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [copied, setCopied] = useState(false);

  const getRandomQuote = () => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote === currentQuote && quotes.length > 1);
    setCurrentQuote(newQuote);
    setCopied(false);
  };

  const copyToClipboard = () => {
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Random Quote Generator
        </h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="text-6xl text-purple-500 mb-4">"</div>
            <p className="text-2xl text-gray-700 mb-4 leading-relaxed">
              {currentQuote.text}
            </p>
            <p className="text-right text-xl text-gray-500 italic">
              — {currentQuote.author}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 justify-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getRandomQuote}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
          >
            <RefreshCw size={20} />
            New Quote
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? "Copied!" : "Copy"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareOnTwitter}
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
          >
            <Twitter size={20} />
            Tweet
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}