/**
 * Game Template
 *
 * A template for interactive games and puzzles.
 * Use this for memory games, quizzes, reaction tests, and other game-like apps.
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, RotateCcw, Play } from "lucide-react";

type GameState = "idle" | "playing" | "won" | "lost";

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
  });

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("game-stats");
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem("game-stats", JSON.stringify(newStats));
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState("lost");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Start game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
  };

  // Score a point
  const handleScore = () => {
    const newScore = score + level * 10;
    setScore(newScore);

    // Level up every 50 points
    if (newScore >= level * 50) {
      setLevel((l) => l + 1);
      setTimeLeft((t) => Math.min(t + 5, 30)); // Bonus time
    }

    // Win condition: reach 200 points
    if (newScore >= 200) {
      setGameState("won");
      const newStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        bestScore: Math.max(stats.bestScore, newScore),
      };
      saveStats(newStats);
    }
  };

  // Handle game over
  useEffect(() => {
    if (gameState === "lost") {
      const newStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon,
        bestScore: Math.max(stats.bestScore, score),
      };
      saveStats(newStats);
    }
  }, [gameState, score, stats, saveStats]);

  // Reset game
  const resetGame = () => {
    setGameState("idle");
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-4">
        {/* Stats Bar */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Games: {stats.gamesPlayed}</span>
          <span>Wins: {stats.gamesWon}</span>
          <span>Best: {stats.bestScore}</span>
        </div>

        {/* Main Game Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Game Title
                </CardTitle>
                <CardDescription>Reach 200 points to win!</CardDescription>
              </div>
              {gameState === "playing" && (
                <Badge variant="outline" className="text-lg">
                  Level {level}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <p className="text-6xl font-bold">{score}</p>
              <p className="text-muted-foreground">points</p>
            </div>

            {/* Timer */}
            {gameState === "playing" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time Left</span>
                  <span>{timeLeft}s</span>
                </div>
                <Progress value={(timeLeft / 30) * 100} />
              </div>
            )}

            {/* Game States */}
            {gameState === "idle" && (
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">
                  Click the button as fast as you can!
                </p>
                <Button size="lg" onClick={startGame} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Game
                </Button>
              </div>
            )}

            {gameState === "playing" && (
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleScore}
                  className="h-24 w-full text-2xl"
                >
                  TAP! (+{level * 10})
                </Button>
              </div>
            )}

            {gameState === "won" && (
              <div className="text-center space-y-4">
                <div className="text-4xl">🎉</div>
                <h3 className="text-xl font-bold text-green-600">You Won!</h3>
                <p className="text-muted-foreground">
                  Final Score: {score} points
                </p>
                <Button onClick={resetGame} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Play Again
                </Button>
              </div>
            )}

            {gameState === "lost" && (
              <div className="text-center space-y-4">
                <div className="text-4xl">⏰</div>
                <h3 className="text-xl font-bold text-red-600">Time's Up!</h3>
                <p className="text-muted-foreground">
                  Final Score: {score} points
                </p>
                <Button onClick={resetGame} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        {gameState === "idle" && (
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">How to Play</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tap the button to score points</li>
                <li>• Higher levels give more points per tap</li>
                <li>• Level up every 50 points for bonus time</li>
                <li>• Reach 200 points before time runs out!</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
