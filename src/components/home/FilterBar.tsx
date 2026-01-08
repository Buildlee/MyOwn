'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
    sortBy: 'date' | 'value' | 'cost';
    setSortBy: (val: 'date' | 'value' | 'cost') => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (val: 'asc' | 'desc') => void;
    onToggleOrder: () => void;
}

export function FilterBar({ sortBy, setSortBy, sortOrder, setSortOrder, onToggleOrder }: FilterBarProps) {
    return (
        <div className="space-y-4">
            <div className="px-4 flex items-center gap-2.5 mb-2">
                <div className="p-1 rounded-md bg-primary/10">
                    <Layers className="w-3 h-3 text-primary/70" />
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">浏览视角 / 排序维度</span>
            </div>

            <div className="flex items-center justify-between px-2 gap-3 h-[52px] liquid-glass p-1.5 rounded-[1.4rem] mx-1.5 shadow-xl border-white/40 dark:border-white/10">
                {/* Left: Sort Dimension */}
                <div className="relative flex-1 flex items-center h-full">
                    <motion.div
                        layoutId="sort-pill"
                        className="absolute h-full bg-foreground rounded-[0.9rem] shadow-lg shadow-foreground/10 transform-gpu will-change-[left,width]"
                        initial={false}
                        animate={{
                            left: sortBy === 'date' ? '0%' : sortBy === 'value' ? '33.3%' : '66.6%',
                            width: 'calc(33.3%)'
                        }}
                        transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
                    />
                    {[
                        { id: 'date', label: '使用时间' },
                        { id: 'value', label: '总价值' },
                        { id: 'cost', label: '感知价值' },
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => {
                                if (sortBy !== s.id) {
                                    setSortBy(s.id as any);
                                    // Removed automatic reset to 'desc'
                                }
                            }}
                            className={cn(
                                "relative z-10 flex-1 flex items-center justify-center px-1 text-[10px] font-black tracking-widest uppercase transition-colors whitespace-nowrap h-full",
                                sortBy === s.id ? "text-background" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Elegant Divider */}
                <div className="w-[1px] h-4 bg-foreground/10 mx-1 shrink-0" />

                {/* Right: Order Toggle */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggleOrder}
                    className="flex items-center gap-2 px-4 h-full rounded-[0.9rem] text-muted-foreground hover:text-foreground transition-all active:bg-black/[0.1] dark:active:bg-white/10 group bg-transparent border-none shrink-0"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={sortOrder}
                            initial={{ opacity: 0, rotate: sortOrder === 'desc' ? -90 : 90, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: sortOrder === 'desc' ? 90 : -90, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            {sortOrder === 'desc' ? (
                                <ArrowDownWideNarrow className="w-4 h-4 text-primary" />
                            ) : (
                                <ArrowUpNarrowWide className="w-4 h-4 text-primary" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
                        {sortOrder === 'desc' ? '从大到小' : '从小到大'}
                    </span>
                </motion.button>
            </div>
        </div>
    );
}
