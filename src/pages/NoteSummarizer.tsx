import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import mascot from "@/assets/mascot.png";

const NoteSummarizer = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!text.trim() || text.trim().length < 50) {
      setError("Please paste at least 50 characters of text to summarize.");
      return;
    }
    setError("");
    setLoading(true);
    setSummary("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("summarize-notes", {
        body: { text: text.trim().slice(0, 10000) },
      });
      if (fnError) throw fnError;
      setSummary(data.summary || "No summary generated.");
    } catch (err: any) {
      setError("Failed to summarize. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" strokeLinejoin="miter" strokeLinecap="square" />
            <img src={mascot} alt="ReadSmart" className="w-8 h-8" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Note Summarizer</h1>
          <FileText className="w-5 h-5 text-primary" strokeLinejoin="miter" strokeLinecap="square" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <p className="text-muted-foreground text-center mb-4">
            Paste your notes or text from a PDF and get a concise summary ✨
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[200px] text-sm"
            placeholder="Paste your notes, textbook passages, or PDF text here..."
            maxLength={10000}
          />

          <div className="flex items-center justify-between mt-2 mb-4">
            <span className="text-xs text-muted-foreground">{text.length}/10,000 characters</span>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>

          <button
            onClick={handleSummarize}
            disabled={loading || text.trim().length < 50}
            className="w-full bg-primary text-primary-foreground font-display font-bold text-lg py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Summarizing...</>
            ) : (
              <><Sparkles className="w-5 h-5" strokeLinejoin="miter" strokeLinecap="square" /> Summarize Notes</>
            )}
          </button>
        </motion.div>

        {summary && (
          <motion.div
            className="bg-card rounded-2xl p-5 shadow-md border border-border"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-foreground">📋 Summary</h3>
              <button onClick={handleCopy} className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm">
                {copied ? <><Check className="w-4 h-4" strokeLinejoin="miter" strokeLinecap="square" /> Copied!</> : <><Copy className="w-4 h-4" strokeLinejoin="miter" strokeLinecap="square" /> Copy</>}
              </button>
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">{summary}</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NoteSummarizer;
