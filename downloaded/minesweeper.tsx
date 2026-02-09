// minesweeper.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type Board = Cell[][];

type DifficultyLevel = "easy" | "medium" | "hard";

const difficultySettings: Record<DifficultyLevel, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

const generateBoard = (rows: number, cols: number, mines: number, safeRow?: number, safeCol?: number): Board => {
  const board: Board = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }))
    );

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].isMine && (safeRow === undefined || safeCol === undefined || row !== safeRow || col !== safeCol)) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        board[row][col].neighborMines = countNeighborMines(board, row, col);
      }
    }
  }

  return board;
};

const countNeighborMines = (board: Board, row: number, col: number): number => {
  let count = 0;
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const newRow = row + r;
      const newCol = col + c;
      if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && board[newRow][newCol].isMine) {
        count++;
      }
    }
  }
  return count;
};

const revealCell = (board: Board, row: number, col: number): void => {
  if (board[row][col].isRevealed || board[row][col].isFlagged || board[row][col].isMine) {
    return;
  }

  board[row][col].isRevealed = true;

  if (board[row][col].neighborMines === 0) {
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r === 0 && c === 0) continue;
        const newRow = row + r;
        const newCol = col + c;
        if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
          revealCell(board, newRow, newCol);
        }
      }
    }
  }
};

const revealMultipleCells = (board: Board, cells: { row: number; col: number }[]): void => {
  cells.forEach(({ row, col }) => {
    if (!board[row][col].isFlagged) {
      revealCell(board, row, col);
    }
  });
};

const checkWin = (board: Board): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (!board[row][col].isMine && !board[row][col].isRevealed) {
        return false;
      }
    }
  }
  return true;
};

const Cell: React.FC<{
  cell: Cell;
  onClick: () => void;
  onDoubleClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}> = React.memo(({ cell, onClick, onDoubleClick, onRightClick }) => {
  const cellStyle = `w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex items-center justify-center border border-white/20 cursor-pointer rounded-sm transition-colors ${cell.isRevealed ? (cell.isMine ? "bg-red-600 text-white" : "bg-blue-200 text-blue-800") : cell.isFlagged ? "bg-yellow-400 text-yellow-800" : "bg-indigo-400 hover:bg-indigo-300"}`;

  const getNumberColor = (num: number) => {
    const colors = ["text-blue-600", "text-green-600", "text-red-600", "text-purple-600", "text-yellow-600", "text-pink-600", "text-teal-600", "text-orange-600"];
    return colors[num - 1] || "text-gray-800";
  };

  return (
    <div className={cellStyle} onClick={onClick} onDoubleClick={onDoubleClick} onContextMenu={onRightClick}>
      {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && <span className={`font-bold text-xs sm:text-sm md:text-base ${getNumberColor(cell.neighborMines)}`}>{cell.neighborMines}</span>}
      {cell.isRevealed && cell.isMine && <span className="text-xs sm:text-sm md:text-base">💣</span>}
      {!cell.isRevealed && cell.isFlagged && <span className="text-xs sm:text-sm md:text-base">🚩</span>}
    </div>
  );
});

export default function Minesweeper() {
  const [board, setBoard] = useState<Board>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    const savedDifficulty = localStorage.getItem("minesweeperDifficulty") as DifficultyLevel;
    return savedDifficulty && difficultySettings[savedDifficulty] ? savedDifficulty : "easy";
  });

  const { rows, cols, mines } = difficultySettings[difficulty];

  const initializeGame = useCallback(() => {
    const newBoard = generateBoard(rows, cols, mines);
    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
    setTime(0);
    setTimerActive(false);
    setFlagCount(0);
  }, [rows, cols, mines]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameOver || win) return;

      if (!timerActive) {
        setTimerActive(true);
        // Ensure the first click is safe
        const newBoard = generateBoard(rows, cols, mines, row, col);
        setBoard(newBoard);
        revealCell(newBoard, row, col);
        setBoard(newBoard);
      } else {
        const newBoard = JSON.parse(JSON.stringify(board));

        if (newBoard[row][col].isMine) {
          const updatedBoard = revealAllMines(newBoard);
          setBoard(updatedBoard);
          setGameOver(true);
          setTimerActive(false);
        } else {
          revealCell(newBoard, row, col);
          setBoard(newBoard);

          if (checkWin(newBoard)) {
            const updatedBoard = revealAllMines(newBoard);
            setBoard(updatedBoard);
            setWin(true);
            setTimerActive(false);
          }
        }
      }
    },
    [board, gameOver, win, timerActive, rows, cols, mines]
  );

  const handleCellDoubleClick = useCallback(
    (row: number, col: number) => {
      if (gameOver || win || !board[row][col].isRevealed) return;

      const newBoard = JSON.parse(JSON.stringify(board));
      const cellsToReveal = [];
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const newRow = row + r;
          const newCol = col + c;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (!newBoard[newRow][newCol].isRevealed && !newBoard[newRow][newCol].isFlagged) {
              cellsToReveal.push({ row: newRow, col: newCol });
            }
          }
        }
      }
      revealMultipleCells(newBoard, cellsToReveal);
      setBoard(newBoard);

      if (checkWin(newBoard)) {
        setWin(true);
        setTimerActive(false);
      } else if (newBoard.some((row) => row.some((cell) => cell.isRevealed && cell.isMine))) {
        setGameOver(true);
        setTimerActive(false);
      }
    },
    [board, gameOver, win, rows, cols]
  );

  const handleCellRightClick = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (gameOver || win || board[row][col].isRevealed) return;

      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
      setBoard(newBoard);
      setFlagCount((prevCount) => (newBoard[row][col].isFlagged ? prevCount + 1 : prevCount - 1));
    },
    [board, gameOver, win]
  );

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    if (difficultySettings[newDifficulty]) {
      setDifficulty(newDifficulty);
      localStorage.setItem("minesweeperDifficulty", newDifficulty);
      initializeGame();
    }
  };

  return (
    <Card className="w-full h-screen max-w-3xl mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl flex flex-col p-2 sm:p-4 md:p-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Minesweeper</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/20 text-white text-sm sm:text-base">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-indigo-700 text-white">
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-sm sm:text-base bg-white/10 border-white/20">
              Time: {time}s
            </Badge>
            <Badge variant="outline" className="text-sm sm:text-base bg-white/10 border-white/20">
              Flags: {flagCount}/{mines}
            </Badge>
          </div>
        </div>
        <div
          className="bg-white/10 rounded-lg shadow-inner p-4 mt-4 mx-auto"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0px, 1fr))`,
            gap: "2px",
            width: "fit-content",
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          {board.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Cell key={`${rowIndex}-${colIndex}`} cell={cell} onClick={() => handleCellClick(rowIndex, colIndex)} onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)} onRightClick={(e) => handleCellRightClick(e, rowIndex, colIndex)} />
              ))}
            </React.Fragment>
          ))}
        </div>
        {gameOver && <p className="mt-4 text-xl font-bold text-center text-red-600">Game Over!</p>}
        {win && <p className="mt-4 text-xl font-bold text-center text-green-600">You Win!</p>}
        <Button onClick={initializeGame} className="w-full mt-4 sm:mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 text-sm sm:text-base rounded-full transition-colors">
          New Game
        </Button>
      </CardContent>
    </Card>
  );
}
