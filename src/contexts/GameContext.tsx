import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface NPC {
  name: string;
  avatar: string;
  xp: number;
  baseGrowth: [number, number]; // min-max XP gained per quiz you play
}

export interface DailyQuest {
  id: string;
  title: string;
  xp: number;
  icon: "sword" | "book" | "brain" | "zap";
  check: (state: GameState) => boolean;
}

export type Rank = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Elite";

export interface GameState {
  xp: number;
  totalQuizzes: number;
  totalCorrect: number;
  totalAnswered: number;
  streak: number;
  lastPlayDate: string | null;
  subjectsPlayed: string[];
  todayQuizzes: number;
  todayBest: number;
  npcXp: Record<string, number>;
}

const DEFAULT_STATE: GameState = {
  xp: 0,
  totalQuizzes: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  streak: 1,
  lastPlayDate: null,
  subjectsPlayed: [],
  todayQuizzes: 0,
  todayBest: 0,
  npcXp: {
    Luna: 500,
    Max: 300,
    Aria: 200,
    Leo: 100,
  },
};

const NPC_PROFILES: NPC[] = [
  { name: "Luna", avatar: "🦊", xp: 500, baseGrowth: [50, 150] },
  { name: "Max", avatar: "🐲", xp: 300, baseGrowth: [40, 120] },
  { name: "Aria", avatar: "🦋", xp: 200, baseGrowth: [30, 100] },
  { name: "Leo", avatar: "🦁", xp: 100, baseGrowth: [20, 80] },
];

export const RANKS: { name: Rank; minXp: number; emoji: string; color: string }[] = [
  { name: "Bronze", minXp: 0, emoji: "🥉", color: "text-accent" },
  { name: "Silver", minXp: 1000, emoji: "🥈", color: "text-muted-foreground" },
  { name: "Gold", minXp: 2500, emoji: "🥇", color: "text-gold" },
  { name: "Platinum", minXp: 5000, emoji: "💎", color: "text-xp" },
  { name: "Diamond", minXp: 10000, emoji: "💠", color: "text-level" },
  { name: "Elite", minXp: 20000, emoji: "👑", color: "text-primary" },
];

export function getRank(xp: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) return RANKS[i];
  }
  return RANKS[0];
}

export function getLevel(xp: number) {
  return Math.floor(xp / 500) + 1;
}

export function getXpInLevel(xp: number) {
  return xp % 500;
}

const ENCOURAGEMENTS = [
  "🔥 Amazing work! You're on fire!",
  "🌟 Brilliant! Keep that momentum going!",
  "💪 Outstanding performance! You're a natural!",
  "🎯 Incredible accuracy! You're mastering this!",
  "🚀 Sky's the limit! Keep reaching higher!",
  "⭐ Superstar! That was impressive!",
  "🏆 Champion level performance!",
  "✨ You're shining bright! Great job!",
];

export function getEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

interface GameContextType {
  state: GameState;
  npcs: NPC[];
  completeQuiz: (subject: string, correct: number, total: number) => number; // returns XP earned
  getDailyQuests: () => (DailyQuest & { completed: boolean })[];
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

function loadState(): GameState {
  try {
    const saved = localStorage.getItem("readsmart_game");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset daily counters if it's a new day
      const today = new Date().toDateString();
      if (parsed.lastPlayDate !== today) {
        parsed.todayQuizzes = 0;
        parsed.todayBest = 0;
      }
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_STATE };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    localStorage.setItem("readsmart_game", JSON.stringify(state));
  }, [state]);

  const npcs: NPC[] = NPC_PROFILES.map((npc) => ({
    ...npc,
    xp: state.npcXp[npc.name] ?? npc.xp,
  }));

  const completeQuiz = useCallback((subject: string, correct: number, total: number) => {
    const percentage = Math.round((correct / total) * 100);
    const xpEarned = Math.round(percentage * 2); // Max 200 XP per quiz

    setState((prev) => {
      const today = new Date().toDateString();
      const isNewDay = prev.lastPlayDate !== today;
      const newStreak = isNewDay
        ? prev.lastPlayDate
          ? (() => {
              const last = new Date(prev.lastPlayDate);
              const now = new Date();
              const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
              return diffDays === 1 ? prev.streak + 1 : 1;
            })()
          : 1
        : prev.streak;

      // NPCs grow when you play
      const newNpcXp = { ...prev.npcXp };
      NPC_PROFILES.forEach((npc) => {
        const [min, max] = npc.baseGrowth;
        newNpcXp[npc.name] = (newNpcXp[npc.name] ?? npc.xp) + Math.floor(Math.random() * (max - min) + min);
      });

      const newSubjects = prev.subjectsPlayed.includes(subject)
        ? prev.subjectsPlayed
        : [...prev.subjectsPlayed, subject];

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        totalQuizzes: prev.totalQuizzes + 1,
        totalCorrect: prev.totalCorrect + correct,
        totalAnswered: prev.totalAnswered + total,
        streak: newStreak,
        lastPlayDate: today,
        subjectsPlayed: newSubjects,
        todayQuizzes: (isNewDay ? 0 : prev.todayQuizzes) + 1,
        todayBest: Math.max(isNewDay ? 0 : prev.todayBest, percentage),
        npcXp: newNpcXp,
      };
    });

    return Math.round(percentage * 2);
  }, []);

  const getDailyQuests = useCallback((): (DailyQuest & { completed: boolean })[] => {
    const quests: DailyQuest[] = [
      { id: "q1", title: "Complete a quiz", xp: 50, icon: "brain", check: (s) => s.todayQuizzes >= 1 },
      { id: "q2", title: "Score 80%+ on a quiz", xp: 75, icon: "zap", check: (s) => s.todayBest >= 80 },
      { id: "q3", title: "Complete 3 quizzes", xp: 100, icon: "sword", check: (s) => s.todayQuizzes >= 3 },
      { id: "q4", title: "Try a new subject", xp: 60, icon: "book", check: (s) => s.subjectsPlayed.length >= 2 },
    ];
    return quests.map((q) => ({ ...q, completed: q.check(state) }));
  }, [state]);

  const resetGame = useCallback(() => {
    setState({ ...DEFAULT_STATE });
    localStorage.removeItem("readsmart_game");
  }, []);

  return (
    <GameContext.Provider value={{ state, npcs, completeQuiz, getDailyQuests, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
