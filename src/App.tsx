import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { GameProvider } from "@/contexts/GameContext";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import MathTutorial from "./pages/MathTutorial";
import CustomQuestions from "./pages/CustomQuestions";
import NoteSummarizer from "./pages/NoteSummarizer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quiz/:subject" element={<Quiz />} />
              <Route path="/tutorial/math" element={<MathTutorial />} />
              <Route path="/custom-questions" element={<CustomQuestions />} />
              <Route path="/summarizer" element={<NoteSummarizer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
