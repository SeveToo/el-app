import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartItem } from "./types";

interface HeartDropProps {
  heart: HeartItem;
  onCollect: (id: string) => void;
}

export const HeartDrop: React.FC<HeartDropProps> = ({ heart, onCollect }) => {
  const [timeLeft, setTimeLeft] = useState(heart.duration);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - heart.startTime;
      const remaining = Math.max(0, heart.duration - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, [heart.startTime, heart.duration]);

  const progress = (timeLeft / heart.duration) * 100;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ y: -100, scale: 0, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
      className="absolute z-[60] cursor-pointer group"
      onClick={() => onCollect(heart.id)}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Pulsing Glow */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-danger/20 rounded-full blur-xl"
        />

        {/* Progress Circle */}
        <svg className="absolute w-full h-full -rotate-90 z-0">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-default-200"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-danger transition-all duration-75"
          />
        </svg>

        {/* Heart Icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="text-3xl filter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10"
        >
          ❤️
        </motion.div>
      </div>
    </motion.div>
  );
};
