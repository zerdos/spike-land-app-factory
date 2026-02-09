import { motion } from "framer-motion";
import AnalogWatch from "/live/rca2";

export default () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
    <motion.h1
      className="text-6xl font-bold text-white drop-shadow-2xl mb-4"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Hello Worl
    </motion.h1>
    <p className="text-xl text-white/80 mb-8">With an  Analog Watch!</p>
    <AnalogWatch />
    <motion.button
      className="mt-8 px-8 py-3 bg-white/20 backdrop-blur rounded-full text-white font-semibold"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      Click Me!
    </motion.button>
  </div>
);
