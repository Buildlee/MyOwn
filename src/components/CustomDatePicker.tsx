'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export function CustomDatePicker({ value, onChange }: Props) {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(value || new Date()));
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const handleSelect = (day: number) => {
        const selected = new Date(currentYear, currentMonth, day);
        onChange(selected.toISOString().split('T')[0]);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setViewDate(newDate);
    };

    return (
        <div className="relative w-full">
            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl p-4 cursor-pointer group hover:bg-white/20 transition-all font-bold"
            >
                <span className={cn(value ? "opacity-100" : "opacity-40")}>
                    {value || "选择日期"}
                </span>
                <Calendar className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>

            {/* Picker UI */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/10 sm:hidden"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 right-0 mt-2 z-[70] liquid-glass rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/20"
                            style={{
                                background: theme === 'dark'
                                    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)'
                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 px-1">
                                <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="font-black text-sm tracking-tight">
                                    {currentYear}年 {monthNames[currentMonth]}
                                </div>
                                <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Weekdays */}
                            <div className="grid grid-cols-7 mb-2">
                                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                                    <div key={d} className="text-[10px] text-center font-black text-foreground/40">{d}</div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {days.map((day, idx) => {
                                    const isSelected = day && new Date(value).getDate() === day && new Date(value).getMonth() === currentMonth && new Date(value).getFullYear() === currentYear;
                                    return (
                                        <div key={idx} className="aspect-square flex items-center justify-center">
                                            {day ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.12, backgroundColor: 'var(--hover-bg)' }}
                                                    whileTap={{ scale: 0.96 }}
                                                    type="button"
                                                    onClick={() => handleSelect(day)}
                                                    className={cn(
                                                        "w-full h-full rounded-xl text-xs font-black transition-colors flex items-center justify-center",
                                                        isSelected
                                                            ? "bg-foreground text-background shadow-xl scale-110"
                                                            : "text-foreground/80 hover:text-foreground"
                                                    )}
                                                    style={{ '--hover-bg': theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' } as any}
                                                >
                                                    {day}
                                                </motion.button>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
