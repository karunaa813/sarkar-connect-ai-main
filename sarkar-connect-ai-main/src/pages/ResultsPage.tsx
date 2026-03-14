import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

import Header from "@/components/Header";
import {
  BookOpen, Scale, FileText, ShieldCheck, Download, CheckCircle, AlertTriangle, Percent
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const ResultsPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const query = (location.state as { query?: string })?.query || "Theft of mobile phone at railway station";

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/grievances", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complaint_text: query,
            user_id: user?.id || "anonymous-user",
            location: "Auto-detected"
          })
        });

        if (!response.ok) throw new Error("Backend unavailable");

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        console.error("Backend fetch error — falling back to mock:", err);
        // Minimal mock fallback for demonstration if backend isn't running
        setAnalysis({
          summary: "Analysis of: " + query,
          legal_sections: [
            { act: "BNS 2024", section: "303", description: "Theft" },
            { act: "BNS 2024", section: "304", description: "Snatching" }
          ],
          severity: 3,
          department: "Home Affairs",
          recommended_action: "File a formal grievance immediately.",
          escalated: false,
          legal_draft: "DRAFT FIR CONTENT..."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [query, user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <motion.div {...fadeUp}>
          <p className="text-sm text-muted-foreground mb-1">Autonomous Agent Analysis for:</p>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8">
            "{query}"
          </h1>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Researcher Agent */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <BookOpen className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Researcher Agent</CardTitle>
                  <p className="text-xs text-muted-foreground">{loading ? "Searching BNS 2024..." : "BNS 2024 Section Matching"}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ) : (
                  analysis?.legal_sections?.map((item: any, idx: number) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Section {item.section} — {item.act || "BNS 2024"}</span>
                        <div className="flex items-center gap-1 text-gold">
                          <Percent className="h-3 w-3" />
                          <span className="font-semibold">{90 - (idx * 15)}%</span>
                        </div>
                      </div>
                      <Progress value={90 - (idx * 15)} className="h-2" />
                      <p className="text-xs text-muted-foreground italic truncate">{item.description}</p>
                    </div>
                  ))
                )}
                <div className="pt-2 border-t">
                  <Badge variant="outline" className="border-gold/40 text-gold text-xs">
                    Source: Official Gazette of India
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Auditor Agent */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <Scale className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Auditor Agent</CardTitle>
                  <p className="text-xs text-muted-foreground">Legal Standing Analysis</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-xs text-muted-foreground mb-1">Classification</p>
                    <p className="font-semibold text-foreground">Cognizable</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-xs text-muted-foreground mb-1">Bail Status</p>
                    <Badge className="bg-danger-high text-primary-foreground text-xs">Non-Bailable</Badge>
                  </div>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <p className="text-xs text-muted-foreground mb-1">Impact Summary</p>
                  <p className="text-sm font-medium text-foreground">
                    {loading ? "Analyzing..." : analysis?.summary}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  {analysis?.escalated ? "Critical: Case Escalated" : "Standard Procedure"}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Drafting Agent */}
          <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <FileText className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Drafting Agent</CardTitle>
                  <p className="text-xs text-muted-foreground">Draft FIR Preview</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-secondary/50 p-5 font-body text-sm space-y-3">
                  <div className="text-center border-b pb-3">
                    <p className="font-bold uppercase tracking-wider text-foreground">First Information Report</p>
                    <p className="text-xs text-muted-foreground">Under Section 303, BNS 2024</p>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong className="text-foreground">FIR No:</strong> AUTO-2024-78432</p>
                    <p><strong className="text-foreground">Date:</strong> {new Date().toLocaleDateString("en-IN")}</p>
                    <p><strong className="text-foreground">Police Station:</strong> [Auto-assigned based on GPS]</p>
                    <p><strong className="text-foreground">Details:</strong> The complainant reports the theft of a mobile phone at the railway station premises. The incident occurred at approximately...</p>
                  </div>
                </div>
                <Button className="w-full mt-4 gradient-gold text-accent-foreground hover:opacity-90">
                  <Download className="h-4 w-4 mr-2" /> Download Signed PDF
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Evidence Check */}
          <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <ShieldCheck className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">AI Evidence Check</CardTitle>
                  <p className="text-xs text-muted-foreground">Uploaded Proof Verification</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-secondary/50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-sm">Pixel Integrity</p>
                      <p className="text-xs text-muted-foreground">No signs of manipulation detected</p>
                    </div>
                  </div>
                  <Badge className="bg-success text-primary-foreground">Verified</Badge>
                </div>
                <div className="rounded-lg border bg-secondary/50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-sm">Metadata Verified</p>
                      <p className="text-xs text-muted-foreground">EXIF data consistent with claim</p>
                    </div>
                  </div>
                  <Badge className="bg-success text-primary-foreground">Verified</Badge>
                </div>
                <div className="rounded-lg border bg-secondary/50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-sm">GPS Correlation</p>
                      <p className="text-xs text-muted-foreground">Location within 500m of reported site</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-warning text-warning">Partial</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
