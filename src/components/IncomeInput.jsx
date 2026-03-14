import React from 'react';
import { IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncomeInput({ income, onIncomeChange, error }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden group"
        >
            {/* Animated glowing border top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

            <h2 className="text-xl font-bold mb-5 text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <IndianRupee className="w-5 h-5" />
                </div>
                Monthly Income
            </h2>

            <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-semibold text-lg">₹</span>
                </div>
                <input
                    type="number"
                    min="0"
                    max="1000000000"
                    value={income || ''}
                    onKeyDown={(e) => {
                        if (['e', 'E', '+', '-'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => onIncomeChange(e.target.value)}
                    placeholder="Enter your total budget"
                    className={`w-full glass-input pl-10 pr-4 py-4 text-lg rounded-xl focus:outline-none transition-all ${error
                        ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)] focus:bg-red-500/5'
                        : ''
                        }`}
                />
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 text-sm text-red-400 font-medium flex items-center gap-1.5"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    {error}
                </motion.p>
            )}

            {/* Visual fluff: subtle orb */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        </motion.div>
    );
}
