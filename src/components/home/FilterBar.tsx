'use client';

import { motion } from 'framer-motion';
import { ArrowDownUp } from 'lucide-react';

type SortBy = 'date' | 'value' | 'cost';

interface FilterBarProps {
    sortBy: SortBy;
    setSortBy: (val: SortBy) => void;
    sortOrder: 'asc' | 'desc';
    onToggleOrder: () => void;
}

const OPTIONS: { id: SortBy; label: string }[] = [
    { id: 'date', label: '时间' },
    { id: 'value', label: '价值' },
    { id: 'cost', label: '成本' },
];

/** iOS 原生分段控件：白色滑块浮在灰轨道上 */
export function FilterBar({ sortBy, setSortBy, sortOrder, onToggleOrder }: FilterBarProps) {
    return (
        <div className="flex items-center gap-3 px-3.5 py-2.5">
            <div className="flex-1 flex bg-fill rounded-[9px] p-0.5 relative">
                {OPTIONS.map(o => {
                    const on = sortBy === o.id;
                    return (
                        <button
                            key={o.id}
                            onClick={() => setSortBy(o.id)}
                            className="flex-1 relative z-10 py-1.5 text-[13px] rounded-[7px] transition-colors"
                            style={{
                                color: on ? 'var(--label)' : 'var(--label2)',
                                fontWeight: on ? 600 : 500,
                            }}
                        >
                            {on && (
                                <motion.span
                                    layoutId="sort-pill"
                                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                    className="absolute inset-0 rounded-[7px] bg-card shadow-[0_1.5px_4px_rgba(0,0,0,0.14)] dark:bg-[oklch(0.34_0.004_265)]"
                                    style={{ zIndex: -1 }}
                                />
                            )}
                            {o.label}
                        </button>
                    );
                })}
            </div>

            <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={onToggleOrder}
                aria-label={sortOrder === 'desc' ? '从大到小' : '从小到大'}
                className="w-7 h-7 grid place-items-center rounded-lg text-label2 active:opacity-60 transition-opacity"
            >
                <motion.span
                    animate={{ rotate: sortOrder === 'desc' ? 0 : 180 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    className="grid place-items-center"
                >
                    <ArrowDownUp className="w-[15px] h-[15px]" />
                </motion.span>
            </motion.button>
        </div>
    );
}
