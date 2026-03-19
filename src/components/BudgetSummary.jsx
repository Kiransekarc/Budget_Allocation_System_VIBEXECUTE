import React from 'react';
import { Wallet, PiggyBank, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BudgetSummary({ income, allocatedAmount, remainingBalance }) {
    const isOverspent = remainingBalance < 0;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-3 xl:gap-5 my-6"
        >
            <motion.div variants={itemVariants} className="glass-panel glass-panel-hover p-4 xl:p-5 rounded-2xl flex items-center gap-3 xl:gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] shrink-0">
                    <Wallet size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Total Income</p>
                    <h3 className="text-base lg:text-sm xl:text-lg 2xl:text-xl font-bold tracking-tighter whitespace-nowrap">{formatCurrency(income || 0)}</h3>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-panel glass-panel-hover p-4 xl:p-5 rounded-2xl flex items-center gap-3 xl:gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0">
                    <ShoppingBag size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Allocated</p>
                    <h3 className="text-base lg:text-sm xl:text-lg 2xl:text-xl font-bold tracking-tighter whitespace-nowrap">{formatCurrency(allocatedAmount)}</h3>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className={`glass-panel glass-panel-hover p-4 xl:p-5 rounded-2xl flex items-center gap-3 xl:gap-4 relative overflow-hidden group ${isOverspent ? 'bg-red-500/10 border-red-500/30' : ''
                }`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${isOverspent ? 'from-red-500/20' : 'from-emerald-500/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                <div className={`p-3 shrink-0 rounded-xl border shadow-[0_0_15px_rgba(0,0,0,0.2)] ${isOverspent
                    ? 'bg-red-500/20 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    }`}>
                    <PiggyBank size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Remaining</p>
                    <h3 className={`text-base lg:text-sm xl:text-lg 2xl:text-xl font-bold tracking-tighter whitespace-nowrap ${isOverspent ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-emerald-400'}`}>
                        {formatCurrency(remainingBalance)}
                    </h3>
                </div>
            </motion.div>
        </motion.div>
    );
}
