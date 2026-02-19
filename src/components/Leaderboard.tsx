import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import { useGame, getRank } from "@/contexts/GameContext";

interface Player {
  name: string;
  xp: number;
  avatar: string;
  isYou?: boolean;
}

const medalColors: Record<number, string> = {
  1: "text-gold",
  2: "text-muted-foreground",
  3: "text-accent",
};

const Leaderboard = () => {
  const { state, npcs } = useGame();

  const players: Player[] = [
    ...npcs.map((npc) => ({ name: npc.name, xp: npc.xp, avatar: npc.avatar })),
    { name: "You", xp: state.xp, avatar: "🦉", isYou: true },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
      <h3 className="font-display text-xl font-bold text-foreground mb-4">🏅 Leaderboard</h3>
      <div className="space-y-2">
        {players.map((player, i) => {
          const rank = i + 1;
          const playerRank = getRank(player.xp);
          return (
            <motion.div
              key={player.name}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                player.isYou
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-muted/30"
              }`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              {rank <= 3 ? (
                <Medal className={`w-5 h-5 ${medalColors[rank]}`} />
              ) : (
                <span className="w-5 text-center text-sm font-bold text-muted-foreground">{rank}</span>
              )}
              <span className="text-xl">{player.avatar}</span>
              <span className={`flex-1 font-semibold text-sm ${player.isYou ? "text-primary" : "text-foreground"}`}>
                {player.name} {player.isYou && "⭐"}
              </span>
              <span className="text-xs" title={playerRank.name}>{playerRank.emoji}</span>
              <span className="text-sm font-bold text-gold">{player.xp.toLocaleString()} XP</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
