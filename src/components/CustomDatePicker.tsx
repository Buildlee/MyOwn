'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

type ViewMode = 'date' | 'month' | 'year';

export function CustomDatePicker({ value, onChange }: Props) {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('date');
    const triggerRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    // Helper to safely parse any date string
    const parseDate = (val: string) => {
        if (!val) return new Date();
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d;

        const parts = val.split('-');
        if (parts.length === 3) {
            const [y, m, day] = parts.map(Number);
            if (y && m && day) return new Date(y, m - 1, day);
        }
        return new Date();
    };

    // Helper to format for display (YYYY/MM/DD)
    const formatDisplayDate = (val: string) => {
        if (!val) return "YYYY/MM/DD";
        const d = parseDate(val);
        if (isNaN(d.getTime())) return "YYYY/MM/DD";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}/${m}/${day}`;
    };

    const [viewDate, setViewDate] = useState(parseDate(value));

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const popoverWidth = 320;
            const padding = 16;

            // Center: Trigger Left + Half Trigger Width - Half Popover Width
            let leftPos = rect.left + (rect.width / 2) - (popoverWidth / 2);

            // Boundary checks
            const maxLeft = window.innerWidth - popoverWidth - padding;
            leftPos = Math.max(padding, Math.min(leftPos, maxLeft));

            setCoords({
                top: rect.bottom + 12,
                left: leftPos,
                width: popoverWidth
            });
            setViewDate(parseDate(value));
            setViewMode('date');

            const handleScroll = () => setIsOpen(false);
            window.addEventListener('scroll', handleScroll, { capture: true });
            window.addEventListener('resize', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll, { capture: true });
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, [isOpen]);

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const monthDigits = ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"];

    // Year Grid Generation (e.g., 12 years window)
    const yearWindowStart = Math.floor(currentYear / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => yearWindowStart + i);

    const handleSelectDate = (day: number) => {
        const y = currentYear;
        const m = String(currentMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        onChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const handleSelectYear = (year: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(year);
        setViewDate(newDate);
        setViewMode('month');
    };

    const handleSelectMonth = (monthIndex: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(monthIndex);
        setViewDate(newDate);
        setViewMode('date');
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setViewDate(newDate);
    };

    const changeYear = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(newDate.getFullYear() + offset);
        setViewDate(newDate);
    };

    const changeYearPage = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(newDate.getFullYear() + (offset * 12));
        setViewDate(newDate);
    };

    return (
        <div className="w-full">
            {/* Trigger Button */}
            <div
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-[1.4rem] px-5 py-4 cursor-pointer group hover:bg-white/60 dark:hover:bg-black/50 transition-all font-bold text-lg text-foreground",
                    isOpen && "ring-2 ring-primary/20"
                )}
            >
                <span className={cn(value ? "opacity-100 font-mono tracking-wider" : "opacity-40")}>
                    {formatDisplayDate(value)}
                </span>
                <CalendarIcon className={cn("w-4 h-4 transition-all", isOpen ? "text-primary opacity-100" : "opacity-30 group-hover:opacity-60")} />
            </div>

            {/* Portal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[9998] bg-transparent"
                            onClick={() => setIsOpen(false)}
                        />
                        {createPortal(
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'fixed',
                                    top: coords.top,
                                    left: coords.left,
                                    width: coords.width,
                                    zIndex: 9999,
                                }}
                                className="overflow-hidden"
                            >
                                <div
                                    className="bg-background/80 dark:bg-[#1a1b26]/90 backdrop-blur-3xl rounded-[1.6rem] p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10 ring-1 ring-black/5"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        {viewMode === 'date' && (
                                            <>
                                                <div className="flex gap-1">
                                                    <button type="button" onClick={() => changeYear(-1)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
                                                        <ChevronsLeft className="w-3.5 h-3.5 opacity-50" />
                                                    </button>
                                                    <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
                                                        <ChevronLeft className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2 font-black text-sm tracking-tight">
                                                    <button
                                                        onClick={() => setViewMode('year')}
                                                        className="hover:bg-black/5 dark:hover:bg-white/10 px-2 py-1 rounded-lg transition-colors text-primary"
                                                    >
                                                        {currentYear}年
                                                    </button>
                                                    <button
                                                        onClick={() => setViewMode('month')}
                                                        className="hover:bg-black/5 dark:hover:bg-white/10 px-2 py-1 rounded-lg transition-colors opacity-90"
                                                    >
                                                        {monthDigits[currentMonth]}
                                                    </button>
                                                </div>

                                                <div className="flex gap-1">
                                                    <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button type="button" onClick={() => changeYear(1)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
                                                        <ChevronsRight className="w-3.5 h-3.5 opacity-50" />
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {viewMode === 'month' && (
                                            <div className="w-full flex items-center justify-center">
                                                <span className="font-black opacity-60">选择月份</span>
                                            </div>
                                        )}

                                        {viewMode === 'year' && (
                                            <>
                                                <button type="button" onClick={() => changeYearPage(-1)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <div className="font-black text-sm tracking-widest opacity-80" onClick={() => setViewMode('date')}>
                                                    {yearWindowStart} - {yearWindowStart + 11}
                                                </div>
                                                <button type="button" onClick={() => changeYearPage(1)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="min-h-[240px]">
                                        {viewMode === 'date' && (
                                            <>
                                                <div className="grid grid-cols-7 mb-2">
                                                    {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                                                        <div key={d} className="text-[10px] text-center font-black opacity-30">{d}</div>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-7 gap-1">
                                                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                                        const day = i + 1;
                                                        const isSelected = value &&
                                                            Number(value.split('-')[0]) === currentYear &&
                                                            Number(value.split('-')[1]) - 1 === currentMonth &&
                                                            Number(value.split('-')[2]) === day;

                                                        return (
                                                            <motion.button
                                                                key={day}
                                                                whileTap={{ scale: 0.9 }}
                                                                type="button"
                                                                onClick={() => handleSelectDate(day)}
                                                                className={cn(
                                                                    "aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all",
                                                                    isSelected
                                                                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                                                                        : "hover:bg-black/5 dark:hover:bg-white/10"
                                                                )}
                                                            >
                                                                {day}
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}

                                        {viewMode === 'month' && (
                                            <div className="grid grid-cols-3 gap-3 h-full content-center py-2">
                                                {monthNames.map((m, idx) => (
                                                    <motion.button
                                                        key={m}
                                                        whileTap={{ scale: 0.95 }}
                                                        type="button"
                                                        onClick={() => handleSelectMonth(idx)}
                                                        className={cn(
                                                            "py-4 rounded-xl text-sm font-bold transition-all border border-transparent",
                                                            idx === currentMonth
                                                                ? "bg-primary/10 text-primary border-primary/20 scale-105"
                                                                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                                                        )}
                                                    >
                                                        {m}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}

                                        {viewMode === 'year' && (
                                            <div className="grid grid-cols-4 gap-2 h-full content-center pt-2">
                                                {years.map(year => (
                                                    <motion.button
                                                        key={year}
                                                        whileTap={{ scale: 0.95 }}
                                                        type="button"
                                                        onClick={() => handleSelectYear(year)}
                                                        className={cn(
                                                            "py-3 rounded-xl text-xs font-bold transition-all border border-transparent",
                                                            year === currentYear
                                                                ? "bg-primary/10 text-primary border-primary/20 scale-105"
                                                                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                                                        )}
                                                    >
                                                        {year}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>,
                            document.body
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
