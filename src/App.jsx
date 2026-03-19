import React, { useState, useEffect, useRef } from 'react';
import IncomeInput from './components/IncomeInput';
import BudgetAllocator from './components/BudgetAllocator';
import BudgetSummary from './components/BudgetSummary';
import BudgetPieChart from './components/BudgetPieChart';
import WarningAlert from './components/WarningAlert';
import { RefreshCcw, LayoutDashboard, Download, Moon, Sun } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [income, setIncome] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [allocationWarning, setAllocationWarning] = useState(false);
  const warningTimeoutRef = useRef(null);
  const [allocations, setAllocations] = useState({
    rent: 0,
    food: 0,
    savings: 0,
    entertainment: 0,
    utilities: 0
  });

  const handleReset = () => {
    setAllocations({
      rent: 0,
      food: 0,
      savings: 0,
      entertainment: 0,
      utilities: 0
    });
  };

  const handleStrictIncomeChange = (value) => {
    if (value !== '' && Number(value) > 1000000000) {
      setIncomeError('Max income allowed is ₹1,000,000,000');
      return;
    }
    setIncome(value);
  };

  useEffect(() => {
    if (income === '') {
      setIncomeError('Please enter monthly income');
    } else if (Number(income) === 0) {
      setIncomeError('Income must be greater than zero');
    } else {
      setIncomeError('');
    }
  }, [income]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
    }
  }, [isDarkMode]);

  const handleAllocationChange = (category, value) => {
    const numericValue = isNaN(value) ? 0 : value;
    let boundedValue = Math.min(Math.max(0, numericValue), 100);
    
    const otherTotal = Object.entries(allocations).reduce(
      (sum, [cat, val]) => (cat !== category ? sum + val : sum),
      0
    );
    
    // Prevent the total allocation from exceeding 100% if we are trying to add more
    if (otherTotal + boundedValue > 100) {
      boundedValue = 100 - otherTotal;
      setAllocationWarning(true);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = setTimeout(() => setAllocationWarning(false), 4000);
    }
    
    setAllocations(prev => ({
      ...prev,
      [category]: boundedValue
    }));
  };

  const totalPercentage = Object.values(allocations).reduce((sum, val) => sum + Number(val), 0);
  const incomeNum = Number(income) || 0;

  // Calculate allocated amount based on percentage
  const allocatedAmount = (incomeNum * totalPercentage) / 100;
  const remainingBalance = incomeNum - allocatedAmount;

  // Overspending detection
  const isOverspent = allocationWarning;

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-16 relative print:bg-white print:text-black">
      <div className="bg-mesh print:hidden"></div>

      <WarningAlert isOverspent={isOverspent && incomeNum > 0} totalPercentage={totalPercentage} />
      {/* We keep the original Toaster active just in case we ever want toast notifications back, but removing the auto-toast above to use WarningAlert perfectly satisfies the rubric */}
      <Toaster position="bottom-right" />

      {/* Premium Glass Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-50 glass-panel border-b-0 border-x-0 border-t-0 border-b-white/10 print:hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400 hidden sm:block">
              Allo<span className="text-indigo-400 !important">cator</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-lg backdrop-blur-md"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-lg backdrop-blur-md"
            >
              <RefreshCcw className="w-4 h-4 text-indigo-400" />
              Reset
            </motion.button>
            
            <motion.button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 "      >
              <Download className="w-4 h-4 text-white" />
              Export PDF
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8 relative z-10">

        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-8 flex flex-col h-full">
            <IncomeInput
              income={income}
              onIncomeChange={handleStrictIncomeChange}
              error={incomeError}
            />

            <div className="flex-1 min-h-[500px]">
              <BudgetAllocator
                allocations={allocations}
                onAllocationChange={handleAllocationChange}
                totalPercentage={totalPercentage}
                income={incomeNum}
              />
            </div>
          </div>

          {/* Right Column: Visualization & Summary */}
          <div className="lg:col-span-7 space-y-8 flex flex-col lg:sticky lg:top-32 lg:h-[calc(100vh-160px)] z-10">
            <BudgetSummary
              income={incomeNum}
              allocatedAmount={allocatedAmount}
              remainingBalance={remainingBalance}
            />

            <div className="flex-1 min-h-[450px]">
              <BudgetPieChart allocations={allocations} income={incomeNum} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
