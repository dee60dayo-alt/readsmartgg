import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Play, CheckCircle2, XCircle, Trophy } from "lucide-react";
import mascot from "@/assets/mascot.png";

interface CustomQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  subject?: string;
}

const STORAGE_KEY = "readsmart_custom_questions";
const SUBJECTS = ["Math", "Reading", "Science", "Geography", "Art", "Music"];

function loadQuestions(): CustomQuestion[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

const CustomQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<CustomQuestion[]>(loadQuestions);
  const [mode, setMode] = useState<"list" | "create" | "play">("list");

  const [newQ, setNewQ] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);

  const [playIdx, setPlayIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(questions)); }, [questions]);

  const handleSave = () => {
    if (!newQ.trim() || opts.some((o) => !o.trim())) return;
    const q: CustomQuestion = { id: Date.now().toString(), question: newQ.trim(), options: opts.map((o) => o.trim()), correct: correctIdx, subject: selectedSubject };
    setQuestions((prev) => [...prev, q]);
    setNewQ("");
    setOpts(["", "", "", ""]);
    setCorrectIdx(0);
    setMode("list");
  };

  const handleDelete = (id: string) => { setQuestions((prev) => prev.filter((q) => q.id !== id)); };

  const startPlay = () => { setPlayIdx(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); setMode("play"); };

  const handleSelect = (i: number) => { if (answered) return; setSelected(i); setAnswered(true); if (i === questions[playIdx].correct) setScore((s) => s + 1); };

  const handleNext = () => {
    if (playIdx + 1 >= questions.length) { setFinished(true); }
    else { setPlayIdx((i) => i + 1); setSelected(null); setAnswered(false); }
  };

  if (mode === "play" && finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div className="bg-card rounded-2xl p-8 shadow-lg border border-border max-w-md w-full text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Trophy className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Challenge Done!</h2>
          <div className="text-5xl font-display font-bold text-primary mb-2">{pct}%</div>
          <p className="text-muted-foreground mb-4">{score}/{questions.length} correct</p>
          <div className="flex gap-3">
            <button onClick={() => setMode("list")} className="flex-1 bg-muted text-foreground font-bold py-3 rounded-xl hover:bg-muted/80 transition-colors">Back</button>
            <button onClick={startPlay} className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">Retry</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (mode === "play") {
    const current = questions[playIdx];
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setMode("list")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="font-display text-lg font-bold text-foreground">Your Challenge</h1>
            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{playIdx + 1}/{questions.length}</span>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-xp to-primary" animate={{ width: `${((playIdx + 1) / questions.length) * 100}%` }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={playIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-6">{current.question}</h2>
              <div className="space-y-3">
                {current.options.map((opt, i) => {
                  let borderClass = "border-border";
                  let bgClass = "bg-card hover:bg-primary/5";
                  if (answered) {
                    if (i === current.correct) { borderClass = "border-primary"; bgClass = "bg-primary/10"; }
                    else if (i === selected) { borderClass = "border-destructive"; bgClass = "bg-destructive/10"; }
                  }
                  return (
                    <motion.button key={i} className={`w-full text-left p-4 rounded-xl border-2 ${borderClass} ${bgClass} transition-colors flex items-center gap-3`} onClick={() => handleSelect(i)}>
                      <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground shrink-0">{String.fromCharCode(65 + i)}</span>
                      <span className="font-semibold text-foreground flex-1">{opt}</span>
                      {answered && i === current.correct && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                      {answered && i === selected && i !== current.correct && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
              {answered && (
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6">
                  <button onClick={handleNext} className="w-full bg-primary text-primary-foreground font-display font-bold text-lg py-4 rounded-xl hover:opacity-90 transition-opacity">
                    {playIdx + 1 >= questions.length ? "See Results" : "Next Question →"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setMode("list")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="font-display text-lg font-bold text-foreground">Create Question</h1>
            <div className="w-5" />
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground mb-1 block">Subject</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button key={s} onClick={() => setSelectedSubject(s)} className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${selectedSubject === s ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground mb-1 block">Question</label>
            <textarea value={newQ} onChange={(e) => setNewQ(e.target.value)} className="w-full bg-card border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows={3} placeholder="Type your question here..." maxLength={500} />
          </div>
          {opts.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <button type="button" onClick={() => setCorrectIdx(i)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${correctIdx === i ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{String.fromCharCode(65 + i)}</button>
              <input value={opt} onChange={(e) => { const newOpts = [...opts]; newOpts[i] = e.target.value; setOpts(newOpts); }} className="flex-1 bg-card border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder={`Option ${String.fromCharCode(65 + i)}`} maxLength={200} />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Tap a letter to mark the correct answer. Question will be added to <span className="font-bold text-primary">{selectedSubject}</span>.</p>
          <button onClick={handleSave} disabled={!newQ.trim() || opts.some((o) => !o.trim())} className="w-full bg-primary text-primary-foreground font-display font-bold text-lg py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40">Save Question ✓</button>
        </main>
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
          <h1 className="font-display text-lg font-bold text-foreground">My Questions</h1>
          <div className="w-8" />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex gap-3">
          <button onClick={() => setMode("create")} className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> New Question
          </button>
          {questions.length >= 2 && (
            <button onClick={startPlay} className="flex-1 bg-gold text-gold-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Play ({questions.length})
            </button>
          )}
        </div>
        {questions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">✏️</p>
            <p className="font-display font-bold text-foreground text-lg">No questions yet</p>
            <p className="text-muted-foreground text-sm">Create your own questions to challenge yourself!</p>
          </div>
        )}
        {questions.map((q, i) => (
          <motion.div key={q.id} className="bg-card rounded-2xl p-4 shadow-md border border-border" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {q.subject && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1 inline-block">{q.subject}</span>}
                <p className="font-semibold text-foreground text-sm mb-2">{q.question}</p>
                <div className="grid grid-cols-2 gap-1">
                  {q.options.map((opt, j) => (
                    <span key={j} className={`text-xs px-2 py-1 rounded ${j === q.correct ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"}`}>{String.fromCharCode(65 + j)}. {opt}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(q.id)} className="text-destructive hover:text-destructive/80 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default CustomQuestions;
