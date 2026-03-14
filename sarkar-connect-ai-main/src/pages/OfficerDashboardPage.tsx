import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { UserCheck, Clock, Award, AlertTriangle, TrendingUp, ShieldAlert, Filter, ArrowRight, CheckCircle2, XCircle, FileText, Hash } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const mockGrievances = [
  {
    id: "GRV-78432",
    text: "Potholes on Main Street causing accidents since 45 days. Local municipal office did not respond to repeated requests. We need immediate intervention as this is a high-traffic area.",
    dept: "Infrastructure",
    severity: 5,
    daysPending: 45,
    user: "Komal M.",
    action: "Urgent Repair Required",
    legalContext: "BNS Section 303 (Theft of Public Safety), Municipal Act 1957",
    blockchainHash: "0x7d8e2f1a9c3b4d5e6f7g8h9i0j1k2l3m4n5o6p7q",
    timestamp: "2024-03-01 10:24 AM"
  },
  {
    id: "GRV-12093",
    text: "Water supply contamination reported in Sector 4. The water is murky and has a foul smell. Several children in the neighborhood have reported stomach issues.",
    dept: "Sanitation",
    severity: 4,
    daysPending: 12,
    user: "Rahul S.",
    action: "Sample Analysis Dispatch",
    legalContext: "Health & Safety Protocol 2022, RTI Section 4(1)(b)",
    blockchainHash: "0xc1b2a3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    timestamp: "2024-03-05 02:45 PM"
  },
  {
    id: "GRV-89410",
    text: "Street lights non-functional for 2 months near railway station. This has become a safety hazard for late-night commuters, especially women.",
    dept: "Infrastructure",
    severity: 3,
    daysPending: 62,
    user: "Ananya P.",
    action: "Relamp Queue",
    legalContext: "Public Infrastructure Maintenance Code Sec 12",
    blockchainHash: "0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t",
    timestamp: "2024-01-15 09:12 PM"
  },
  {
    id: "GRV-33211",
    text: "Illegal construction on public park land. Someone has started building a permanent fence around the green area next to Building C.",
    dept: "Law Enforcement",
    severity: 5,
    daysPending: 5,
    user: "Vijay K.",
    action: "Enforcement Notice",
    legalContext: "BNS Section 305 (Extortion of Public Space), Land Grabbing Act",
    blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    timestamp: "2024-03-08 11:00 AM"
  }
];

const officers = [
  { name: "Inspector R. Sharma", badge: "IPS-4521", responseTime: 2.1, quality: 94, risk: "low", cases: 187, resolved: 178 },
  { name: "SI K. Verma", badge: "IPS-3298", responseTime: 4.8, quality: 78, risk: "medium", cases: 143, resolved: 112 },
  { name: "Inspector M. Patel", badge: "IPS-5104", responseTime: 1.4, quality: 97, risk: "low", cases: 221, resolved: 216 },
  { name: "SI D. Gupta", badge: "IPS-2877", responseTime: 8.2, quality: 52, risk: "high", cases: 98, resolved: 51 },
  { name: "Inspector A. Singh", badge: "IPS-6043", responseTime: 3.5, quality: 88, risk: "low", cases: 165, resolved: 148 },
  { name: "SI P. Reddy", badge: "IPS-1956", responseTime: 6.9, quality: 61, risk: "medium", cases: 112, resolved: 72 },
];

const departmentData = [
  { dept: "Cyber Crime", avgTime: 3.2, color: "hsl(152 56% 40%)" },
  { dept: "Economic", avgTime: 5.8, color: "hsl(43 56% 53%)" },
  { dept: "Narcotics", avgTime: 4.1, color: "hsl(235 72% 30%)" },
  { dept: "Traffic", avgTime: 2.4, color: "hsl(152 56% 40%)" },
  { dept: "Homicide", avgTime: 7.6, color: "hsl(0 72% 42%)" },
  { dept: "Fraud", avgTime: 6.3, color: "hsl(25 90% 52%)" },
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low": return "bg-success text-primary-foreground";
    case "medium": return "bg-danger-medium text-primary-foreground";
    case "high": return "bg-danger-high text-primary-foreground";
    default: return "bg-muted";
  }
};

const getRiskBorder = (risk: string) => {
  switch (risk) {
    case "low": return "border-l-success";
    case "medium": return "border-l-danger-medium";
    case "high": return "border-l-danger-high";
    default: return "border-l-muted";
  }
};

const OfficerDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const officerDept = "Infrastructure"; // Mocking officer's department

  const filteredGrievances = activeTab === "mine"
    ? mockGrievances.filter(g => g.dept === officerDept)
    : mockGrievances;

  const redFlagsCount = mockGrievances.filter(g => g.severity >= 4 || g.daysPending > 30).length;

  const handleAction = (id: string, action: string) => {
    toast.success(`Action: "${action}" initiated for ${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-2">AI Officer Performance Dashboard</h1>
          <p className="text-muted-foreground mb-8">Integrity & accountability metrics powered by AI analysis</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Avg Response Time", value: "4.2 hrs", icon: Clock, trend: "-12% from last month" },
            { label: "Resolution Quality", value: "78.3%", icon: Award, trend: "+5.2% improvement" },
            { label: "Officers Monitored", value: "342", icon: UserCheck, trend: "All districts" },
            { label: "Red Flags Active", value: redFlagsCount.toString(), icon: AlertTriangle, trend: `${mockGrievances.filter(g => g.severity === 5).length} critical` },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card border-gold/20">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                      <stat.icon className="h-5 w-5 text-gold" />
                    </div>
                    <span className="text-2xl font-bold font-display">{stat.value}</span>
                  </div>
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-1 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="shadow-card border-gold/20">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger-high">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-display">Priority Grievance Queue (Red Flags)</CardTitle>
                    <p className="text-xs text-muted-foreground">High severity or SLA breaches require immediate action</p>
                  </div>
                </div>
                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                  <TabsList className="bg-secondary">
                    <TabsTrigger value="all">Global Queue</TabsTrigger>
                    <TabsTrigger value="mine">My Department ({officerDept})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredGrievances.map((g, i) => {
                    const isRedFlag = g.severity >= 4 || g.daysPending > 30;
                    return (
                      <motion.div
                        key={g.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className={`p-4 rounded-lg border flex flex-wrap items-center justify-between gap-4 transition-all hover:shadow-md ${isRedFlag ? "bg-danger-high/5 border-danger-high/20" : "bg-card"}`}
                      >
                        <div className="flex-1 min-w-[300px]">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                              {g.id}
                            </Badge>
                            <Badge className={g.severity >= 4 ? "bg-danger-high text-white" : "bg-warning text-black"}>
                              Severity {g.severity}
                            </Badge>
                            {g.daysPending > 30 && (
                              <Badge className="bg-danger-high animate-pulse gap-1">
                                <Clock className="h-3 w-3" /> SLA BREACH: {g.daysPending}d
                              </Badge>
                            )}
                            <Badge variant="secondary">{g.dept}</Badge>
                          </div>
                          <p className="text-sm font-medium mb-1 line-clamp-1">{g.text}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <UserCheck className="h-3 w-3" /> Submitted by: {g.user}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-accent text-accent hover:bg-accent/10"
                                onClick={() => setSelectedGrievance(g)}
                              >
                                View Analysis
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-card border-gold/30">
                              <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className={g.severity >= 4 ? "bg-danger-high text-white" : "bg-warning"}>
                                    Severity {g.severity}
                                  </Badge>
                                  <Badge variant="outline" className="font-mono">{g.id}</Badge>
                                </div>
                                <DialogTitle className="text-2xl font-display">Grievance Intelligent Analysis</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  AI-generated legal grounding and evidence verification.
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6 mt-4">
                                <section>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-accent" /> Citizen Complaint
                                  </h4>
                                  <p className="text-sm bg-secondary/50 p-4 rounded-lg leading-relaxed italic">
                                    "{g.text}"
                                  </p>
                                </section>

                                <div className="grid grid-cols-2 gap-4">
                                  <section>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                      <ShieldAlert className="h-4 w-4 text-accent" /> Legal Grounding
                                    </h4>
                                    <div className="text-xs bg-accent/5 border border-accent/20 p-3 rounded-md font-medium text-accent">
                                      {g.legalContext}
                                    </div>
                                  </section>
                                  <section>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-accent" /> Submission Intel
                                    </h4>
                                    <div className="text-xs space-y-1">
                                      <p className="text-muted-foreground">Timestamp: <span className="text-foreground">{g.timestamp}</span></p>
                                      <p className="text-muted-foreground">Location: <span className="text-foreground">Sector 4, New Delhi</span></p>
                                      <p className="text-muted-foreground">Reporter: <span className="text-foreground">{g.user}</span></p>
                                    </div>
                                  </section>
                                </div>

                                <section className="p-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                      <Hash className="h-3 w-3" /> Blockchain Evidence Trace
                                    </h4>
                                    <Badge className="bg-success/20 text-success border-success/30 text-[10px]">Verified 100% Integrity</Badge>
                                  </div>
                                  <p className="text-[10px] font-mono break-all text-muted-foreground mb-1">
                                    HASH: {g.blockchainHash}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    Archive Layer: Polygon Mainnet (Hashed & Timestamped)
                                  </p>
                                </section>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button variant="outline" onClick={() => handleAction(g.id, "Request Clarification")}>
                                    Need Info
                                  </Button>
                                  <Button className="gradient-navy text-primary-foreground" onClick={() => handleAction(g.id, "Resolve")}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Resolve Issue
                                  </Button>
                                  <Button className="bg-danger-high text-white hover:opacity-90" onClick={() => handleAction(g.id, "Police Dispatch")}>
                                    <ArrowRight className="h-4 w-4 mr-2" /> Immediate Dispatch
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-success text-success hover:bg-success/10 hover:text-success"
                            onClick={() => handleAction(g.id, "Resolve")}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Resolve
                          </Button>
                          <Button
                            size="sm"
                            className="gradient-navy text-primary-foreground hover:opacity-90"
                            onClick={() => handleAction(g.id, "Approve Escalation")}
                          >
                            <ArrowRight className="h-4 w-4 mr-1" /> Dispatch
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Department Performance Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <TrendingUp className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Department Performance</CardTitle>
                  <p className="text-xs text-muted-foreground">Avg response time by department (hours)</p>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={departmentData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 88%)" />
                    <XAxis dataKey="dept" tick={{ fontSize: 11 }} stroke="hsl(220 10% 46%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(220 16% 88%)", borderRadius: "8px", fontSize: "13px" }} />
                    <Bar dataKey="avgTime" radius={[4, 4, 0, 0]}>
                      {departmentData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Heatmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <ShieldAlert className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Corruption Risk Heatmap</CardTitle>
                  <p className="text-xs text-muted-foreground">AI-assessed integrity indicators</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-success" /> Low</span>
                  <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-danger-medium" /> Medium</span>
                  <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-danger-high" /> High</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F", "Zone G", "Zone H", "Zone I"].map((zone, i) => {
                    const risk = i === 3 || i === 7 ? "high" : i === 1 || i === 5 ? "medium" : "low";
                    return (
                      <div key={zone} className={`rounded-lg p-3 text-center text-xs font-medium ${risk === "high" ? "bg-danger-high/20 text-danger-high" : risk === "medium" ? "bg-danger-medium/20 text-danger-medium" : "bg-success/20 text-success"} border`}>
                        <p className="font-bold">{zone}</p>
                        <p className="capitalize">{risk}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Officer Scorecard Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-card border-gold/20">
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                <UserCheck className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle className="text-lg font-display">AI Officer Scorecard</CardTitle>
                <p className="text-xs text-muted-foreground">Individual performance & integrity assessment</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {officers.map((officer) => (
                  <div key={officer.badge} className={`rounded-lg border bg-card p-4 border-l-4 ${getRiskBorder(officer.risk)}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-sm">{officer.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{officer.badge}</p>
                      </div>
                      <Badge className={`text-xs ${getRiskColor(officer.risk)}`}>
                        {officer.risk === "low" ? "✓ Low Risk" : officer.risk === "medium" ? "⚠ Medium Risk" : "✕ High Risk"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Response Time</p>
                        <p className="font-bold text-sm">{officer.responseTime} hrs</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Resolution Quality</p>
                        <div className="flex items-center gap-2">
                          <Progress value={officer.quality} className="h-2 flex-1" />
                          <span className="font-bold text-sm">{officer.quality}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Cases</p>
                        <p className="font-bold text-sm">{officer.resolved}/{officer.cases} resolved</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OfficerDashboardPage;
