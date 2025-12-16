"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Circle, X, Minus } from "lucide-react";


type Props = {
  winner: "X" | "O" | null;
  isDraw: boolean;
  currentPlayer: "X" | "O" | null;
};

export default function GameStatus({
  winner,
  isDraw,
  currentPlayer,
}: Props) {
  const StatusIcon = () => {
    if (winner === "X") return <X className="w-5 h-5" />;
    if (winner === "O") return <Circle className="w-5 h-5" />;
    if (isDraw) return <Minus className="w-5 h-5 rotate-90" />;
    return currentPlayer === "X" 
      ? <X className="w-5 h-5" />
      : <Circle className="w-5 h-5" />;
  };

  const getStatusText = () => {
    if (winner) return `${winner} Wins!`;
    if (isDraw) return "Draw Game";
    return `${currentPlayer}'s Turn`;
  };

  const getPulseColor = () => {
    if (winner) return winner === "X" ? "bg-blue-500" : "bg-pink-500";
    if (isDraw) return "bg-slate-500";
    return currentPlayer === "X" ? "bg-blue-500" : "bg-pink-500";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={winner ? "winner" : isDraw ? "draw" : currentPlayer}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm"
      >
        {/* Animated Pulse */}
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className={`w-3 h-3 rounded-full ${getPulseColor()}`} />
          <div className={`absolute inset-0 rounded-full ${getPulseColor()} blur-sm`} />
        </motion.div>

        {/* Status Icon */}
        <motion.div
          animate={!winner && !isDraw ? { rotate: [0, 360] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <StatusIcon />
        </motion.div>

        {/* Status Text */}
        <motion.p
          animate={winner ? { 
            scale: [1, 1.1, 1],
            transition: { duration: 0.5, repeat: 3 }
          } : {}}
          className="font-semibold"
        >
          {getStatusText()}
        </motion.p>

        {/* Turn Indicator */}
        {!winner && !isDraw && (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="ml-auto text-xs text-slate-400"
          >
            Your move
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}