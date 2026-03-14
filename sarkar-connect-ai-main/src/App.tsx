import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ResultsPage from "./pages/ResultsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CivicRewardsPage from "./pages/CivicRewardsPage";
import OfficerDashboardPage from "./pages/OfficerDashboardPage";
import SmartRTIPage from "./pages/SmartRTIPage";
import EvidenceVaultPage from "./pages/EvidenceVaultPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import LegalHelpChatbot from "./components/LegalHelpChatbot";
import CorruptionAlertSidebar from "./components/CorruptionAlertSidebar";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/" element={<Index />} />
              <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute requiredRole="official"><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><CivicRewardsPage /></ProtectedRoute>} />
              <Route path="/officer-dashboard" element={<ProtectedRoute requiredRole="official"><OfficerDashboardPage /></ProtectedRoute>} />
              <Route path="/smart-rti" element={<ProtectedRoute><SmartRTIPage /></ProtectedRoute>} />
              <Route path="/evidence-vault" element={<ProtectedRoute><EvidenceVaultPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>

        {/* Persistent Global Components */}
        <LegalHelpChatbot />
        <CorruptionAlertSidebar open={alertOpen} onClose={() => setAlertOpen(false)} />

        {/* Red Flag Alert Trigger */}
        <button
          onClick={() => setAlertOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-elevated hover:bg-primary/90 transition-colors"
          title="Performance Monitoring"
        >
          <AlertTriangle className="h-5 w-5 text-primary-foreground" />
        </button>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
