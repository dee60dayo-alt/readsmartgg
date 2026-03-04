import { motion } from "framer-motion";
import { Calculator, BookText, Atom, Globe, Palette, Music, Swords, FlaskConical, Map, Brush, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";

interface Subject {
  name: string;
  icon: React.ReactNode;
  color: string;
  emoji: string;
  lessons: number;
}

const subjects: Subject[] = [
  { name: "Math", icon: <Calculator className="w-7 h-7" />, color: "from-xp to-primary", emoji: "⚔️", lessons: 24 },
  { name: "Reading", icon: <BookText className="w-7 h-7" />, color: "from-accent to-streak", emoji: "📜", lessons: 18 },
  { name: "Science", icon: <FlaskConical className="w-7 h-7" />, color: "from-primary to-level", emoji: "🧪", lessons: 20 },
  { name: "Geography", icon: <Map className="w-7 h-7" />, color: "from-gold to-streak", emoji: "🗺️", lessons: 15 },
  { name: "Art", icon: <Brush className="w-7 h-7" />, color: "from-level to-accent", emoji: "🎨", lessons: 12 },
  { name: "Music", icon: <Headphones className="w-7 h-7" />, color: "from-streak to-gold", emoji: "🎵", lessons: 10 },
];

const SubjectCards = () => {
  const navigate = useNavigate();
  const { state } = useGame();

  return (
    <div>
      <h3 className="font-display text-xl font-bold text-foreground mb-4">⚔️ Quests</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {subjects.map((subject, i) => {
          const played = state.subjectsPlayed.includes(subject.name);
          return (
            <motion.div
              key={subject.name}
              className="bg-card rounded-2xl p-4 shadow-md border border-border cursor-pointer group relative overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -4, boxShadow: "0 8px 30px -10px hsl(var(--primary) / 0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/quiz/${subject.name}`)}
            >
              <div className="absolute top-2 right-2 text-lg">{subject.emoji}</div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-primary-foreground mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                {subject.icon}
              </div>
              <p className="font-display font-bold text-foreground">{subject.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{subject.lessons} lessons</p>
              {played && <span className="text-xs font-bold text-primary">✓ Played</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectCards;
