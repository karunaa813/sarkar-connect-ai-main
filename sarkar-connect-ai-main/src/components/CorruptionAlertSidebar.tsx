import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Clock, Users, FileWarning, TrendingDown, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const redFlags = [
  { id: 1, type: "Repeated Delays", dept: "Public Works Dept", detail: "12 cases delayed beyond SLA in Zone C", severity: "critical", icon: Clock },
  { id: 2, type: "Bid Anomalies", dept: "Procurement Division", detail: "Bid patterns show collusion in 3 recent tenders", severity: "critical", icon: FileWarning },
  { id: 3, type: "Resource Optimization", dept: "District Magistrate Office", detail: "SI D. Gupta — 47% unresolved cases, 8.2hr avg response", severity: "high", icon: Users },
  { id: 4, type: "Budget Discrepancy", dept: "Finance Department", detail: "₹2.4Cr discrepancy in Q3 allocation vs expenditure", severity: "high", icon: TrendingDown },
  { id: 5, type: "Evidence Integrity", dept: "Forensics Lab B", detail: "2 submissions flagged with pixel integrity < 70%", severity: "medium", icon: AlertTriangle },
];

const severityStyles: Record<string, string> = {
  critical: "border-l-destructive bg-destructive/5",
  high: "border-l-danger-medium bg-danger-medium/5",
  medium: "border-l-warning bg-warning/5",
};

const severityBadge: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-danger-medium text-primary-foreground",
  medium: "bg-warning text-foreground",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const CorruptionAlertSidebar = ({ open, onClose }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-card border-l border-border overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-foreground">Systemic Performance Monitoring</h2>
                    <p className="text-[11px] text-muted-foreground">AI Detection Engine</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {redFlags.map((flag, i) => (
                  <motion.div
                    key={flag.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-md border-l-4 border border-border p-4 ${severityStyles[flag.severity]}`}
                  >
                    <div className="flex items-start gap-3">
                      <flag.icon className="h-4 w-4 text-foreground/70 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{flag.type}</span>
                          <Badge className={`text-[10px] ${severityBadge[flag.severity]}`}>
                            {flag.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{flag.dept}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{flag.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CorruptionAlertSidebar;
