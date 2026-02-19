import { motion } from "framer-motion";
import { BookOpen, Trophy, Target, Flame } from "lucide-react";
import { useGame, getRank } from "@/contexts/GameContext";

const StatsCards = () => {
  const { state } = useGame();
  const accuracy = state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0;
  const rank = getRank(state.xp);

  const stats = [
    { label: "Quizzes Done", value: state.totalQuizzes.toString(), icon: <BookOpen className="w-5 h-5" />, color: "text-primary" },
    { label: "Streak", value: `${state.streak}🔥`, icon: <Flame className="w-5 h-5" />, color: "text-streak" },
    { label: "Accuracy", value: `${accuracy}%`, icon: <Target className="w-5 h-5" />, color: "text-accent" },
    { label: "Rank", value: rank.name, icon: <Trophy className="w-5 h-5" />, color: "text-gold" },
  ];

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
