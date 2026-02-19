import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-gold" />
      ) : (
        <Moon className="w-5 h-5 text-level" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
