'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    PieChart,
    TrendingUp,
    Wallet,
    Tag,
    BarChart3,
    ArrowRight,
    Sparkles,
    Timer,
    History
} from 'lucide-react';
import { Item, ItemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface StatsDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    items: Item[];
    status: ItemStatus;
}

export function StatsDashboard({ isOpen, onClose, items, status }: StatsDashboardProps) {
    const isUsing = status === 'using';
    const filteredItems = useMemo(() => items.filter(i => i.status === status), [items, status]);

    const stats = useMemo(() => {
        const totalValue = filteredItems.reduce((acc, curr) => acc + curr.price, 0);

        // Category Distribution
        const categories: Record<string, number> = {};
        filteredItems.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + item.price;
        });

        const sortedCategories = Object.entries(categories)
            .sort(([, a], [, b]) => b - a)
            .map(([name, value]) => ({
                name,
                value,
                percentage: (value / totalValue) * 100
            }));

        // Efficiency Analysis (Cost per day/use)
        const itemsWithCost = filteredItems.map(item => {
            const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / 86400000));
            const cost = item.costType === 'daily' ? (item.price / days) : (item.price / item.usageCount);
            return { ...item, dailyCost: cost };
        }).sort((a, b) => a.dailyCost - b.dailyCost);

        const efficientItems = itemsWithCost.slice(0, 3);
        const highCostItems = [...itemsWithCost].reverse().slice(0, 3);

        const totalDailyBurn = itemsWithCost.reduce((acc, curr) => acc + curr.dailyCost, 0);

        return {
            totalValue,
            sortedCategories,
            efficientItems,
            highCostItems,
            totalDailyBurn,
            count: filteredItems.length
        };
    }, [filteredItems]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[300] bg-black/10 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            >
                <motion.div
                    initial={{ scale: 0.96, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.96, opacity: 0, y: 15 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
                    className="w-full max-w-4xl max-h-[90vh] liquid-glass dark:bg-[#0a0a0c]/98 border border-white/40 dark:border-white/5 rounded-[2.5rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative"
                >
                    {/* Header */}
                    <div className="p-8 pb-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 border border-white/20",
                                isUsing ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-500" : "bg-primary/20 text-primary"
                            )}>
                                {isUsing ? <TrendingUp className="w-6 h-6" /> : <History className="w-6 h-6" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-black dark:text-white">{isUsing ? '使用中资产全景' : '已归档资产回顾'}</h2>
                                <p className="text-[10px] font-black tracking-[0.2em] text-black dark:text-muted-foreground uppercase opacity-70">
                                    Statistics <span className="mx-1">·</span> {stats.count} Items
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-black dark:text-muted-foreground" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Key Stats */}
                            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-[2rem] bg-emerald-500/[0.1] dark:bg-emerald-500/[0.05] border border-emerald-500/20 flex flex-col justify-between group overflow-hidden relative shadow-sm">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-emerald-500/60 mb-2">资产总值</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black tracking-tighter text-black dark:text-emerald-400">¥{stats.totalValue.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-primary/[0.1] dark:bg-primary/[0.05] border border-primary/20 flex flex-col justify-between group overflow-hidden relative shadow-sm">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-primary/60 mb-2">每日均摊感官成本</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black tracking-tighter text-black dark:text-violet-400">¥{stats.totalDailyBurn.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Category Distribution */}
                            <div className="p-6 rounded-[2rem] bg-black/[0.05] dark:bg-white/[0.02] border border-black/10 dark:border-white/5 shadow-inner">
                                <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-muted-foreground/60 mb-4 block">资产权重分布</span>
                                <div className="space-y-4">
                                    {stats.sortedCategories.slice(0, 3).map(cat => (
                                        <div key={cat.name} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-black dark:text-white/80">{cat.name}</span>
                                                <span className="text-black dark:text-muted-foreground opacity-100 dark:opacity-50">{cat.percentage.toFixed(0)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${cat.percentage}%` }}
                                                    className="h-full bg-black dark:bg-foreground/20 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Efficiency Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black dark:text-emerald-500/80 mb-4 ml-2">
                                    <Sparkles className="w-3.5 h-3.5" /> 高效能项目 (性价比之王)
                                </h3>
                                <div className="space-y-3">
                                    {stats.efficientItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-white/80 dark:border-white/10 hover:bg-white dark:hover:bg-black/[0.05] transition-colors shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="text-xs font-bold truncate max-w-[120px] text-black dark:text-white/80">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-black dark:text-emerald-500">¥{item.dailyCost.toFixed(2)} / 天</div>
                                                <div className="text-[8px] font-bold text-black/60 dark:text-slate-400 uppercase tracking-tighter">Cost Ratio</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black dark:text-primary/80 mb-4 ml-2">
                                    <Timer className="w-3.5 h-3.5" /> 高值待感知 (重点关注)
                                </h3>
                                <div className="space-y-3">
                                    {stats.highCostItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-white/80 dark:border-white/10 hover:bg-white dark:hover:bg-black/[0.05] transition-colors shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="text-xs font-bold truncate max-w-[120px] text-black dark:text-white/80">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-black dark:text-primary">¥{item.dailyCost.toFixed(2)} / 天</div>
                                                <div className="text-[8px] font-bold text-black/60 dark:text-slate-400 uppercase tracking-tighter">Focus Index</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Tip */}
                    <div className="p-8 pt-4 shrink-0">
                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                <PieChart className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-bold text-black dark:text-primary/80 leading-relaxed">
                                <span className="font-black mr-2 uppercase text-black dark:text-white">Insight:</span>
                                统计数据将实时反应您的消费效率。多使用高效能项目，持续提升您的整体感知价值。
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
