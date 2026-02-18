import { motion } from "framer-motion";
import { Medal } from "lucide-react";

interface Player {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isYou?: boolean;
}

const players: Player[] = [
  { rank: 1, name: "Luna", xp: 4280, avatar: "🦊" },
  { rank: 2, name: "Max", xp: 3950, avatar: "🐲" },
  { rank: 3, name: "You", xp: 3720, avatar: "🦉", isYou: true },
  { rank: 4, name: "Aria", xp: 3400, avatar: "🦋" },
  { rank: 5, name: "Leo", xp: 3100, avatar: "🦁" },
];

const medalColors: Record<number, string> = {
  1: "text-gold",
  2: "text-muted-foreground",
  3: "text-accent",
};

const Leaderboard = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
      <h3 className="font-display text-xl font-bold text-foreground mb-4">🏅 Leaderboard</h3>
      <div className="space-y-2">
        {players.map((player, i) => (
          <motion.div
            key={player.rank}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              player.isYou
                ? "bg-primary/10 border border-primary/30"
                : "bg-muted/30"
            }`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            {player.rank <= 3 ? (
              <Medal className={`w-5 h-5 ${medalColors[player.rank]}`} />
            ) : (
              <span className="w-5 text-center text-sm font-bold text-muted-foreground">{player.rank}</span>
            )}
            <span className="text-xl">{player.avatar}</span>
            <span className={`flex-1 font-semibold text-sm ${player.isYou ? "text-primary" : "text-foreground"}`}>
              {player.name} {player.isYou && "⭐"}
            </span>
            <span className="text-sm font-bold text-gold">{player.xp.toLocaleString()} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
