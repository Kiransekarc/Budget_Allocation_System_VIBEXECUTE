import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { id: 'rent', label: 'Rent', color: 'text-indigo-400', bg: 'indigo', shadow: 'rgba(129, 140, 248, 0.5)' },
    { id: 'food', label: 'Food', color: 'text-emerald-400', bg: 'emerald', shadow: 'rgba(52, 211, 153, 0.5)' },
    { id: 'savings', label: 'Savings', color: 'text-amber-400', bg: 'amber', shadow: 'rgba(251, 191, 36, 0.5)' },
    { id: 'entertainment', label: 'Entertainment', color: 'text-rose-400', bg: 'rose', shadow: 'rgba(251, 113, 133, 0.5)' },
    { id: 'utilities', label: 'Utilities', color: 'text-fuchsia-400', bg: 'fuchsia', shadow: 'rgba(232, 121, 249, 0.5)' }
];

export default function BudgetAllocator({ allocations, onAllocationChange, totalPercentage, income }) {
    const isOverAllocated = totalPercentage > 100;
    const incomeNum = Number(income) || 0;

    const handleAmountChange = (categoryId, amountValue) => {
        if (incomeNum <= 0) return;
        const numValue = Number(amountValue);
        if (isNaN(numValue)) return;
        const newPercentage = (numValue / incomeNum) * 100;
        onAllocationChange(categoryId, newPercentage);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel rounded-2xl p-6 h-full flex flex-col relative"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                        <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                    </div>
                    Budget Allocation
                </h2>

                <div className="flex flex-col items-end gap-1">
                    <motion.div
                        animate={{ scale: isOverAllocated ? [1, 1.05, 1] : 1 }}
                        transition={{ repeat: isOverAllocated ? Infinity : 0, duration: 1 }}
                        className={`px-4 py-1.5 text-sm font-bold rounded-full border backdrop-blur-md ${isOverAllocated
                            ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                            : totalPercentage > 90 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                    >
                        Total: {totalPercentage.toFixed(1)}%
                    </motion.div>
                    {totalPercentage < 100 && incomeNum > 0 && (
                        <p className="text-xs text-emerald-400 font-medium">unallocated: {(100 - totalPercentage).toFixed(1)}%</p>
                    )}
                    {totalPercentage === 100 && incomeNum > 0 && (
                        <p className="text-xs text-blue-400 font-medium">Budget fully allocated</p>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isOverAllocated && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-medium rounded-xl flex items-center relative z-10"
                    >
                        ⚠️ Total allocation exceeds 100%. Please adjust your budget.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-8 flex-1 overflow-y-auto pr-2 relative z-10">
                {CATEGORIES.map((category, index) => {
                    const currentPercent = allocations[category.id] || 0;
                    const currentAmount = (incomeNum * currentPercent) / 100;

                    return (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            key={category.id}
                            className="group"
                        >
                            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end mb-3 gap-3">
                                <label htmlFor={category.id} className={`font-semibold text-lg tracking-wide ${category.color} drop-shadow-md`}>
                                    {category.label}
                                </label>
                                <div className="flex items-center gap-3 self-start xl:self-auto bg-slate-800/50 p-1.5 rounded-lg border border-slate-700/50">
                                    {/* Amount Input */}
                                    <div className="relative flex items-center">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-400 font-medium">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={currentAmount === 0 ? '' : currentAmount.toFixed(0)}
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => handleAmountChange(category.id, e.target.value)}
                                            placeholder="0"
                                            disabled={incomeNum <= 0}
                                            className="w-24 pl-7 pr-3 py-1.5 text-right font-medium text-white glass-input rounded-md disabled:opacity-50"
                                        />
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${incomeNum <= 0 ? 'text-slate-700' : 'text-slate-500'}`}>or</span>
                                    {/* Percentage Input */}
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            id={category.id}
                                            min="0"
                                            max="100"
                                            value={currentPercent === 0 ? '' : Number(currentPercent).toFixed(1)}
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => onAllocationChange(category.id, Number(e.target.value))}
                                            placeholder="0"
                                            disabled={incomeNum <= 0}
                                            className="w-16 px-3 py-1.5 text-right font-medium text-white glass-input rounded-md disabled:opacity-50"
                                        />
                                        <span className={`text-sm font-bold ml-2 mr-1 ${incomeNum <= 0 ? 'text-slate-600' : 'text-slate-400'}`}>%</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`relative pt-1 ${incomeNum <= 0 ? 'opacity-50 grayscale' : ''}`}>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={currentPercent}
                                    onChange={(e) => onAllocationChange(category.id, Number(e.target.value))}
                                    disabled={incomeNum <= 0}
                                    className={`w-full h-2 rounded-lg appearance-none absolute top-1/2 -translate-y-1/2 z-10 opacity-0 md:opacity-100 ${incomeNum <= 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                />
                                {/* Custom Track visualization */}
                                <div
                                    className="h-2 w-full bg-slate-800/80 rounded-full border border-slate-700 overflow-hidden absolute top-1/2 -translate-y-1/2 pointer-events-none"
                                >
                                    <motion.div
                                        className="h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${currentPercent}%` }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        style={{
                                            backgroundColor: `var(--color-${category.bg}-500)`,
                                            boxShadow: `0 0 10px ${category.shadow}, 0 0 20px ${category.shadow}`
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
