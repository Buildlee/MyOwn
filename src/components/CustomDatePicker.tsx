'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CustomDatePickerProps {
    value: string;
    onChange: (val: string) => void;
}

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(value ? new Date(value) : new Date());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const y = view.getFullYear();
    const m = view.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    const start = new Date(y, m, 1).getDay();
    const grid: (number | null)[] = Array(start).fill(null).concat(Array.from({ length: days }, (_, i) => i + 1));
    const wd = ['日', '一', '二', '三', '四', '五', '六'];
    const mn = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    return (
        <div ref={ref} className="relative">
            <button type="button" onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between card px-4 py-2.5 text-[15px] text-text outline-none focus:ring-1 focus:ring-text/20">
                <span>{value || '选择日期'}</span>
                <Calendar className="w-[18px] h-[18px] text-text3" />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-2 left-0 right-0 z-50 bg-bg rounded-xl border border-border shadow-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                            <button type="button" onClick={() => setView(new Date(y, m - 1, 1))}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-card2 text-text2">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-semibold text-text">{y}年 {mn[m]}</span>
                            <button type="button" onClick={() => setView(new Date(y, m + 1, 1))}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-card2 text-text2">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 mb-1">
                            {wd.map(d => <div key={d} className="text-[11px] text-center text-text3/50 font-medium py-1">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                            {grid.map((d, i) => {
                                const sel = d && value === `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                return (
                                    <button key={i} type="button" disabled={!d} onClick={() => { if (d) { onChange(`${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`); setOpen(false); } }}
                                        className={`aspect-square rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                                            !d ? 'invisible' : sel ? 'bg-text text-bg' : 'text-text hover:bg-card2'
                                        }`}>
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
