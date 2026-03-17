import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bell, Shield, TrendingUp, Users, AlertTriangle, Info, ArrowRight, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const localAlerts = [
  {
    id: "ALRT-001",
    pinCode: "400001",
    type: "High Alert",
    category: "Theft Pattern",
    title: "Recurring Chain Snatching Detected",
    description: "AI analysis of 3 recent FIR drafts identifies a pattern: Two men on a black Pulsar motorcycle operating near Public Parks between 6 PM - 8 PM.",
    date: "2 hours ago",
    severity: "high"
  },
  {
    id: "ALRT-002",
    pinCode: "400001",
    type: "Safety Notice",
    category: "Public Utility",
    title: "Street Light Malfunction in Sector 4",
    description: "Multiple reports of non-functional street lights. Increased risk of petty crime. Civic authorities notified.",
    date: "5 hours ago",
    severity: "medium"
  },
  {
    id: "ALRT-003",
    pinCode: "400001",
    type: "Community Info",
    category: "Awareness",
    title: "Senior Citizen Safety Workshop",
    description: "Local station organizing a digital safety workshop at the Community Centre this Sunday.",
    date: "Yesterday",
    severity: "low"
  }
];

const NeighbourhoodWatchPage = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [pinCode, setPinCode] = useState("400001");

  const handleJoin = () => {
    setIsJoined(true);
    toast.success(`Broadcasting enabled for PIN: ${pinCode}. You will receive localized real-time alerts.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold mb-4">
              <Shield className="h-3 w-3" /> Community Safety Network
            </div>
            <h1 className="text-4xl font-display font-bold mb-4 tracking-tight">Digital Neighbourhood Watch</h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-xl">
              AI-driven localized safety alerts. Our engine monitors crime patterns in your PIN code and pushes proactive warnings to keep the community safe.
            </p>
            
            {!isJoined ? (
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Enter PIN Code"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <Button onClick={handleJoin} className="gradient-navy">Join Network</Button>
              </div>
            ) : (
              <Badge className="bg-success/20 text-success border-success/30 px-4 py-2 gap-2 text-sm">
                <Bell className="h-4 w-4 animate-bounce" /> Active Monitoring for PIN {pinCode}
              </Badge>
            )}
          </motion.div>
          
          <motion.div 
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="shadow-card border-gold/10 overflow-hidden">
              <div className="bg-navy p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gold" />
                  <span className="text-xs font-bold text-white uppercase">Live Pattern Detection</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-gold border-gold/30">AI Active</Badge>
              </div>
              <CardContent className="p-6 bg-secondary/30">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-danger-high animate-ping" />
                    <div>
                      <p className="text-xs font-bold">New Pattern Match</p>
                      <p className="text-[10px] text-muted-foreground">3 FIR drafts matching "Mobile Theft" in 400001</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 opacity-60">
                    <div className="mt-1 h-2 w-2 rounded-full bg-success" />
                    <div>
                      <p className="text-xs font-bold">Resolution Tracked</p>
                      <p className="text-[10px] text-muted-foreground">Police patrol increased in Market Area based on AI alert</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Alerts Feed */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {localAlerts.map((alert, idx) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Card className={`h-full border-t-4 ${
                alert.severity === 'high' ? 'border-t-danger-high' : 
                alert.severity === 'medium' ? 'border-t-accent' : 'border-t-success'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px]">{alert.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{alert.date}</span>
                  </div>
                  <CardTitle className="text-lg">{alert.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {alert.description}
                  </p>
                  
                  {alert.severity === 'high' && (
                    <div className="p-3 rounded bg-danger-high/10 border border-danger-high/20 flex items-start gap-2">
                      <ShieldAlert className="h-4 w-4 text-danger-high shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-danger-high">Proactive AI Tip:</p>
                        <p className="text-[10px] text-danger-high/80">Avoid evening walks near North Park until patrols increase.</p>
                      </div>
                    </div>
                  )}

                  <Button variant="ghost" size="sm" className="w-full text-accent hover:bg-accent/5 gap-2 text-xs">
                    View Details <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
            <Users className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold font-display">1,240</p>
            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Local Citizens</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
            <AlertTriangle className="h-6 w-6 text-danger-high mx-auto mb-2" />
            <p className="text-2xl font-bold font-display">12</p>
            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Alerts Prevented</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
            <Shield className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold font-display">98%</p>
            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Safety Score</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
            <TrendingUp className="h-6 w-6 text-gold mx-auto mb-2" />
            <p className="text-2xl font-bold font-display">Low</p>
            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Crime Trend</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighbourhoodWatchPage;
