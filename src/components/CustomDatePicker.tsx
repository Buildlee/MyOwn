'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
    value: string;
    onChange: (val: string) => void;
}

const WD = ['日', '一', '二', '三', '四', '五', '六'];
const MN = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const fmt = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(() => (value ? new Date(value) : new Date()));
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const y = view.getFullYear();
    const m = view.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const startPad = new Date(y, m, 1).getDay();
    const cells: (number | null)[] = [
        ...Array(startPad).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
        <div ref={ref} className="relative">
            <div className="group overflow-visible">
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className="rowitem w-full px-3.5 py-[11px] min-h-[46px] text-left"
                >
                    <span className="flex-1 text-[16px] tracking-[-0.012em] text-label tabular-nums">
                        {value || '选择日期'}
                    </span>
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
                        className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-bg rounded-[14px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                        style={{ boxShadow: '0 0 0 0.5px var(--sep), 0 8px 32px rgba(0,0,0,0.18)' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                type="button"
                                onClick={() => setView(new Date(y, m - 1, 1))}
                                className="w-7 h-7 grid place-items-center rounded-lg bg-fill text-label2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </motion.button>
                            <span className="text-[14px] font-semibold text-label tabular-nums">
                                {y} 年 {MN[m]}
                            </span>
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                type="button"
                                onClick={() => setView(new Date(y, m + 1, 1))}
                                className="w-7 h-7 grid place-items-center rounded-lg bg-fill text-label2"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-7 gap-0.5 mb-1">
                            {WD.map(d => (
                                <div key={d} className="text-[11px] font-medium text-label2 text-center py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-0.5">
                            {cells.map((d, i) => {
                                if (d === null) return <div key={`p${i}`} />;
                                const sel = value === fmt(y, m, d);
                                return (
                                    <motion.button
                                        key={d}
                                        whileTap={{ scale: 0.88 }}
                                        type="button"
                                        onClick={() => { onChange(fmt(y, m, d)); setOpen(false); }}
                                        className="aspect-square rounded-lg text-[13px] font-medium grid place-items-center transition-colors tabular-nums"
                                        style={sel
                                            ? { background: 'var(--tint)', color: '#fff' }
                                            : { color: 'var(--label)' }}
                                    >
                                        {d}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
