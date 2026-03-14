import { motion } from "framer-motion";
import Header from "@/components/Header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Shield } from "lucide-react";

const resolutionData = [
  { district: "Mumbai", days: 4.2 },
  { district: "Delhi", days: 6.8 },
  { district: "Bengaluru", days: 3.1 },
  { district: "Chennai", days: 5.5 },
  { district: "Kolkata", days: 7.2 },
  { district: "Hyderabad", days: 3.9 },
  { district: "Pune", days: 4.8 },
];

const heatmapZones = [
  { state: "Maharashtra", density: "High", color: "bg-danger-high", cases: 12450 },
  { state: "Uttar Pradesh", density: "Critical", color: "bg-danger-high", cases: 18200 },
  { state: "Tamil Nadu", density: "Moderate", color: "bg-danger-medium", cases: 6780 },
  { state: "Karnataka", density: "Low", color: "bg-success", cases: 3200 },
  { state: "West Bengal", density: "High", color: "bg-danger-high", cases: 9870 },
  { state: "Rajasthan", density: "Moderate", color: "bg-danger-medium", cases: 7430 },
  { state: "Gujarat", density: "Low", color: "bg-success", cases: 2980 },
  { state: "Delhi NCR", density: "Critical", color: "bg-danger-high", cases: 15600 },
];

const ledgerData = [
  { caseId: "FIR-2024-78432", agent: "Researcher-A7", action: "BNS Section Matched", timestamp: "2024-12-15 09:23:11", status: "Verified" },
  { caseId: "FIR-2024-78432", agent: "Auditor-B3", action: "Legal Standing Assessed", timestamp: "2024-12-15 09:23:14", status: "Verified" },
  { caseId: "FIR-2024-78432", agent: "Drafter-C1", action: "FIR Draft Generated", timestamp: "2024-12-15 09:23:18", status: "Pending Review" },
  { caseId: "FIR-2024-78430", agent: "Evidence-D2", action: "Image Integrity Check", timestamp: "2024-12-15 08:45:02", status: "Verified" },
  { caseId: "FIR-2024-78429", agent: "Researcher-A7", action: "Cross-reference Complete", timestamp: "2024-12-15 08:12:55", status: "Verified" },
];

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-2">Official Sentiment & Analytics</h1>
          <p className="text-muted-foreground mb-8">Government Administrator Dashboard</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Heatmap Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Social Sentiment Heatmap</CardTitle>
                  <p className="text-xs text-muted-foreground">Grievance density by state</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {heatmapZones.map((zone) => (
                    <div key={zone.state} className="flex items-center gap-3 rounded-lg border bg-secondary/50 p-3">
                      <div className={`h-3 w-3 rounded-full ${zone.color} shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{zone.state}</p>
                        <p className="text-xs text-muted-foreground">{zone.cases.toLocaleString()} cases</p>
                      </div>
                      <Badge variant={zone.density === "Critical" ? "destructive" : "outline"} className="text-xs shrink-0">
                        {zone.density}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <TrendingUp className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Efficiency Metrics</CardTitle>
                  <p className="text-xs text-muted-foreground">Average Resolution Time (Days)</p>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resolutionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 88%)" />
                    <XAxis dataKey="district" tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 100%)",
                        border: "1px solid hsl(220 16% 88%)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Bar dataKey="days" fill="hsl(235 72% 30%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Transparency Ledger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-card border-gold/20">
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                <Shield className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle className="text-lg font-display">Transparency Ledger</CardTitle>
                <p className="text-xs text-muted-foreground">Immutable action trail</p>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Agent ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{row.caseId}</TableCell>
                      <TableCell className="font-mono text-xs">{row.agent}</TableCell>
                      <TableCell className="text-sm">{row.action}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{row.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "Verified" ? "default" : "outline"} className={`text-xs ${row.status === "Verified" ? "bg-success text-primary-foreground" : ""}`}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
