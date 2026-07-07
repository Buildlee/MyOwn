'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingDown } from 'lucide-react';
import { formatLargeNumber } from '@/lib/utils';

interface StatsOverviewProps {
    summary: { totalValue: number; dailyCost: number };
}

export function StatsOverview({ summary }: StatsOverviewProps) {
    return (
        <motion.div
            initial={{ y: 12, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-3"
        >
            <div className="card p-5 space-y-2.5 press">
                <div className="flex items-center gap-2 text-text3">
                    <Wallet className="w-[14px] h-[14px]" />
                    <span className="text-xs font-medium tracking-wide">资产总览</span>
                </div>
                <div className="flex items-baseline gap-0.5">
                    <span className="text-sm text-text3 font-medium">¥</span>
                    <span className="text-[32px] font-bold text-text tracking-tightest leading-none">
                        {formatLargeNumber(summary.totalValue)}
                    </span>
                </div>
            </div>

            <motion.div
                initial={{ y: 12, opacity: 0.9 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="card p-5 space-y-2.5 press"
            >
                <div className="flex items-center gap-2 text-text3">
                    <TrendingDown className="w-[14px] h-[14px]" />
                    <span className="text-xs font-medium tracking-wide">日均成本</span>
                </div>
                <div className="flex items-baseline gap-0.5">
                    <span className="text-sm text-text3 font-medium">¥</span>
                    <span className="text-[32px] font-bold text-text tracking-tightest leading-none">
                        {formatLargeNumber(summary.dailyCost, 1)}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}
