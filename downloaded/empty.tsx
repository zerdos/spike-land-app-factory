import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// All available emojis
const ALL_EMOJIS = [
  "😀",
  "😍",
  "😎",
  "🥳",
  "😭",
  "🤯",
  "🥺",
  "🚀",
  "🌈",
  "🔥",
  "💯",
  "⭐",
  "🎉",
  "💖",
  "🍕",
  "🌮",
  "🍦",
  "🍷",
  "🎮",
  "🏆",
  "⚽",
  "🏀",
  "🎸",
  "🎨",
  "📚",
  "💻",
  "📱",
  "🌍",
  "🌞",
  "🌙",
  "⛈️",
  "🐶",
  "🐱",
  "🦄",
  "🦋",
  "🌺",
  "🌴",
  "🏝️",
  "✨",
  "🎭",
  "🐸",
  "🦊",
  "🎪",
  "🍰",
  "☕",
  "🌻",
  "🎯",
  "🎤",
  "🛸",
  "🎲",
  "🌟",
  "🎊",
  "🎈",
  "🎁",
  "🎀",
  "💝",
  "💐",
  "🌹",
  "🌷",
  "🌸",
  "🦚",
  "🦜",
  "🐝",
  "🐛",
  "🦗",
  "🕷️",
  "🐢",
  "🐍",
  "🦎",
  "🐙",
  "🦀",
  "🐠",
  "🐟",
  "🐡",
  "🦈",
  "🐳",
  "🐋",
  "🐬",
  "🦭",
  "🐧",
];

// Fisher-Yates shuffle algorith
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MyComponent: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [randomEmojis, setRandomEmojis] = useState<string[]>([]);

  // Generate 20 random emojis on component mount and when refreshed
  const generateRandomEmojis = () => {
    const shuffled = shuffleArray(ALL_EMOJIS);
    setRandomEmojis(shuffled.slice(0, 20));
  };

  useEffect(() => {
    generateRandomEmojis();
  }, []);

  const containerClasses = cn(
    "flex flex-col items-center justify-center min-h-screen p-4",
    isDarkMode
      ? "dark bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      : "bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400"
  );

  return (
    <div className={containerClasses}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1
          className={cn(
            "text-4xl md:text-6xl font-bold mb-4",
            isDarkMode ? "text-white" : "text-gray-800"
          )}
        >
          Random Emojis
        </h1>
        <p
          className={cn(
            "text-lg mb-6",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}
        >
          Here are 20 randomly selected emojis
        </p>
      </motion.div>

      {/* Emoji Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={cn(
          "grid grid-cols-4 md:grid-cols-5 gap-6 p-8 rounded-3xl shadow-2xl backdrop-blur-sm border mb-8",
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white/70 border-white/50"
        )}
      >
        {randomEmojis.map((emoji, index) => (
          <motion.div
            key={`${emoji}-${index}`}
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{
              scale: 1.2,
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.3 },
            }}
            className={cn(
              "flex items-center justify-center p-4 rounded-2xl cursor-pointer transition-all duration-300",
              isDarkMode
                ? "hover:bg-gray-700/50"
                : "hover:bg-white/80 hover:shadow-lg"
            )}
          >
            <span className="text-5xl md:text-6xl">{emoji}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Refresh Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateRandomEmojis}
        className={cn(
          "px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300",
          isDarkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        )}
      >
        🎲 Get New Random Emojis
      </motion.button>
    </div>
  );
};

export default MyComponent;
