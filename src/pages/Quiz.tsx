import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { subjectQuestions } from "@/data/questions";
import mascot from "@/assets/mascot.png";

const Quiz = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const questions = useMemo(() => subjectQuestions[subject || ""] || [], [subject]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    if (optionIndex === current.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (!subject || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground font-display text-xl">Subject not found.</p>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          className="bg-card rounded-3xl p-8 shadow-lg border border-border max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Trophy className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-4">{subject}</p>
          <div className="text-5xl font-display font-bold text-primary mb-2">{percentage}%</div>
          <p className="text-muted-foreground mb-6">
            {score} / {questions.length} correct
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-muted text-foreground font-bold py-3 rounded-xl hover:bg-muted/80 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelected(null);
                setAnswered(false);
                setScore(0);
                setFinished(false);
              }}
              className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <img src={mascot} alt="ReadSmart" className="w-8 h-8" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">{subject}</h1>
          <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-xp to-primary"
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
              {current.question}
            </h2>

            <div className="space-y-3">
              {current.options.map((option, i) => {
                let borderClass = "border-border";
                let bgClass = "bg-card hover:bg-primary/5";

                if (answered) {
                  if (i === current.correct) {
                    borderClass = "border-primary";
                    bgClass = "bg-primary/10";
                  } else if (i === selected && i !== current.correct) {
                    borderClass = "border-destructive";
                    bgClass = "bg-destructive/10";
                  }
                } else if (i === selected) {
                  borderClass = "border-primary";
                  bgClass = "bg-primary/10";
                }

                return (
                  <motion.button
                    key={i}
                    className={`w-full text-left p-4 rounded-xl border-2 ${borderClass} ${bgClass} transition-colors flex items-center gap-3`}
                    onClick={() => handleSelect(i)}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                  >
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-semibold text-foreground flex-1">{option}</span>
                    {answered && i === current.correct && (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    )}
                    {answered && i === selected && i !== current.correct && (
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {answered && (
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6">
                <button
                  onClick={handleNext}
                  className="w-full bg-primary text-primary-foreground font-display font-bold text-lg py-4 rounded-xl hover:opacity-90 transition-opacity"
                >
                  {currentIndex + 1 >= questions.length ? "See Results" : "Next Question →"}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 text-center">
          <span className="text-sm font-bold text-gold">Score: {score}/{currentIndex + (answered ? 1 : 0)}</span>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
