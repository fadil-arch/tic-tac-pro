"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameBoard from "@/components/tictac-toe/game-board";
import GameStatus from "@/components/tictac-toe/game-status";
import {
  Trophy,
  RefreshCw,
  Settings,
  History,
  Award,
  BarChart3,
  Sparkles,
  User,
  Cpu,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

type Player = "X" | "O" | null;
type GameMode = "pvp" | "ai" | "online";
type Difficulty = "easy" | "medium" | "hard";

interface GameHistory {
  board: Player[];
  winner: Player;
  moves: number;
  timestamp: Date;
}

export default function TicTacToePage() {
  // Game state
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // Game settings
  const [gameMode, setGameMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState({ x: 0, o: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isGameActive, setIsGameActive] = useState(true);

  // UI state
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = useCallback((newBoard: Player[]): { winner: Player, line: number[] | null } => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return { winner: newBoard[a], line: combo };
      }
    }

    if (newBoard.every((cell) => cell !== null)) {
      return { winner: null, line: null }; // Draw
    }

    return { winner: null, line: null };
  }, []);

  const handleCellClick = useCallback((index: number) => {
    if (board[index] || winner || isDraw || !isGameActive) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    setBoard(newBoard);

    const { winner: newWinner, line } = checkWinner(newBoard);

    if (newWinner) {
      setWinner(newWinner);
      setWinningLine(line);
      const key: "x" | "o" = newWinner === "X" ? "x" : "o";
      setScore(prev => ({
        ...prev,
        [key]: prev[key] + 1
      }));
      setIsGameActive(false);
    } else if (newBoard.every(cell => cell !== null)) {
      setIsDraw(true);
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      setIsGameActive(false);
    } else {
      setCurrentPlayer(prev => prev === "X" ? "O" : "X");
    }

    // Add to game history
    setGameHistory(prev => [{
      board: newBoard,
      winner: newWinner,
      moves: newBoard.filter(cell => cell !== null).length,
      timestamp: new Date()
    }, ...prev.slice(0, 4)]);
  }, [board, currentPlayer, winner, isDraw, isGameActive, checkWinner]);

  const makeAIMove = useCallback(() => {
    if (gameMode !== "ai" || currentPlayer !== "O" || winner || isDraw || !isGameActive) return;

    const emptyCells = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index): index is number => index !== null);

    if (emptyCells.length === 0) return;

    let moveIndex: number;

    // AI logic based on difficulty
    switch (difficulty) {
      case "easy":
        // Random move
        moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        break;

      case "medium":
        // Try to win, block, or random
        // Check for winning move
        for (let index of emptyCells) {
          const testBoard = [...board];
          testBoard[index] = "O";
          if (checkWinner(testBoard).winner === "O") {
            moveIndex = index;
            break;
          }
        }
        // Block opponent's winning move
        for (let index of emptyCells) {
          const testBoard = [...board];
          testBoard[index] = "X";
          if (checkWinner(testBoard).winner === "X") {
            moveIndex = index;
            break;
          }
        }
        // Take center if available
        if (emptyCells.includes(4)) {
          moveIndex = 4;
        } else {
          moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        break;

      case "hard":
        // Minimax algorithm for optimal play
        const scores: { [key: string]: number } = { X: -10, O: 10, draw: 0 };

        const minimax = (tempBoard: Player[], depth: number, isMaximizing: boolean): number => {
          const result = checkWinner(tempBoard);
          if (result.winner !== null) return scores[result.winner] || 0;
          if (tempBoard.every(cell => cell !== null)) return scores.draw;

          if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < tempBoard.length; i++) {
              if (tempBoard[i] === null) {
                tempBoard[i] = "O";
                const score = minimax(tempBoard, depth + 1, false);
                tempBoard[i] = null;
                bestScore = Math.max(score, bestScore);
              }
            }
            return bestScore;
          } else {
            let bestScore = Infinity;
            for (let i = 0; i < tempBoard.length; i++) {
              if (tempBoard[i] === null) {
                tempBoard[i] = "X";
                const score = minimax(tempBoard, depth + 1, true);
                tempBoard[i] = null;
                bestScore = Math.min(score, bestScore);
              }
            }
            return bestScore;
          }
        };

        let bestScore = -Infinity;
        let bestMove = emptyCells[0];

        for (let index of emptyCells) {
          const testBoard = [...board];
          testBoard[index] = "O";
          const score = minimax(testBoard, 0, false);
          if (score > bestScore) {
            bestScore = score;
            bestMove = index;
          }
        }
        moveIndex = bestMove;
        break;
    }

    setTimeout(() => {
      handleCellClick(moveIndex);
    }, 500);
  }, [board, currentPlayer, gameMode, difficulty, winner, isDraw, isGameActive, checkWinner, handleCellClick]);

  const resetGame = useCallback(() => {
    setIsResetting(true);
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setCurrentPlayer("X");
      setWinner(null);
      setIsDraw(false);
      setWinningLine(null);
      setIsGameActive(true);
      setIsResetting(false);
    }, 300);
  }, []);

  const resetScore = useCallback(() => {
    setScore({ x: 0, o: 0, draws: 0 });
    setGameHistory([]);
  }, []);

  useEffect(() => {
    if (gameMode === "ai" && currentPlayer === "O" && !winner && !isDraw && isGameActive) {
      makeAIMove();
    }
  }, [currentPlayer, gameMode, makeAIMove, winner, isDraw, isGameActive]);

  const getWinRate = () => {
    const totalGames = score.x + score.o + score.draws;
    if (totalGames === 0) return { x: 0, o: 0 };
    return {
      x: Math.round((score.x / totalGames) * 100),
      o: Math.round((score.o / totalGames) * 100)
    };
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 bg-cyan-400 blur-sm rounded-full" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              TicTac<span className="text-white">Pro</span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowStats(!showStats)}
              className="relative"
            >
              <BarChart3 className="w-5 h-5" />
              {gameHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-xs flex items-center justify-center">
                  {gameHistory.length}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetScore}
              className="hover:text-red-400"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Game Settings & Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-6"
          >
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Game Settings
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Game Mode</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: "pvp", icon: Users, label: "PvP" },
                              { value: "ai", icon: Cpu, label: "vs AI" },
                              { value: "online", icon: User, label: "Online" }
                            ].map((mode) => (
                              <Button
                                key={mode.value}
                                variant={gameMode === mode.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setGameMode(mode.value as GameMode);
                                  resetGame();
                                }}
                                className={cn(
                                  "flex flex-col items-center gap-1 h-auto py-3",
                                  gameMode === mode.value && "bg-gradient-to-r from-cyan-500 to-blue-500"
                                )}
                              >
                                <mode.icon className="w-4 h-4" />
                                <span className="text-xs">{mode.label}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        {gameMode === "ai" && (
                          <div>
                            <label className="text-sm text-slate-400 mb-2 block">AI Difficulty</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["easy", "medium", "hard"].map((diff) => (
                                <Button
                                  key={diff}
                                  variant={difficulty === diff ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setDifficulty(diff as Difficulty)}
                                  className={cn(
                                    "capitalize",
                                    difficulty === diff && "bg-gradient-to-r from-pink-500 to-rose-500"
                                  )}
                                >
                                  {diff}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Statistics
                      </h3>

                      <div className="space-y-4">
                        {/* Score Display */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="text-2xl font-bold text-blue-300">{score.x}</div>
                            <div className="text-xs text-slate-400">X Wins</div>
                            <div className="text-xs text-blue-400 mt-1">
                              {getWinRate().x}% win rate
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                            <div className="text-2xl font-bold text-slate-300">{score.draws}</div>
                            <div className="text-xs text-slate-400">Draws</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                            <div className="text-2xl font-bold text-pink-300">{score.o}</div>
                            <div className="text-xs text-slate-400">O Wins</div>
                            <div className="text-xs text-pink-400 mt-1">
                              {getWinRate().o}% win rate
                            </div>
                          </div>
                        </div>

                        {/* Game History */}
                        {gameHistory.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                              <History className="w-4 h-4" />
                              Recent Games
                            </h4>
                            <div className="space-y-2">
                              {gameHistory.slice(0, 3).map((game, i) => (
                                <div
                                  key={i}
                                  className="text-sm p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>{game.moves} moves</span>
                                  </div>
                                  <div className="text-slate-400">
                                    {game.winner ? `${game.winner} won` : 'Draw'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Streaks & Achievements */}
                        <div className="pt-4 border-t border-white/10">
                          <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Achievements
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {score.x >= 5 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">
                                X Master
                              </span>
                            )}
                            {score.o >= 5 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-pink-500/20 text-pink-300">
                                O Champion
                              </span>
                            )}
                            {score.draws >= 3 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-slate-600/30 text-slate-300">
                                Peacekeeper
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Stats */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-white">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Games</span>
                    <span className="font-semibold text-white">
                      {score.x + score.o + score.draws}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Win Rate</span>
                    <span className="font-semibold text-white">
                      {Math.round(((score.x + score.o) / (score.x + score.o + score.draws || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Current Mode</span>
                    <span className="font-semibold capitalize text-white">
                      {gameMode === "pvp" ? "Player vs Player" :
                        gameMode === "ai" ? "vs AI" : "Online"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Panel - Main Game */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6 md:p-8">
                {/* Game Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-3 h-3 rounded-full animate-pulse",
                      isGameActive
                        ? "bg-emerald-400"
                        : "bg-slate-500"
                    )} />
                    <span className="text-sm text-slate-400">
                      {isGameActive ? "Game Active" : "Game Over"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Mode:</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-white/10">
                      {gameMode.toUpperCase()}
                    </span>
                    {gameMode === "ai" && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-pink-500/20 text-pink-300">
                        {difficulty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Game Status */}
                <div className="mb-8">
                  <GameStatus
                    winner={winner}
                    isDraw={isDraw}
                    currentPlayer={currentPlayer}
                  />
                </div>

                {/* Game Board */}
                <div className={cn(
                  "transition-all duration-300",
                  isResetting && "opacity-50 scale-95"
                )}>
                  <GameBoard
                    board={board}
                    onCellClick={handleCellClick}
                    winningLine={winningLine}
                    currentPlayer={currentPlayer}
                    isGameActive={isGameActive}
                  />
                </div>

                {/* Game Controls */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={resetGame}
                    className="flex-1 py-6 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {winner || isDraw ? "Play Again" : "Reset Game"}
                  </Button>

                  {gameMode === "ai" && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPlayer("X")}
                      className="py-6 border-white/20 hover:bg-white/10"
                    >
                      Take Back Move
                    </Button>
                  )}
                </div>

                {/* Turn Indicator */}
                {isGameActive && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="mt-6 h-1 rounded-full overflow-hidden bg-white/10"
                  >
                    <motion.div
                      animate={{
                        x: ["0%", "100%"],
                      }}
                      transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                      className={cn(
                        "h-full w-1/4 rounded-full",
                        currentPlayer === "X"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                          : "bg-gradient-to-r from-pink-500 to-rose-400"
                      )}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Game Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-200">Pro Tip</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {winner || isDraw
                      ? "Try a different strategy or increase the AI difficulty for more challenge!"
                      : "Control the center (position 4) for better winning opportunities."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-slate-500"
        >
          <p>
            Built with ❤️ by{" "}
            <a
              href="https://github.com/fadil-arch/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              Dev Fadil
            </a>
          </p>

          <p className="mt-2 text-xs text-slate-600">
            © {new Date().getFullYear()} TicTacPro — Modern Tic-Tac-Toe Experience
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}