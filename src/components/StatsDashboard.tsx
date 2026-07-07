'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Timer, History, Sparkles } from 'lucide-react';
import { Item, ItemStatus } from '@/lib/types';
import { useMemo } from 'react';

interface StatsDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    items: Item[];
    status: ItemStatus;
}

export function StatsDashboard({ isOpen, onClose, items, status }: StatsDashboardProps) {
    const isUsing = status === 'using';
    const filtered = useMemo(() => items.filter(i => i.status === status), [items, status]);

    const stats = useMemo(() => {
        const totalValue = filtered.reduce((a, c) => a + c.price, 0);
        const cats: Record<string, number> = {};
        filtered.forEach(i => { cats[i.category] = (cats[i.category] || 0) + i.price; });
        const sorted = Object.entries(cats).sort(([, a], [, b]) => b - a)
            .map(([n, v]) => ({ name: n, value: v, pct: (v / totalValue) * 100 }));

        const withCost = filtered.map(i => {
            const days = Math.max(1, Math.floor((Date.now() - new Date(i.purchaseDate).getTime()) / 86400000));
            const cost = i.costType === 'daily' ? (i.price / days) : (i.price / Math.max(1, i.usageCount));
            return { ...i, dailyCost: cost };
        }).sort((a, b) => a.dailyCost - b.dailyCost);

        return {
            totalValue,
            sorted,
            efficient: withCost.slice(0, 3),
            highCost: [...withCost].reverse().slice(0, 3),
            dailyBurn: withCost.reduce((a, c) => a + c.dailyCost, 0),
            count: filtered.length,
        };
    }, [filtered]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] backdrop flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", damping: 28, stiffness: 300 }}
                    className="w-full max-w-lg max-h-[85vh] bg-bg rounded-2xl overflow-hidden flex flex-col shadow-xl border border-border">
                    
                    <div className="p-5 pb-3 flex items-center justify-between shrink-0 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-card2 flex items-center justify-center text-text2">
                                {isUsing ? <TrendingUp className="w-4 h-4" /> : <History className="w-4 h-4" />}
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-text">{isUsing ? '使用中资产' : '已归档资产'}</h2>
                                <p className="text-xs text-text3">{stats.count} 件物品</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card2 transition-colors">
                            <X className="w-4 h-4 text-text2" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="card p-4">
                                <p className="text-xs text-text3 mb-1 font-medium">资产总值</p>
                                <p className="text-2xl font-bold text-text tracking-tight">¥{stats.totalValue.toLocaleString()}</p>
                            </div>
                            <div className="card p-4">
                                <p className="text-xs text-text3 mb-1 font-medium">日均成本</p>
                                <p className="text-2xl font-bold text-text tracking-tight">¥{stats.dailyBurn.toFixed(2)}</p>
                            </div>
                        </div>

                        {stats.sorted.length > 0 && (
                            <div className="card p-4 space-y-3">
                                <p className="text-xs font-medium text-text3">类别分布</p>
                                {stats.sorted.slice(0, 4).map(cat => (
                                    <div key={cat.name}>
                                        <div className="flex justify-between text-[13px] mb-1">
                                            <span className="text-text font-medium">{cat.name}</span>
                                            <span className="text-text3">{cat.pct.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1 bg-border rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }}
                                                className="h-full bg-text rounded-full" transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {stats.efficient.length > 0 && (
                            <div>
                                <p className="flex items-center gap-1.5 text-xs font-medium text-text3 mb-2.5">
                                    <Sparkles className="w-3.5 h-3.5" /> 高效能
                                </p>
                                <div className="space-y-2">
                                    {stats.efficient.map(i => (
                                        <div key={i.id} className="card p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-lg">{i.icon}</span>
                                                <span className="text-[13px] font-medium text-text truncate max-w-[120px]">{i.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-text">¥{i.dailyCost.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {stats.highCost.length > 0 && (
                            <div>
                                <p className="flex items-center gap-1.5 text-xs font-medium text-text3 mb-2.5">
                                    <Timer className="w-3.5 h-3.5" /> 关注
                                </p>
                                <div className="space-y-2">
                                    {stats.highCost.map(i => (
                                        <div key={i.id} className="card p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-lg">{i.icon}</span>
                                                <span className="text-[13px] font-medium text-text truncate max-w-[120px]">{i.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-text">¥{i.dailyCost.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
