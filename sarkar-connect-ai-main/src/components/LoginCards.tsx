import { motion } from "framer-motion";
import { User, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginCards = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role: 'admin' | 'user') => {
        if (role === 'admin') {
            navigate('/analytics'); // Assuming administrative dashboard
        } else {
            navigate('/'); // Or a specific public grievance engine path if different
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
            <motion.div
                whileHover={{ y: -8 }}
                className="group relative glass-dark rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-gold/10 overflow-hidden"
                onClick={() => handleRoleSelect('admin')}
            >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldCheck size={120} />
                </div>
                <div className="relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/20 group-hover:bg-gold transition-colors duration-500">
                        <ShieldCheck className="text-gold group-hover:text-navy-deep transition-colors" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Admin Login</h3>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        Access the official administrative dashboard for case management and analysis.
                    </p>
                    <div className="flex items-center gap-2 text-gold font-bold group-hover:gap-4 transition-all">
                        Login as Admin <ArrowRight size={20} />
                    </div>
                </div>
            </motion.div>

            <motion.div
                whileHover={{ y: -8 }}
                className="group relative glass-dark rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 overflow-hidden"
                onClick={() => handleRoleSelect('user')}
            >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <User size={120} />
                </div>
                <div className="relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white transition-colors duration-500">
                        <User className="text-white group-hover:text-navy-deep transition-colors" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">User/Citizen Login</h3>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        Register grievances, track status, and access the public grievance engine.
                    </p>
                    <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                        Login as Citizen <ArrowRight size={20} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginCards;
