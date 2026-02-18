import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy, Target } from "lucide-react";

const stats = [
  { label: "Lessons Done", value: "47", icon: <BookOpen className="w-5 h-5" />, color: "text-primary" },
  { label: "Time Spent", value: "12h", icon: <Clock className="w-5 h-5" />, color: "text-xp" },
  { label: "Quizzes Aced", value: "23", icon: <Trophy className="w-5 h-5" />, color: "text-gold" },
  { label: "Accuracy", value: "89%", icon: <Target className="w-5 h-5" />, color: "text-accent" },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="bg-card rounded-2xl p-4 shadow-md border border-border text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.08 }}
        >
          <div className={`${stat.color} flex justify-center mb-2`}>{stat.icon}</div>
          <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
