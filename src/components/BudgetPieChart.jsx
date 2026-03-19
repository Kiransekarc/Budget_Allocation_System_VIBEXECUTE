import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#fb7185', '#e879f9'];
const SHADOWS = ['rgba(129, 140, 248, 0.4)', 'rgba(52, 211, 153, 0.4)', 'rgba(251, 191, 36, 0.4)', 'rgba(251, 113, 133, 0.4)', 'rgba(232, 121, 249, 0.4)'];

export default function BudgetPieChart({ allocations, income = 0 }) {
    const data = [
        { name: 'Rent', value: allocations.rent },
        { name: 'Food', value: allocations.food },
        { name: 'Savings', value: allocations.savings },
        { name: 'Entertainment', value: allocations.entertainment },
        { name: 'Utilities', value: allocations.utilities },
    ].filter(item => item.value > 0);

    const totalPercent = data.reduce((sum, item) => sum + item.value, 0);
    const totalAllocatedAmount = (income * totalPercent) / 100;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const amount = (income * data.value) / 100;
            const color = payload[0].color;

            return (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl relative z-10">
                    <p className="font-bold text-lg mb-2 flex items-center gap-2 text-white">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></span>
                        {data.name}
                    </p>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-300 flex justify-between gap-4">
                            <span>Amount:</span>
                            <span className="font-bold">{formatCurrency(amount)}</span>
                        </p>
                        <p className="text-sm text-slate-300 flex justify-between gap-4">
                            <span>Allocation:</span>
                            <span className="font-bold">{data.value.toFixed(1)}%</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
            className="glass-panel glass-panel-hover p-6 rounded-2xl h-full flex flex-col items-center relative"
        >
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                        <PieChartIcon className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    Detailed Insights
                </h2>
                {totalPercent > 0 && (
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Allocated</p>
                        <p className="text-lg font-bold text-fuchsia-300">{formatCurrency(totalAllocatedAmount)}</p>
                    </div>
                )}
            </div>

            {totalPercent > 0 ? (
                <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row items-center justify-center relative z-10 gap-6 lg:gap-2 overflow-hidden">
                    <div className="w-full lg:w-1/2 shrink-0 h-72 sm:h-80 lg:h-[450px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    {COLORS.map((color, index) => (
                                        <filter key={`glow-${index}`} id={`glow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={color} floodOpacity="0.5" />
                                        </filter>
                                    ))}
                                </defs>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={95}
                                    outerRadius={140}
                                    paddingAngle={6}
                                    dataKey="value"
                                    stroke="rgba(15, 23, 42, 0.8)"
                                    strokeWidth={3}
                                    animationBegin={200}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            filter={`url(#glow-${index})`}
                                            className="hover:opacity-80 transition-opacity cursor-pointer transform hover:scale-105 duration-300"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} wrapperStyle={{ zIndex: 50 }} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Centered Donut Text */}
                        <div className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] text-center pointer-events-none z-0">
                            <p className="text-sm font-semibold text-slate-400">Total Uses</p>
                            <p className="text-3xl font-bold drop-shadow-lg">{totalPercent.toFixed(1)}%</p>
                        </div>
                    </div>

                    {/* Detailed Breakdown Sidebar */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center gap-3 overflow-y-auto lg:self-stretch lg:justify-start lg:py-2 pr-1">
                        {data.map((item, index) => {
                            const amount = (income * item.value) / 100;
                            const color = COLORS[index % COLORS.length];
                            return (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (index * 0.1) }}
                                    key={item.name}
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/40 transition-colors shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 shrink-0 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></span>
                                        <span className="font-medium text-slate-200 text-sm truncate">{item.name}</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-sm">{formatCurrency(amount)}</p>
                                        <p className="text-xs text-slate-400 font-medium">{item.value.toFixed(1)}%</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-slate-500 w-full h-72 border-2 border-dashed border-slate-700/50 rounded-xl relative z-10 bg-slate-800/20"
                >
                    <PieChartIcon className="w-14 h-14 mb-4 text-slate-600 drop-shadow-md" />
                    <p className="font-medium text-lg tracking-wide">No allocation yet</p>
                </motion.div>
            )}
        </motion.div>
    );
}
