import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Crown, Shield } from "lucide-react";
import { useGame, getLevel } from "@/contexts/GameContext";

const Achievements = () => {
  const { state } = useGame();
  const level = getLevel(state.xp);
  const accuracy = state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0;

  const achievements = [
    { name: "First Steps", icon: <Star className="w-6 h-6" />, unlocked: state.totalQuizzes >= 1, description: "Complete your first quiz" },
    { name: "On Fire", icon: <Zap className="w-6 h-6" />, unlocked: state.streak >= 7, description: "7-day streak" },
    { name: "Sharpshooter", icon: <Target className="w-6 h-6" />, unlocked: state.todayBest >= 100, description: "100% on a quiz" },
    { name: "Champion", icon: <Trophy className="w-6 h-6" />, unlocked: state.totalQuizzes >= 10, description: "Complete 10 quizzes" },
    { name: "Scholar", icon: <Crown className="w-6 h-6" />, unlocked: level >= 20, description: "Reach level 20" },
    { name: "Guardian", icon: <Shield className="w-6 h-6" />, unlocked: state.streak >= 30, description: "30-day streak" },
  ];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
      <h3 className="font-display text-xl font-bold text-foreground mb-4">🏆 Achievements</h3>
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.name}
            className={`flex flex-col items-center text-center p-3 rounded-xl ${
              ach.unlocked ? "bg-gold/10 border border-gold/30" : "bg-muted/50 opacity-50"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.08, type: "spring" }}
            title={ach.description}
          >
            <div className={`${ach.unlocked ? "text-gold" : "text-muted-foreground"}`}>{ach.icon}</div>
            <p className="text-xs font-bold mt-1 text-foreground">{ach.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
