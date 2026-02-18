import { motion } from "framer-motion";

interface XpBarProps {
  current: number;
  max: number;
  level: number;
}

const XpBar = ({ current, max, level }: XpBarProps) => {
  const percentage = (current / max) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-level text-level-foreground font-display font-bold text-xl shadow-lg">
        {level}
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-semibold text-muted-foreground">Level {level}</span>
          <span className="text-sm font-bold text-xp">{current} / {max} XP</span>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-xp to-primary"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default XpBar;
