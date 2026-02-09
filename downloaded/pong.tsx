import React, { useState, useEffect, useRef, useCallback } from "react";

const PongGame = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState({
    playerScore: 0,
    aiScore: 0,
    gameStarted: false,
    gamePaused: false,
  });

  // Game constants - responsive sizinf
  const getCanvasSize = () => {
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? Math.min(window.innerWidth - 40, 400) : 800,
      height: isMobile ? Math.min(window.innerHeight * 0.4, 300) : 400,
    };
  };

  const [canvasSize, setCanvasSize] = useState(getCanvasSize());
  const CANVAS_WIDTH = canvasSize.width;
  const CANVAS_HEIGHT = canvasSize.height;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 10;
  const PADDLE_SPEED = 6;
  const BALL_SPEED = 4;

  // Game objects
  const gameObjects = useRef({
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: BALL_SPEED,
      dy: BALL_SPEED,
      size: BALL_SIZE,
    },
    playerPaddle: {
      x: 20,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    aiPaddle: {
      x: CANVAS_WIDTH - 30,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
  });

  const mouseY = useRef(CANVAS_HEIGHT / 2);
  const [isMobile, setIsMobile] = useState(false);
  const [touchControls, setTouchControls] = useState({
    up: false,
    down: false,
  });

  // Mouse movement handler
  const handleMouseMove = useCallback(
    (e) => {
      if (!gameState.gameStarted || gameState.gamePaused || isMobile) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleY = canvas.height / rect.height;
      mouseY.current = (e.clientY - rect.top) * scaleY;
    },
    [gameState.gameStarted, gameState.gamePaused, isMobile]
  );

  // Touch movement handler
  const handleTouchMove = useCallback(
    (e) => {
      if (!gameState.gameStarted || gameState.gamePaused) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const scaleY = canvas.height / rect.height;
      mouseY.current = (touch.clientY - rect.top) * scaleY;
    },
    [gameState.gameStarted, gameState.gamePaused]
  );

  // Touch control handlers
  const handleTouchControlStart = useCallback((direction) => {
    setTouchControls((prev) => ({ ...prev, [direction]: true }));
  }, []);

  const handleTouchControlEnd = useCallback((direction) => {
    setTouchControls((prev) => ({ ...prev, [direction]: false }));
  }, []);

  // Collision detection
  const checkCollision = (ball, paddle) => {
    return (
      ball.x < paddle.x + paddle.width &&
      ball.x + ball.size > paddle.x &&
      ball.y < paddle.y + paddle.height &&
      ball.y + ball.size > paddle.y
    );
  };

  // Reset ball position
  const resetBall = (direction = 1) => {
    gameObjects.current.ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: BALL_SPEED * direction,
      dy: (Math.random() - 0.5) * BALL_SPEED * 2,
      size: BALL_SIZE,
    };
  };

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameState.gameStarted || gameState.gamePaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { ball, playerPaddle, aiPaddle } = gameObjects.current;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update player paddle (follow mouse or touch controls)
    if (isMobile && (touchControls.up || touchControls.down)) {
      // Touch button controls for mobile
      if (touchControls.up) {
        playerPaddle.y = Math.max(0, playerPaddle.y - PADDLE_SPEED);
      }
      if (touchControls.down) {
        playerPaddle.y = Math.min(
          CANVAS_HEIGHT - PADDLE_HEIGHT,
          playerPaddle.y + PADDLE_SPEED
        );
      }
    } else {
      // Mouse/touch drag controls
      const targetY = mouseY.current - PADDLE_HEIGHT / 2;
      const paddleY = Math.max(
        0,
        Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, targetY)
      );
      playerPaddle.y = paddleY;
    }

    // Update AI paddle (simple AI - follows ball with some delay)
    const aiTargetY = ball.y - PADDLE_HEIGHT / 2;
    const aiCurrentY = aiPaddle.y + PADDLE_HEIGHT / 2;
    const aiDiff = aiTargetY + PADDLE_HEIGHT / 2 - aiCurrentY;

    if (Math.abs(aiDiff) > PADDLE_SPEED) {
      aiPaddle.y += aiDiff > 0 ? PADDLE_SPEED : -PADDLE_SPEED;
    }
    aiPaddle.y = Math.max(
      0,
      Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, aiPaddle.y)
    );

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y >= CANVAS_HEIGHT - ball.size) {
      ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (checkCollision(ball, playerPaddle)) {
      ball.dx = Math.abs(ball.dx);
      ball.x = playerPaddle.x + playerPaddle.width;
      // Add some spin based on where the ball hits the paddle
      const hitPos = (ball.y - playerPaddle.y) / PADDLE_HEIGHT;
      ball.dy = (hitPos - 0.5) * BALL_SPEED * 2;
    }

    if (checkCollision(ball, aiPaddle)) {
      ball.dx = -Math.abs(ball.dx);
      ball.x = aiPaddle.x - ball.size;
      // Add some spin based on where the ball hits the paddle
      const hitPos = (ball.y - aiPaddle.y) / PADDLE_HEIGHT;
      ball.dy = (hitPos - 0.5) * BALL_SPEED * 2;
    }

    // Ball goes off screen (scoring)
    if (ball.x < 0) {
      setGameState((prev) => ({ ...prev, aiScore: prev.aiScore + 1 }));
      resetBall(1);
    } else if (ball.x > CANVAS_WIDTH) {
      setGameState((prev) => ({ ...prev, playerScore: prev.playerScore + 1 }));
      resetBall(-1);
    }

    // Draw center line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(
      playerPaddle.x,
      playerPaddle.y,
      playerPaddle.width,
      playerPaddle.height
    );
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw scores
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(gameState.playerScore.toString(), CANVAS_WIDTH / 4, 60);
    ctx.fillText(gameState.aiScore.toString(), (3 * CANVAS_WIDTH) / 4, 60);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [
    gameState.gameStarted,
    gameState.gamePaused,
    gameState.playerScore,
    gameState.aiScore,
  ]);

  // Start game
  const startGame = () => {
    setGameState((prev) => ({ ...prev, gameStarted: true, gamePaused: false }));
    resetBall(Math.random() > 0.5 ? 1 : -1);
  };

  // Pause/Resume game
  const togglePause = () => {
    setGameState((prev) => ({ ...prev, gamePaused: !prev.gamePaused }));
  };

  // Reset game
  const resetGame = () => {
    setGameState({
      playerScore: 0,
      aiScore: 0,
      gameStarted: false,
      gamePaused: false,
    });
    resetBall();
  };

  // Setup canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

      return () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [handleMouseMove, handleTouchMove, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Detect mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCanvasSize(getCanvasSize());
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Game loop effect
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gamePaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gameState.gameStarted, gameState.gamePaused]);

  // Initial canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw initial state
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw initial paddles and ball
    ctx.fillStyle = "#fff";
    const { ball, playerPaddle, aiPaddle } = gameObjects.current;
    ctx.fillRect(
      playerPaddle.x,
      playerPaddle.y,
      playerPaddle.width,
      playerPaddle.height
    );
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw "Press Start" message
    const fontSize = Math.min(24, CANVAS_WIDTH / 20);
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";

    const isMobileDevice = window.innerWidth < 768;
    const controlText = isMobileDevice
      ? "Touch screen  or use buttons to control paddle"
      : "Move mouse to control left paddle";

    ctx.fillText(controlText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.fillText(
      "Press START to begin!",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 20
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">PONG</h1>
        <div className="flex gap-4 justify-center">
          {!gameState.gameStarted ? (
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
            >
              START GAME
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
              >
                {gameState.gamePaused ? "RESUME" : "PAUSE"}
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                RESET
              </button>
            </>
          )}
        </div>
      </div>

      <div className="border-4 border-white rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          className="block cursor-none"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      <div className="mt-6 text-white text-center">
        <p className="text-lg mb-2">
          <span className="font-bold">Player: {gameState.playerScore}</span>
          <span className="mx-4">-</span>
          <span className="font-bold">AI: {gameState.aiScore}</span>
        </p>
        <p className="text-sm text-gray-300">
          Move your mouse to control the left paddle. First to score wins!
        </p>
      </div>
    </div>
  );
};

export default PongGame;
