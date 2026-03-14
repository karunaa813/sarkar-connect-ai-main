import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Gift, BookOpen, Car, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const redeemableServices = [
  { name: "Parking Credits (1 Month)", points: 500, icon: Car, available: true },
  { name: "Public Library Access", points: 300, icon: Library, available: true },
  { name: "Digital Locker Premium", points: 800, icon: BookOpen, available: true },
  { name: "Priority Grievance Queue", points: 1200, icon: Star, available: false },
];

const CivicRewardsPage = () => {
  const totalPoints = 1350;
  const level = "Silver Citizen";
  const nextLevel = 2000;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-2">Civic Rewards</h1>
          <p className="text-muted-foreground mb-8">Earn points for responsible reporting</p>
        </motion.div>

        {/* Points Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-elevated border-gold/30 gradient-navy mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/60 bg-primary-foreground/10">
                  <Award className="h-10 w-10 text-gold" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-sm text-primary-foreground/60 uppercase tracking-wider mb-1">Total Civic Points</p>
                  <p className="text-5xl font-display font-bold text-gold">{totalPoints.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="gradient-gold text-accent-foreground">{level}</Badge>
                    <span className="text-xs text-primary-foreground/50">Next: Gold Citizen at {nextLevel.toLocaleString()} pts</span>
                  </div>
                  <div className="mt-4 max-w-xs">
                    <Progress value={(totalPoints / nextLevel) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Earnings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-display font-bold mb-4">Recent Earnings</h2>
          <div className="space-y-3 mb-10">
            {[
              { action: "Verified incident report filed", points: 150, date: "Dec 14, 2024" },
              { action: "Evidence verified by AI system", points: 100, date: "Dec 12, 2024" },
              { action: "Community safety alert shared", points: 50, date: "Dec 10, 2024" },
              { action: "Monthly active citizen bonus", points: 200, date: "Dec 1, 2024" },
            ].map((item, i) => (
              <Card key={i} className="shadow-card border-gold/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-gold" />
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gold">+{item.points}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Redeemable Services */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-display font-bold mb-4">Redeemable Services</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {redeemableServices.map((service) => {
              const Icon = service.icon;
              const canRedeem = totalPoints >= service.points && service.available;
              return (
                <Card key={service.name} className={`shadow-card border-gold/10 ${!service.available ? "opacity-60" : ""}`}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary shrink-0">
                      <Icon className="h-6 w-6 text-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.points} points</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={!canRedeem}
                      className={canRedeem ? "gradient-gold text-accent-foreground hover:opacity-90" : ""}
                    >
                      <Gift className="h-3 w-3 mr-1" /> Redeem
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CivicRewardsPage;
