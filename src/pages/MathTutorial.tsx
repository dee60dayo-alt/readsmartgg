import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronLeft, Calculator, Lightbulb } from "lucide-react";
import mascot from "@/assets/mascot.png";

interface TutorialStep {
  title: string;
  explanation: string;
  example: string;
  tip: string;
}

interface TutorialTopic {
  name: string;
  emoji: string;
  steps: TutorialStep[];
}

const tutorials: TutorialTopic[] = [
  {
    name: "Order of Operations (BODMAS)",
    emoji: "🔢",
    steps: [
      { title: "What is BODMAS?", explanation: "BODMAS stands for Brackets, Orders (powers), Division, Multiplication, Addition, Subtraction. It tells you the order to solve math problems.", example: "In 3 + 4 × 2, you multiply first: 4 × 2 = 8, then add: 3 + 8 = 11", tip: "Think of it as a priority list — some operations are more important!" },
      { title: "Brackets First", explanation: "Always solve what's inside brackets (parentheses) before anything else.", example: "(3 + 4) × 2 = 7 × 2 = 14", tip: "Brackets are like VIPs — they always go first!" },
      { title: "Orders (Powers & Roots)", explanation: "After brackets, handle exponents (powers) and square roots.", example: "2 + 3² = 2 + 9 = 11", tip: "Powers make numbers grow fast — handle them early!" },
      { title: "Division & Multiplication", explanation: "These are equal priority — work left to right.", example: "12 ÷ 3 × 2 = 4 × 2 = 8 (left to right)", tip: "Don't always multiply first! Go left to right." },
      { title: "Addition & Subtraction", explanation: "Last priority — also work left to right.", example: "10 - 3 + 5 = 7 + 5 = 12", tip: "These are the final steps in any calculation." },
    ],
  },
  {
    name: "Fractions Made Easy",
    emoji: "🍕",
    steps: [
      { title: "What is a Fraction?", explanation: "A fraction represents parts of a whole. The top number (numerator) shows how many parts you have, the bottom (denominator) shows total equal parts.", example: "3/4 means 3 out of 4 equal parts", tip: "Think of a pizza cut into slices!" },
      { title: "Adding Fractions", explanation: "To add fractions with the same denominator, just add the numerators. With different denominators, find the LCD first.", example: "1/4 + 2/4 = 3/4 | 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2", tip: "Same bottom? Just add the top numbers!" },
      { title: "Subtracting Fractions", explanation: "Same rules as addition — match denominators, then subtract numerators.", example: "5/8 - 2/8 = 3/8", tip: "Make sure denominators match first!" },
      { title: "Multiplying Fractions", explanation: "Multiply numerators together and denominators together. Simplify if possible.", example: "2/3 × 3/4 = 6/12 = 1/2", tip: "Multiplication is the easiest fraction operation!" },
      { title: "Dividing Fractions", explanation: "Flip the second fraction (reciprocal) and multiply.", example: "2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6", tip: "Keep, Change, Flip — KCF!" },
    ],
  },
  {
    name: "Percentages",
    emoji: "💯",
    steps: [
      { title: "What is a Percentage?", explanation: "Percentage means 'per hundred'. 50% means 50 out of 100.", example: "50% = 50/100 = 0.5", tip: "Percent literally means 'per cent' (per hundred)!" },
      { title: "Converting to Percentage", explanation: "Multiply a decimal by 100 or a fraction by 100.", example: "0.75 × 100 = 75% | 3/4 × 100 = 75%", tip: "Move the decimal point 2 places right!" },
      { title: "Finding Percentage of a Number", explanation: "Convert the percentage to a decimal, then multiply.", example: "25% of 200 = 0.25 × 200 = 50", tip: "Divide the percentage by 100 first, then multiply!" },
      { title: "Percentage Increase", explanation: "Find the difference, divide by original, multiply by 100.", example: "Price went from $50 to $65: (65-50)/50 × 100 = 30% increase", tip: "Always divide by the ORIGINAL amount!" },
      { title: "Percentage Decrease", explanation: "Same method but the value went down.", example: "Price went from $80 to $60: (80-60)/80 × 100 = 25% decrease", tip: "The original value is always your base!" },
    ],
  },
  {
    name: "Algebra Basics",
    emoji: "🔤",
    steps: [
      { title: "What is Algebra?", explanation: "Algebra uses letters (variables) to represent unknown numbers. You solve equations to find these unknowns.", example: "x + 5 = 12, so x = 7", tip: "Think of x as a mystery number you need to find!" },
      { title: "Solving One-Step Equations", explanation: "Do the opposite operation to isolate the variable.", example: "x + 7 = 15 → x = 15 - 7 → x = 8", tip: "Whatever you do to one side, do to the other!" },
      { title: "Solving Two-Step Equations", explanation: "Undo addition/subtraction first, then multiplication/division.", example: "3x + 4 = 19 → 3x = 15 → x = 5", tip: "Reverse BODMAS — undo addition before multiplication!" },
      { title: "Simplifying Expressions", explanation: "Combine like terms — terms with the same variable.", example: "3x + 2x + 5 = 5x + 5", tip: "Only combine terms that have the same letter!" },
      { title: "Substitution", explanation: "Replace variables with given values and calculate.", example: "If x = 3, then 2x + 4 = 2(3) + 4 = 10", tip: "Plug in the value carefully and follow BODMAS!" },
    ],
  },
  {
    name: "Geometry Essentials",
    emoji: "📐",
    steps: [
      { title: "Types of Angles", explanation: "Acute (< 90°), Right (= 90°), Obtuse (90°-180°), Straight (= 180°), Reflex (> 180°).", example: "A corner of a book = 90° (right angle)", tip: "Use the letter L to remember right angles!" },
      { title: "Area of Rectangles", explanation: "Area = length × width. Measured in square units.", example: "Rectangle 5cm × 3cm = 15 cm²", tip: "Area is always in SQUARE units!" },
      { title: "Area of Triangles", explanation: "Area = ½ × base × height.", example: "Triangle with base 8cm, height 6cm: ½ × 8 × 6 = 24 cm²", tip: "A triangle is half a rectangle!" },
      { title: "Circumference of Circles", explanation: "Circumference = 2πr or πd (where r = radius, d = diameter).", example: "Circle with radius 7cm: 2 × π × 7 ≈ 44 cm", tip: "π ≈ 3.14 — memorize this!" },
      { title: "Area of Circles", explanation: "Area = πr² (pi times radius squared).", example: "Circle with radius 5cm: π × 5² = π × 25 ≈ 78.5 cm²", tip: "Square the radius first, then multiply by π!" },
    ],
  },
];

const MathTutorial = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const topic = selectedTopic !== null ? tutorials[selectedTopic] : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => selectedTopic !== null ? (setSelectedTopic(null), setCurrentStep(0)) : navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" strokeLinejoin="miter" strokeLinecap="square" />
            <img src={mascot} alt="ReadSmart" className="w-8 h-8" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">
            {topic ? topic.name : "Math Tutorials"}
          </h1>
          <Calculator className="w-5 h-5 text-primary" strokeLinejoin="miter" strokeLinecap="square" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {!topic ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-6">Choose a topic to learn step-by-step 📖</p>
            {tutorials.map((t, i) => (
              <motion.button
                key={t.name}
                className="w-full bg-card rounded-2xl p-5 shadow-md border border-border text-left flex items-center gap-4 hover:border-primary/50 transition-colors"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedTopic(i)}
              >
                <span className="text-3xl">{t.emoji}</span>
                <div className="flex-1">
                  <p className="font-display font-bold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.steps.length} steps</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" strokeLinejoin="miter" strokeLinecap="square" />
              </motion.button>
            ))}
          </div>
        ) : (
          <div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-xp to-primary"
                animate={{ width: `${((currentStep + 1) / topic.steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="text-center mb-2">
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Step {currentStep + 1} of {topic.steps.length}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground text-center">
                  {topic.steps[currentStep].title}
                </h2>

                <div className="bg-card rounded-2xl p-5 shadow-md border border-border">
                  <p className="text-foreground leading-relaxed">{topic.steps[currentStep].explanation}</p>
                </div>

                <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
                  <p className="text-sm font-bold text-primary mb-2">📝 Example</p>
                  <p className="text-foreground font-mono text-sm">{topic.steps[currentStep].example}</p>
                </div>

                <div className="bg-gold/5 rounded-2xl p-4 border border-gold/20 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-gold shrink-0 mt-0.5" strokeLinejoin="miter" strokeLinecap="square" />
                  <p className="text-sm text-foreground">{topic.steps[currentStep].tip}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="flex-1 bg-muted text-foreground font-bold py-3 rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" strokeLinejoin="miter" strokeLinecap="square" /> Back
              </button>
              {currentStep < topic.steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" strokeLinejoin="miter" strokeLinecap="square" />
                </button>
              ) : (
                <button
                  onClick={() => { setSelectedTopic(null); setCurrentStep(0); }}
                  className="flex-1 bg-gold text-gold-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  🎉 Complete!
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MathTutorial;
