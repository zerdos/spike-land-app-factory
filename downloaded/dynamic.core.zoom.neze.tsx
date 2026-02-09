import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  difficulty: string;
  date: string;
}

const QUESTIONS: Question[] = [
  // Easy Science Questions
  {
    id: 1,
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "O2", "H2O2"],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'Science',
    timeLimit: 15
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Science',
    timeLimit: 15
  },
  {
    id: 3,
    question: "How many bones are in the adult human body?",
    options: ["186", "206", "226", "246"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Science',
    timeLimit: 15
  },
  {
    id: 4,
    question: "What is the speed of light?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'Science',
    timeLimit: 15
  },
  // Medium Science Questions
  {
    id: 5,
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Science',
    timeLimit: 20
  },
  {
    id: 6,
    question: "What type of bond shares electrons between atoms?",
    options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Science',
    timeLimit: 20
  },
  // Hard Science Questions
  {
    id: 7,
    question: "What is the half-life of Carbon-14?",
    options: ["5,730 years", "10,000 years", "2,500 years", "15,000 years"],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Science',
    timeLimit: 25
  },
  // Easy History Questions
  {
    id: 8,
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'History',
    timeLimit: 15
  },
  {
    id: 9,
    question: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'History',
    timeLimit: 15
  },
  {
    id: 10,
    question: "In which year did the Titanic sink?",
    options: ["1910", "1911", "1912", "1913"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'History',
    timeLimit: 15
  },
  // Medium History Questions
  {
    id: 11,
    question: "Which empire built Machu Picchu?",
    options: ["Aztec", "Maya", "Inca", "Olmec"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'History',
    timeLimit: 20
  },
  {
    id: 12,
    question: "In which year did the Berlin Wall fall?",
    options: ["1987", "1988", "1989", "1990"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'History',
    timeLimit: 20
  },
  // Hard History Questions
  {
    id: 13,
    question: "Who was the Roman Emperor during the Great Fire of Rome in 64 AD?",
    options: ["Augustus", "Nero", "Caligula", "Claudius"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'History',
    timeLimit: 25
  },
  {
    id: 14,
    question: "In which year was the Peace of Westphalia signed?",
    options: ["1618", "1638", "1648", "1658"],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'History',
    timeLimit: 25
  }
];

export default function TriviaQuizGame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results' | 'leaderboard'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('triviaLeaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleAnswer(null);
    }
  }, [timeLeft, gameState, showFeedback]);

  const startGame = () => {
    const filteredQuestions = QUESTIONS.filter(q => q.difficulty === difficulty);
    setQuestions(filteredQuestions.sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(filteredQuestions[0]?.timeLimit || 15);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameState('playing');
  };

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 10);
      const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      setScore(score + (100 * difficultyMultiplier) + timeBonus);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  const saveToLeaderboard = () => {
    if (!playerName.trim()) return;

    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score,
      difficulty,
      date: new Date().toLocaleDateString()
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('triviaLeaderboard', JSON.stringify(updatedLeaderboard));
    setGameState('leaderboard');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen relative p-4 flex items-center justify-center overflow-hidden">
      {/* English Flag Background - Union Jack inspired */}
      <div className="absolute inset-0 bg-blue-700">
        {/* White diagonal crosses */}
        <div className="absolute inset-0 bg-white" style={{
          clipPath: 'polygon(0 0, 55% 0, 100% 45%, 100% 55%, 45% 100%, 0 100%, 0 45%, 45% 0)'
        }}></div>
        {/* Red cross center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-1/6 bg-red-600"></div>
          <div className="absolute h-full w-1/6 bg-red-600"></div>
        </div>
        {/* Red diagonal crosses */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600 origin-top-left rotate-[26deg]"></div>
          <div className="absolute top-0 right-0 w-full h-1 bg-red-600 origin-top-right -rotate-[26deg]"></div>
        </div>
      </div>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content Container */}
      <motion.div 
        className="relative z-10 max-w-4xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {/* Menu Screen */}
          {gameState === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8"
            >
              <motion.div 
                className="space-y-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  🎯 Trivia Quiz
                </h1>
                <p className="text-gray-600 text-lg">Test your knowledge in Science & History!</p>
              </motion.div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Choose Difficulty</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['easy', 'medium', 'hard'] as const).map((level, index) => (
                    <motion.button
                      key={level}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(level)}
                      className={`p-6 rounded-2xl font-bold text-lg transition-all ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">
                        {level === 'easy' ? '🌟' : level === 'medium' ? '⭐' : '💫'}
                      </div>
                      {level.toUpperCase()}
                      <div className="text-sm mt-2 opacity-80">
                        {level === 'easy' ? '15s per question' : level === 'medium' ? '20s per question' : '25s per question'}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={startGame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Quiz 🚀
              </motion.button>

              <motion.button
                onClick={() => setGameState('leaderboard')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                className="block mx-auto text-purple-600 hover:text-purple-800 font-semibold"
              >
                View Leaderboard 🏆
              </motion.button>
            </motion.div>
          )}

          {/* Playing Screen */}
          {gameState === 'playing' && currentQuestion && (
            <motion.div 
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6"
            >
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-gray-600">
                    Score: <span className="text-purple-600 text-lg">{score}</span>
                  </div>
                  <motion.div 
                    className={`text-2xl font-bold px-4 py-2 rounded-full ${
                      timeLeft <= 5 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}
                    animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
                  >
                    ⏱️ {timeLeft}s
                  </motion.div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <motion.div 
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-sm font-semibold text-purple-600 mb-2">
                  {currentQuestion.category} • {currentQuestion.difficulty.toUpperCase()}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {currentQuestion.question}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showResult = showFeedback;

                  let bgClass = 'bg-gray-50 hover:bg-gray-100 border-gray-200';

                  if (showResult) {
                    if (isCorrect) {
                      bgClass = 'bg-green-100 border-green-500 text-green-800';
                    } else if (isSelected && !isCorrect) {
                      bgClass = 'bg-red-100 border-red-500 text-red-800';
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                      whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                      onClick={() => !showFeedback && handleAnswer(index)}
                      disabled={showFeedback}
                      className={`p-6 rounded-2xl border-2 font-semibold text-left transition-all ${bgClass} ${
                        isSelected && !showResult ? 'ring-4 ring-purple-300' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="flex-1">{option}</div>
                        {showResult && isCorrect && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                            className="text-2xl"
                          >
                            ✅
                          </motion.span>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                            className="text-2xl"
                          >
                            ❌
                          </motion.span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Results Screen */}
          {gameState === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8"
            >
              <motion.div 
                className="text-6xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                🎉
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Quiz Complete!
              </motion.h1>

              <motion.div 
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-gray-600 mb-2">Your Final Score</div>
                <motion.div 
                  className="text-6xl font-black text-purple-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
                >
                  {score}
                </motion.div>
                <motion.div 
                  className="text-gray-600 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Difficulty: <span className="font-bold text-gray-800">{difficulty.toUpperCase()}</span>
                </motion.div>
                <motion.div 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Correct: <span className="font-bold text-green-600">{Math.round((score / (questions.length * 100 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3))) * questions.length)}</span> / {questions.length}
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <input
                  type="text"
                  placeholder="Enter your name for the leaderboard"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-6 py-3 rounded-full border-2 border-gray-300 focus:border-purple-500 outline-none text-center font-semibold"
                  maxLength={20}
                />
                <motion.button
                  onClick={saveToLeaderboard}
                  disabled={!playerName.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save to Leaderboard 🏆
                </motion.button>
              </motion.div>

              <motion.div 
                className="flex gap-4 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <motion.button
                  onClick={() => setGameState('menu')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all"
                >
                  Back to Menu
                </motion.button>
                <motion.button
                  onClick={startGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Leaderboard Screen */}
          {gameState === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6"
            >
              <motion.div 
                className="text-center space-y-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div 
                  className="text-5xl"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  🏆
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Leaderboard
                </h1>
              </motion.div>

              <div className="space-y-3">
                {leaderboard.length === 0 ? (
                  <motion.div 
                    className="text-center text-gray-500 py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    No scores yet. Be the first! 🎯
                  </motion.div>
                ) : (
                  leaderboard.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-400'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-400'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="text-3xl font-black w-12 text-center">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{entry.name}</div>
                        <div className="text-sm text-gray-600">
                          {entry.difficulty.toUpperCase()} • {entry.date}
                        </div>
                      </div>
                      <div className="text-2xl font-black text-purple-600">
                        {entry.score}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <motion.button
                onClick={() => setGameState('menu')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all"
              >
                Back to Menu
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}