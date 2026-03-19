import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WarningAlert({ isOverspent, totalPercentage }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOverspent) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [isOverspent, totalPercentage]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 right-6 z-50 w-11/12 max-w-sm"
                >
                    <div className="glass-panel bg-red-500/20 border-red-500/50 p-4 rounded-xl shadow-[0_10px_40px_rgba(239,68,68,0.3)] flex items-start gap-4">
                        <div className="p-2 bg-red-500/30 rounded-full text-red-300 shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-red-300 font-bold">Warning: Budget allocation exceeds available income.</h3>
                            <p className="text-red-200/80 text-sm mt-1">Please adjust your categories.</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
