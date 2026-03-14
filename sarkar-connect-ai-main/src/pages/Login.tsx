import { motion } from "framer-motion";
import LoginCards from "@/components/LoginCards";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen gradient-navy-hero bg-grid-pattern flex flex-col items-center justify-center py-12 px-4 relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-medium"
            >
                <ArrowLeft size={20} /> Back to Landing
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6">
                    Access Portal
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                    Secure <span className="text-gold">Role-Based</span> Login
                </h1>
                <p className="text-white/60 max-w-lg mx-auto">
                    Please select your role to proceed to the appropriate section of the National Agentic Legal-Grievance Engine.
                </p>
            </motion.div>

            <LoginCards />

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
};

export default Login;
