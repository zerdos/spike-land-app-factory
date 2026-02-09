import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = (aiMode = false) => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    setIsPaused(false);
    setIsAIMode(aiMode);
  };

  const checkCollision = (head, snakeBody = snake) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    for (let segment of snakeBody) {
      if (segment.x === head.x && segment.y === head.y) {
        return true;
      }
    }
    return false;
  };

  const getAIDirection = useCallback(() => {
    const head = snake[0];
    const possibleMoves = [
      { x: 0, y: -1, name: 'up' },    // Up
      { x: 0, y: 1, name: 'down' },   // Down
      { x: -1, y: 0, name: 'left' },  // Left
      { x: 1, y: 0, name: 'right' }   // Right
    ];

    // Filter out moves that would go backwards (opposite direction)
    const validMoves = possibleMoves.filter(move => {
      return !(move.x === -direction.x && move.y === -direction.y);
    });

    // Score each move based on getting closer to food and avoiding collisions
    const scoredMoves = validMoves.map(move => {
      const newHead = { x: head.x + move.x, y: head.y + move.y };
      
      // Check if this move causes collision
      if (checkCollision(newHead)) {
        return { move, score: -1000 };
      }

      // Calculate Manhattan distance to food
      const distanceToFood = Math.abs(newHead.x - food.x) + Math.abs(newHead.y - food.y);
      
      // Calculate distance to nearest wall
      const distanceToWall = Math.min(
        newHead.x,
        newHead.y,
        GRID_SIZE - 1 - newHead.x,
        GRID_SIZE - 1 - newHead.y
      );

      // Prefer moves that get closer to food and stay away from walls
      const score = -distanceToFood + (distanceToWall * 0.1);
      
      return { move, score };
    });

    // Sort by score and pick the best move
    scoredMoves.sort((a, b) => b.score - a.score);
    
    if (scoredMoves.length > 0 && scoredMoves[0].score > -1000) {
      return scoredMoves[0].move;
    }

    // Fallback: return current direction
    return direction;
  }, [snake, food, direction, checkCollision]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted && e.key === "Enter") {
        resetGame(false);
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      if (gameOver || isPaused || isAIMode) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameOver, gameStarted, isPaused, isAIMode]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      // AI makes decision before each move
      if (isAIMode) {
        const newDirection = getAIDirection();
        
        setSnake((prevSnake) => {
          const head = prevSnake[0];
          const newHead = {
            x: head.x + newDirection.x,
            y: head.y + newDirection.y,
          };

          if (checkCollision(newHead, prevSnake)) {
            setGameOver(true);
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          // Check if food is eaten
          if (newHead.x === food.x && newHead.y === food.y) {
            setScore((prev) => prev + 10);
            setFood(generateFood());
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
        
        setDirection(newDirection);
      } else {
        setSnake((prevSnake) => {
          const head = prevSnake[0];
          const newHead = {
            x: head.x + direction.x,
            y: head.y + direction.y,
          };

          if (checkCollision(newHead, prevSnake)) {
            setGameOver(true);
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          // Check if food is eaten
          if (newHead.x === food.x && newHead.y === food.y) {
            setScore((prev) => prev + 10);
            setFood(generateFood());
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, gameStarted, isPaused, isAIMode, generateFood, getAIDirection, checkCollision]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="mb-6 text-center">
        <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-lg">
          🐍 SNAKE GAME
        </h1>
        <div className="text-3xl font-bold text-yellow-300 mb-2">
          Score: {score}
        </div>
        {isAIMode && (
          <div className="text-2xl font-bold text-cyan-300 animate-pulse">
            🤖 AI PLAYING
          </div>
        )}
      </div>

      <div
        className="relative bg-gray-900 border-4 border-cyan-400 shadow-2xl"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: GRID_SIZE }).map((_, y) =>
            Array.from({ length: GRID_SIZE }).map((_, x) => (
              <div
                key={`${x}-${y}`}
                className="absolute border border-gray-700"
                style={{
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            ))
          )}
        </div>

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute transition-all duration-100"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              backgroundColor: index === 0 ? (isAIMode ? "#8b5cf6" : "#22c55e") : (isAIMode ? "#a78bfa" : "#4ade80"),
              borderRadius: "2px",
              border: `1px solid ${isAIMode ? "#7c3aed" : "#16a34a"}`,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute animate-pulse"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            backgroundColor: "#ef4444",
            borderRadius: "50%",
            border: "2px solid #dc2626",
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
            <h2 className="text-5xl font-bold text-red-500 mb-4">GAME OVER!</h2>
            <p className="text-3xl text-white mb-2">Final Score: {score}</p>
            {isAIMode && <p className="text-xl text-cyan-300 mb-6">AI Mode</p>}
            <div className="flex gap-4">
              <button
                onClick={() => resetGame(false)}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => resetGame(true)}
                className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-lg transition-colors"
              >
                Watch AI
              </button>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-cyan-400 mb-6">
              Ready to Play?
            </h2>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => resetGame(false)}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg transition-colors"
              >
                🎮 Play Myself
              </button>
              <button
                onClick={() => resetGame(true)}
                className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-lg transition-colors"
              >
                🤖 Watch AI Play
              </button>
            </div>
            <div className="text-white text-center mt-4">
              <p className="text-lg">Use Arrow Keys to move</p>
              <p className="text-lg">Press SPACE to pause</p>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <h2 className="text-5xl font-bold text-yellow-400">PAUSED</h2>
          </div>
        )}
      </div>

      <div className="mt-6 text-white text-center space-y-2">
        <p className="text-lg">
          <span className="font-bold">Arrow Keys:</span> Control the snake (Player mode)
        </p>
        <p className="text-lg">
          <span className="font-bold">SPACE:</span> Pause/Resume
        </p>
        <p className="text-lg">
          <span className="font-bold">🤖 AI Mode:</span> Watch the computer play automatically!
        </p>
        <p className="text-lg">
          <span className="font-bold">Goal:</span> Eat the red food to grow and score points!
        </p>
      </div>
    </div>
  );
}
