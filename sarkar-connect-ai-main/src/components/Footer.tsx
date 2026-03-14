import { motion } from "framer-motion";

const Footer = () => {
    return (
        <footer className="py-12 bg-navy-deep border-t border-white/5">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="flex items-center gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                        {/* Logo or emblem could go here */}
                    </div>
                    <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
                        Government of India — Ministry of Law & Justice
                    </p>
                    <div className="flex gap-8 mt-4 text-white/20 text-xs">
                        <span>© 2026 SarkarConnect AI. All Rights Reserved.</span>
                        <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
