import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Citizen Portal", path: "/" },
  { label: "Smart RTI", path: "/smart-rti" },
  { label: "Evidence Vault", path: "/evidence-vault" },
  { label: "Community Watch", path: "/neighbourhood-watch" },
  { label: "Legal Library", path: "/results" },
  { label: "Rewards", path: "/rewards" },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Saffron stripe */}
      <div className="h-[3px] bg-saffron w-full" />
      <header className="gradient-navy sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
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
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors bg-white/10 text-white"
            >
              Citizen Portal
            </Link>
            {navItems.slice(1).map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="px-3 py-1.5 rounded text-xs font-semibold tracking-wide text-white/60 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to={user ? (location.pathname === '/' ? '/results' : '/') : '/login'}
                  className="px-4 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all bg-white/10 text-white hover:bg-white/20"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all bg-gold text-navy-deep hover:bg-gold-light shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2"
                >
                  <LogOut className="h-3 w-3" /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all bg-gold text-navy-deep hover:bg-gold-light shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Secure Login
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-primary-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {/* India green stripe */}
        <div className="h-[2px] bg-india-green w-full" />
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-card overflow-hidden border-b border-border sticky top-[calc(3px+3.5rem+2px)] z-40"
          >
            <div className="container py-2 flex flex-col gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
