import { useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Mic, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";


const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate("/results", { state: { query } });
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    toast("Microphone activated...", { description: "Speak your grievance or query." });
    setTimeout(() => {
      setQuery("Information on road tender for NH-48 highway expansion project in FY 2024-25");
      setIsListening(false);
      toast.success("Voice input captured.");
    }, 2500);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success("Evidence Attached", { description: file.name + " ready for analysis." });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center gradient-navy-hero bg-grid-pattern relative overflow-hidden py-20 px-4">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-medium tracking-widest uppercase text-white/50">
              Government of India • Powered by AI
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6 tracking-tight">
            National Agentic <span className="text-gold">Legal-Grievance</span> Engine
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">
            An autonomous multi-agent system for instant legal analysis, FIR drafting,
            and evidence verification under <span className="text-white/80 font-medium">Bharatiya Nyaya Sanhita 2024</span>.
          </p>

          {/* Search */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-20">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-gold/30 transition-all shadow-2xl backdrop-blur-md">
              <Search className="h-5 w-5 text-white/40 ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Report an incident or query using Voice or Text..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-white placeholder:text-white/20 text-md"
              />
              <div className="flex items-center gap-2 shrink-0 pr-1">
                <button 
                  type="button" 
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-xl transition-colors ${isListening ? "text-danger-high bg-danger-high/10 animate-pulse" : "text-white/40 hover:text-gold hover:bg-white/5"}`} 
                  title="Voice Input"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button 
                  type="button" 
                  onClick={handleUploadClick}
                  className="p-3 rounded-xl text-white/40 hover:text-gold hover:bg-white/5 transition-colors" 
                  title="Upload Evidence"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
                <Button type="submit" className="bg-gold hover:bg-gold-light text-navy-deep rounded-xl px-8 py-6 text-md font-bold transition-all shadow-lg hover:shadow-gold/20 flex items-center gap-2">
                  {user ? "Analyze Case" : "Analyze"} <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>

          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mb-12"
            >
              <Button
                onClick={() => navigate('/results')}
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10 px-8 py-6 rounded-xl text-md font-bold"
              >
                Go to My Cases Dashboard
              </Button>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-2xl mx-auto"
          >
            {[
              { value: "2.4M+", label: "Cases Processed" },
              { value: "98.7%", label: "AI Accuracy" },
              { value: "<2min", label: "Avg. Response" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-4xl font-display font-bold text-gold mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="text-xs tracking-widest uppercase text-white/40 font-semibold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold/5 blur-[120px] rounded-full" />
      </div>
    </section>
  );
};

export default HeroSection;
