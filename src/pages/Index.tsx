import { motion } from "framer-motion";
import mascot from "@/assets/mascot.png";
import XpBar from "@/components/XpBar";
import StreakCounter from "@/components/StreakCounter";
import StatsCards from "@/components/StatsCards";
import DailyQuests from "@/components/DailyQuests";
import SubjectCards from "@/components/SubjectCards";
import Leaderboard from "@/components/Leaderboard";
import Achievements from "@/components/Achievements";
import ThemeToggle from "@/components/ThemeToggle";
import { useGame, getLevel, getXpInLevel, getRank } from "@/contexts/GameContext";

const Index = () => {
  const { state } = useGame();
  const level = getLevel(state.xp);
  const xpInLevel = getXpInLevel(state.xp);
  const rank = getRank(state.xp);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={mascot} alt="ReadSmart mascot" className="w-10 h-10" />
            <h1 className="font-display text-xl font-bold text-foreground">ReadSmart</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/10" title={rank.name}>
              {rank.emoji} {rank.name}
            </span>
            <span className="text-sm font-bold text-gold bg-gold/10 px-3 py-1.5 rounded-full">
              ⚡ {state.xp.toLocaleString()} XP
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
            Welcome back, Adventurer! 👋
          </h2>
          <p className="text-muted-foreground mb-4">Ready for today's quests?</p>
          <XpBar current={xpInLevel} max={500} level={level} />
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4">
          <StreakCounter days={state.streak} />
          <div className="flex-1">
            <StatsCards />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DailyQuests />
            <Achievements />
          </div>
          <div className="space-y-6">
            <SubjectCards />
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
