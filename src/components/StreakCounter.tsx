import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
}

const StreakCounter = ({ days }: StreakCounterProps) => {
  return (
    <motion.div
      className="flex items-center gap-3 bg-card rounded-2xl px-5 py-4 shadow-md border border-border"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
    >
      <div className="relative">
        <Flame className="w-10 h-10 text-streak" />
        {days >= 7 && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full animate-pulse-glow"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground">{days}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Day Streak</p>
      </div>
    </motion.div>
  );
};

export default StreakCounter;
