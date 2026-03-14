import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Building2, ArrowRight, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type PortalType = null | "citizen" | "official";
type AuthView = "login" | "signup" | "forgot" | "request-access";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, userRole, loading: authLoading } = useAuth();
  const [portal, setPortal] = useState<PortalType>(null);
  const [view, setView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      if (userRole === 'official') {
        navigate("/officer-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, userRole, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      toast.error(error.message);
    } else {
      // Small timeout to allow useAuth to fetch the role
      setTimeout(() => {
        setLoading(false);
        if (portal === "official") {
          // Note: The actual role check happens in ProtectedRoute, 
          // but we can give a hint here.
          toast.success("Login successful. Checking administrative credentials...");
          navigate("/officer-dashboard");
        } else {
          toast.success("Login successful.");
          navigate("/");
        }
      }, 500);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          portal_type: portal
        },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email to confirm your account.");
      setView("login");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset link sent to your email.");
      setView("login");
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length > 200) { toast.error("Name is too long (max 200 characters)."); return; }
    if (email.trim().length > 255) { toast.error("Email is too long (max 255 characters)."); return; }
    if (department.trim().length > 200) { toast.error("Department is too long (max 200 characters)."); return; }
    if (designation.trim().length > 200) { toast.error("Designation is too long (max 200 characters)."); return; }
    if (reason && reason.trim().length > 1000) { toast.error("Reason is too long (max 1000 characters)."); return; }

    setLoading(true);
    const { error } = await supabase.from("access_requests").insert({
      full_name: fullName.trim(),
      email: email.trim(),
      department: department.trim(),
      designation: designation.trim(),
      reason: reason?.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to submit request. Try again.");
    } else {
      toast.success("Access request submitted. You'll be notified once approved.");
      setPortal(null);
    }
  };

  const resetForm = () => {
    setEmail(""); setPassword(""); setFullName(""); setDepartment(""); setDesignation(""); setReason("");
  };

  // Portal selection
  if (!portal) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Saffron top bar */}
        <div className="h-[3px] bg-saffron w-full" />
        {/* Navy header */}
        <div className="gradient-navy">
          <div className="container flex h-14 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/10">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-primary-foreground font-display">
                SarkarConnect AI
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-primary-foreground/60">
                National Justice Portal
              </span>
            </div>
          </div>
          <div className="h-[2px] bg-india-green w-full" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-2">
              Public Accountability & Citizen Feedback
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Secure access to the National Justice Portal. Choose your entry point below.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 max-w-2xl w-full">
            {/* Citizen */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card
                className="cursor-pointer border border-border hover:border-primary/40 transition-all bg-card shadow-card group"
                onClick={() => { setPortal("citizen"); resetForm(); setView("login"); }}
              >
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground">Citizen Access</CardTitle>
                  <CardDescription className="text-xs">
                    File grievances, track cases & earn civic rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
                    Enter Portal <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Official */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card
                className="cursor-pointer border border-border hover:border-primary/40 transition-all bg-card shadow-card group"
                onClick={() => { setPortal("official"); resetForm(); setView("login"); }}
              >
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground">Administrative Access</CardTitle>
                  <CardDescription className="text-xs">
                    Dashboard, analytics, officer performance & integrity tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5 text-sm">
                    Enter Portal <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-4 text-center">
          <p className="text-muted-foreground text-xs">
            © 2024 Government of India — Ministry of Law & Justice | Built with Blockchain & AI Security
          </p>
        </footer>
      </div>
    );
  }

  const isCitizen = portal === "citizen";
  const portalLabel = isCitizen ? "Citizen Access" : "Administrative Access";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-[3px] bg-saffron w-full" />
      <div className="gradient-navy">
        <div className="container flex h-14 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/10">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-wide text-primary-foreground font-display">
            SarkarConnect AI
          </span>
        </div>
        <div className="h-[2px] bg-india-green w-full" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="bg-card border border-border shadow-card">
            <CardHeader className="text-center">
              <button
                onClick={() => { setPortal(null); resetForm(); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                ← Back to portal selection
              </button>
              <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5">
                {isCitizen ? <Users className="h-5 w-5 text-primary" /> : <Building2 className="h-5 w-5 text-primary" />}
              </div>
              <CardTitle className="text-lg text-foreground">{portalLabel}</CardTitle>
              <CardDescription className="text-xs">
                {view === "login" && "Sign in to your account"}
                {view === "signup" && "Create a new account"}
                {view === "forgot" && "Reset your password"}
                {view === "request-access" && "Request official access"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {view === "login" && (
                  <motion.form key="login" onSubmit={handleLogin} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="you@example.com" className="pl-9 h-9 text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-xs font-semibold text-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9 h-9 text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm" disabled={loading}>
                      {loading ? "Signing in…" : "Sign In"}
                    </Button>
                    <div className="flex items-center justify-between text-xs">
                      <button type="button" onClick={() => setView("forgot")} className="text-muted-foreground hover:text-primary transition-colors">Forgot Password?</button>
                      <button type="button" onClick={() => setView("signup")} className="text-muted-foreground hover:text-primary transition-colors">Create Account</button>
                    </div>
                    {!isCitizen && (
                      <button type="button" onClick={() => { resetForm(); setView("request-access"); }} className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors mt-1">
                        Don't have access? Request Access →
                      </button>
                    )}
                  </motion.form>
                )}

                {view === "signup" && (
                  <motion.form key="signup" onSubmit={handleSignup} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Your full name" className="pl-9 h-9 text-sm" value={fullName} onChange={e => setFullName(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="you@example.com" className="pl-9 h-9 text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="Min. 6 characters" className="pl-9 h-9 text-sm" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm" disabled={loading}>
                      {loading ? "Creating…" : "Create Account"}
                    </Button>
                    <button type="button" onClick={() => setView("login")} className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors">
                      Already have an account? Sign In
                    </button>
                  </motion.form>
                )}

                {view === "forgot" && (
                  <motion.form key="forgot" onSubmit={handleForgotPassword} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="you@example.com" className="pl-9 h-9 text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm" disabled={loading}>
                      {loading ? "Sending…" : "Send Reset Link"}
                    </Button>
                    <button type="button" onClick={() => setView("login")} className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors">
                      ← Back to Sign In
                    </button>
                  </motion.form>
                )}

                {view === "request-access" && (
                  <motion.form key="request" onSubmit={handleRequestAccess} className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Full Name</Label>
                      <Input placeholder="Officer's full name" className="h-9 text-sm" value={fullName} onChange={e => setFullName(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Official Email</Label>
                      <Input type="email" placeholder="name@gov.in" className="h-9 text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Department</Label>
                        <Input placeholder="e.g. Revenue" className="h-9 text-sm" value={department} onChange={e => setDepartment(e.target.value)} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Designation</Label>
                        <Input placeholder="e.g. SDM" className="h-9 text-sm" value={designation} onChange={e => setDesignation(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Reason for Access</Label>
                      <Input placeholder="Brief justification" className="h-9 text-sm" value={reason} onChange={e => setReason(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm" disabled={loading}>
                      {loading ? "Submitting…" : "Submit Request"}
                    </Button>
                    <button type="button" onClick={() => setView("login")} className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors">
                      ← Back to Sign In
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <footer className="border-t border-border bg-card py-4 text-center">
        <p className="text-muted-foreground text-xs">
          © 2024 Government of India — Ministry of Law & Justice | Built with Blockchain & AI Security
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
