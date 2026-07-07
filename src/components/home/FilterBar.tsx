'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';

interface FilterBarProps {
    sortBy: 'date' | 'value' | 'cost';
    setSortBy: (val: 'date' | 'value' | 'cost') => void;
    sortOrder: 'asc' | 'desc';
    onToggleOrder: () => void;
}

export function FilterBar({ sortBy, setSortBy, sortOrder, onToggleOrder }: FilterBarProps) {
    const items = [
        { id: 'date' as const, label: '时间' },
        { id: 'value' as const, label: '价值' },
        { id: 'cost' as const, label: '成本' },
    ];

    return (
        <motion.div
            initial={{ y: 8, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
        >
            <div className="flex-1 flex bg-card2 rounded-[0.625rem] p-0.5 border border-border">
                {items.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setSortBy(s.id)}
                        className={`flex-1 py-[7px] text-[13px] font-medium rounded-[0.4375rem] transition-all press ${
                            sortBy === s.id
                                ? 'bg-text text-bg shadow-sm'
                                : 'text-text2 hover:text-text'
                        }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onToggleOrder}
                className="w-[34px] h-[34px] flex items-center justify-center rounded-[0.625rem] bg-card2 border border-border text-text2 hover:text-text transition-colors"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={sortOrder}
                        initial={{ opacity: 0, rotate: sortOrder === 'desc' ? -90 : 90, scale: 0.7 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: sortOrder === 'desc' ? 90 : -90, scale: 0.7 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        {sortOrder === 'desc'
                            ? <ArrowDownWideNarrow className="w-[16px] h-[16px]" />
                            : <ArrowUpNarrowWide className="w-[16px] h-[16px]" />
                        }
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </motion.div>
    );
}
