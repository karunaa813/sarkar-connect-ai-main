import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const presetQueries = [
  "What are my procedural rights?",
  "Steps to file a grievance",
  "How to file an RTI application",
  "What are my rights during an arrest?",
];

const guidanceResponses: Record<string, string[]> = {
  "What are my procedural rights?": [
    "Right 1: Right to be heard before any adverse order — Principles of Natural Justice.",
    "Right 2: Right to access public records under RTI Act, 2005.",
    "Right 3: Right to legal representation at all stages.",
    "Right 4: Right to appeal against administrative decisions.",
    "Right 5: Right to a reasoned order in writing.",
  ],
  "Steps to file a grievance": [
    "Step 1: Document the issue with dates, officials involved, and supporting evidence.",
    "Step 2: Submit a written complaint to the relevant department head.",
    "Step 3: If unresolved in 30 days, escalate to the District Grievance Officer.",
    "Step 4: File on the Centralized Public Grievance Portal (CPGRAMS) at pgportal.gov.in.",
    "Step 5: Track your complaint status using the unique registration number.",
  ],
  "How to file an RTI application": [
    "Step 1: Identify the Public Authority and its Public Information Officer (PIO).",
    "Step 2: Draft your application under Section 6(1) of RTI Act, 2005.",
    "Step 3: Pay the application fee of ₹10 (via postal order, DD, or online).",
    "Step 4: Send the application by post or submit online at rtionline.gov.in.",
    "Step 5: If no response in 30 days, file First Appeal under Section 19(1).",
  ],
  "What are my rights during an arrest?": [
    "Right 1: Know the grounds of arrest — Article 22(1) of the Constitution.",
    "Right 2: Right to inform a friend/relative — Section 50A of CrPC.",
    "Right 3: Right to a lawyer — Article 22(1) and Section 41D of CrPC.",
    "Right 4: Right to be produced before a Magistrate within 24 hours — Article 22(2).",
    "Right 5: Right against self-incrimination — Article 20(3).",
  ],
};

const LegalHelpChatbot = () => {
  const [open, setOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-primary shadow-elevated hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Scale className="h-6 w-6 text-primary-foreground" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] rounded-lg border border-border bg-card shadow-elevated overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="gradient-navy p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-primary-foreground" />
                <div>
                  <p className="text-sm font-bold text-primary-foreground font-display">Legal Guidance Assistant</p>
                  <p className="text-[10px] text-primary-foreground/60">Step-by-step administrative guidance</p>
                </div>
              </div>
              <button onClick={() => { setOpen(false); setSelectedQuery(null); }} className="text-primary-foreground/60 hover:text-primary-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {!selectedQuery ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">Select a common administrative query:</p>
                  {presetQueries.map((q) => (
                    <button
                      key={q}
                      onClick={() => setSelectedQuery(q)}
                      className="w-full text-left rounded-md border border-border bg-card p-3 text-sm text-foreground hover:bg-muted/50 hover:border-primary/30 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="rounded-md bg-primary/5 border border-primary/20 p-3">
                    <p className="text-sm font-semibold text-foreground">{selectedQuery}</p>
                  </div>
                  {guidanceResponses[selectedQuery]?.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-md border border-border bg-card p-3 text-sm text-foreground"
                    >
                      {step}
                    </motion.div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setSelectedQuery(null)}>
                    ← Ask another question
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LegalHelpChatbot;
