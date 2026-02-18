import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Crown, Shield } from "lucide-react";

interface Achievement {
  name: string;
  icon: React.ReactNode;
  unlocked: boolean;
  description: string;
}

const achievements: Achievement[] = [
  { name: "First Steps", icon: <Star className="w-6 h-6" />, unlocked: true, description: "Complete your first lesson" },
  { name: "On Fire", icon: <Zap className="w-6 h-6" />, unlocked: true, description: "7-day streak" },
  { name: "Sharpshooter", icon: <Target className="w-6 h-6" />, unlocked: true, description: "100% on a quiz" },
  { name: "Champion", icon: <Trophy className="w-6 h-6" />, unlocked: false, description: "Win 10 duels" },
  { name: "Scholar", icon: <Crown className="w-6 h-6" />, unlocked: false, description: "Reach level 20" },
  { name: "Guardian", icon: <Shield className="w-6 h-6" />, unlocked: false, description: "30-day streak" },
];

const Achievements = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
      <h3 className="font-display text-xl font-bold text-foreground mb-4">🏆 Achievements</h3>
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.name}
            className={`flex flex-col items-center text-center p-3 rounded-xl ${
              ach.unlocked
                ? "bg-gold/10 border border-gold/30"
                : "bg-muted/50 opacity-50"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.08, type: "spring" }}
            title={ach.description}
          >
            <div className={`${ach.unlocked ? "text-gold" : "text-muted-foreground"}`}>
              {ach.icon}
            </div>
            <p className="text-xs font-bold mt-1 text-foreground">{ach.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
