import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const PageLoader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Initial load effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Initial load takes 1.5s to show off the logo
        return () => clearTimeout(timer);
    }, []);

    // Route change effect
    useEffect(() => {
        // Don't trigger if it's just a hash change on the same page
        if (location.hash) return;

        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // Shorter duration for page transitions

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
                >
                    {/* Pulsing Logo */}
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-8"
                    >
                        <img
                            src="/images/eversol.png"
                            alt="Eversol Logo"
                            className="h-24 md:h-32 w-auto object-contain drop-shadow-lg"
                        />
                    </motion.div>

                    {/* Glowing Progress Bar */}
                    <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                repeat: Infinity,
                            }}
                            className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-sm font-medium text-gray-500 tracking-widest uppercase"
                    >
                        Powering the Future...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
