"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Player = "X" | "O" | null;

type Props = {
  board: Player[];
  onCellClick: (index: number) => void;
  winningLine?: number[] | null;
  currentPlayer?: Player;
  isGameActive?: boolean;
};

export default function GameBoard({ 
  board, 
  onCellClick, 
  winningLine = null,
  currentPlayer = null,
  isGameActive = true
}: Props) {
  const [lastMove, setLastMove] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  useEffect(() => {
    // Find the last move made
    const lastIndex = board.findIndex((cell, i) => cell !== null);
    if (lastIndex !== -1) {
      setLastMove(lastIndex);
    }
  }, [board]);

  const getCellColor = (index: number) => {
    if (winningLine?.includes(index)) {
      return board[index] === "X" 
        ? "bg-gradient-to-br from-blue-500 to-cyan-400 border-blue-400" 
        : "bg-gradient-to-br from-pink-500 to-rose-400 border-pink-400";
    }
    if (board[index] === "X") {
      return "bg-blue-500/10 border-blue-400/30 hover:border-blue-400/50";
    }
    if (board[index] === "O") {
      return "bg-pink-500/10 border-pink-400/30 hover:border-pink-400/50";
    }
    return "bg-white/5 border-white/10 hover:border-white/30";
  };

  const getCellGlow = (index: number) => {
    if (winningLine?.includes(index)) {
      return board[index] === "X"
        ? "shadow-[0_0_30px_rgba(59,130,246,0.5)]"
        : "shadow-[0_0_30px_rgba(236,72,153,0.5)]";
    }
    if (index === lastMove) {
      return board[index] === "X"
        ? "shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        : "shadow-[0_0_20px_rgba(236,72,153,0.3)]";
    }
    return "";
  };

  const getHoverPreview = (index: number) => {
    if (!isGameActive || board[index] || hoveredCell !== index) return null;
    
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {currentPlayer === "X" ? (
          <X className="w-12 h-12 text-blue-400/30" />
        ) : (
          <Circle className="w-12 h-12 text-pink-400/30" />
        )}
      </motion.div>
    );
  };

  const getCellContent = (cell: Player, index: number) => {
    if (!cell) return null;

    const Icon = cell === "X" ? X : Circle;
    const isWinningCell = winningLine?.includes(index);
    const isRecentMove = index === lastMove;

    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
          }
        }}
        whileHover={{ scale: isWinningCell ? 1.1 : 1.05 }}
        className="relative"
      >
        <Icon className={cn(
          "w-16 h-16",
          cell === "X" 
            ? "text-blue-400" 
            : "text-pink-400",
          isWinningCell && "drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        )} />
        
        {/* Winning cell effect */}
        {isWinningCell && (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity 
            }}
            className={cn(
              "absolute inset-0 -z-10 rounded-xl blur-md",
              cell === "X" 
                ? "bg-blue-500" 
                : "bg-pink-500"
            )}
          />
        )}

        {/* Recent move pulse */}
        {isRecentMove && !isWinningCell && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 -z-10 rounded-xl border-2 border-current opacity-30"
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10">
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-3 h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                backgroundColor: [
                  "rgba(255,255,255,0.02)",
                  "rgba(255,255,255,0.05)",
                  "rgba(255,255,255,0.02)"
                ]
              }}
              transition={{ 
                duration: 2 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.1
              }}
              className="border border-white/5"
            />
          ))}
        </div>
      </div>

      {/* Game board */}
      <div className="grid grid-cols-3 gap-4 relative z-10">
        {board.map((cell, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            whileHover={{ 
              scale: !cell && isGameActive ? 1.05 : 1,
              transition: { type: "spring", stiffness: 400 }
            }}
            onHoverStart={() => isGameActive && !cell && setHoveredCell(index)}
            onHoverEnd={() => setHoveredCell(null)}
            className="relative"
          >
            <Button
              variant="ghost"
              size="lg"
              disabled={!!cell || !isGameActive}
              onClick={() => onCellClick(index)}
              className={cn(
                "h-32 w-full relative overflow-hidden border-2 transition-all duration-300",
                "disabled:cursor-default disabled:opacity-100",
                getCellColor(index),
                getCellGlow(index),
                !cell && isGameActive && "hover:shadow-lg"
              )}
            >
              {/* Hover preview */}
              {getHoverPreview(index)}

              {/* Cell content */}
              <AnimatePresence mode="wait">
                {getCellContent(cell, index)}
              </AnimatePresence>

              {/* Empty state indicator */}
              {!cell && isGameActive && (
                <motion.div
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/20" />
                </motion.div>
              )}

              {/* Winning line connection dots */}
              {winningLine && winningLine.includes(index) && (
                <>
                  {winningLine.indexOf(index) < winningLine.length - 1 && (
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          cell === "X" ? "bg-blue-400" : "bg-pink-400"
                        )}
                      />
                    </div>
                  )}
                </>
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Floating particles for ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              x: [null, Math.random() * 100 + "%"],
              y: [null, Math.random() * 100 + "%"],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
          />
        ))}
      </div>

      {/* Board glow effect on game end */}
      {winningLine && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute inset-0 -z-10 rounded-2xl blur-xl"
          style={{
            background: board[winningLine[0]] === "X"
              ? "radial-gradient(circle at center, rgba(59,130,246,0.5) 0%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(236,72,153,0.5) 0%, transparent 70%)"
          }}
        />
      )}
    </div>
  );
}