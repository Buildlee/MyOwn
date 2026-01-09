'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingDown } from 'lucide-react';

interface StatsOverviewProps {
    summary: {
        totalValue: number;
        dailyCost: number;
    };
}

export function StatsOverview({ summary }: StatsOverviewProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full grid grid-cols-2 gap-px liquid-glass rounded-[2rem] overflow-hidden transform-gpu shadow-lg hover:shadow-2xl transition-all duration-300 group backface-hidden"
        >
            <div className="bg-transparent p-5 sm:p-7 flex flex-col justify-center min-h-[100px] sm:min-h-[120px] transition-all border-r border-black/[0.03] dark:border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 space-y-1">
                    <div className="flex items-center space-x-2 text-muted-foreground/60">
                        <Wallet className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase">资产总览</span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-bold opacity-20 italic">¥</span>
                        <div className="text-3xl sm:text-4xl font-black tracking-tightest">
                            {summary.totalValue.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-transparent p-5 sm:p-7 flex flex-col justify-center min-h-[100px] sm:min-h-[120px] transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 space-y-1">
                    <div className="flex items-center space-x-2 text-muted-foreground/60">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-500/60" />
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase">日均成本</span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-bold opacity-20 italic">¥</span>
                        <div className="text-3xl sm:text-4xl font-black text-emerald-500/90 tracking-tightest">
                            {summary.dailyCost.toFixed(1)}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
