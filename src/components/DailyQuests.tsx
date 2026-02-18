import { motion } from "framer-motion";
import { CheckCircle2, Circle, Sword, BookOpen, Brain, Zap } from "lucide-react";

interface Quest {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  icon: "sword" | "book" | "brain" | "zap";
}

const iconMap = {
  sword: Sword,
  book: BookOpen,
  brain: Brain,
  zap: Zap,
};

const quests: Quest[] = [
  { id: "1", title: "Complete a Math lesson", xp: 50, completed: true, icon: "brain" },
  { id: "2", title: "Read for 10 minutes", xp: 30, completed: true, icon: "book" },
  { id: "3", title: "Win a vocabulary duel", xp: 75, completed: false, icon: "sword" },
  { id: "4", title: "Speed challenge: Science", xp: 100, completed: false, icon: "zap" },
];

const DailyQuests = () => {
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold text-foreground">⚔️ Daily Quests</h3>
        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
          {completedCount}/{quests.length}
        </span>
      </div>
      <div className="space-y-3">
        {quests.map((quest, i) => {
          const Icon = iconMap[quest.icon];
          return (
            <motion.div
              key={quest.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                quest.completed
                  ? "bg-primary/5 opacity-70"
                  : "bg-muted hover:bg-primary/10 cursor-pointer"
              }`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={!quest.completed ? { scale: 1.02 } : {}}
              whileTap={!quest.completed ? { scale: 0.98 } : {}}
            >
              <Icon className="w-5 h-5 text-primary shrink-0" />
              <span className={`flex-1 font-semibold text-sm ${quest.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {quest.title}
              </span>
              <span className="text-xs font-bold text-gold">+{quest.xp} XP</span>
              {quest.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyQuests;
