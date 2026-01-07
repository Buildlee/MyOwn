'use client';

import { useTheme } from 'next-themes';
import { Drawer } from './Drawer';
import { Moon, Sun, Monitor, Settings, History, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CHANGELOG } from '@/lib/changelog';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const themes = [
        { id: 'light', name: '浅色', icon: Sun },
        { id: 'dark', name: '深色', icon: Moon },
        { id: 'system', name: '系统', icon: Monitor },
    ];

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={showChangelog ? "更新日志" : "应用设置"}>
            <AnimatePresence mode="wait">
                {!showChangelog ? (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-8"
                    >
                        <section className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2 ml-1">
                                <Info className="w-3.5 h-3.5" /> 关于应用
                            </label>
                            <button
                                onClick={() => setShowChangelog(true)}
                                className="w-full flex items-center justify-between p-5 rounded-[1.6rem] bg-black/[0.03] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-violet-500/10 rounded-xl text-violet-500">
                                        <History className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black">更新日志</div>
                                        <div className="text-[10px] text-muted-foreground font-medium">查看版本演进历史</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>
                        </section>

                        <section className="pt-4 text-center">
                            <div className="text-[10px] text-muted-foreground font-black tracking-[0.3em] uppercase opacity-20">
                                MyOwn v1.4.5 · Focus on value
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    <motion.div
                        key="changelog"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                    >
                        <button
                            onClick={() => setShowChangelog(false)}
                            className="flex items-center gap-2 text-[10px] font-black text-primary hover:opacity-80 transition-opacity mb-4"
                        >
                            <ChevronRight className="w-3.5 h-3.5 rotate-180" /> 返回设置
                        </button>

                        <div className="space-y-8 overflow-y-auto max-h-[60vh] pr-2 no-scrollbar">
                            {CHANGELOG.map((item) => (
                                <div key={item.version} className="relative pl-6 border-l border-primary/20 space-y-3">
                                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                    <div className="flex items-baseline justify-between">
                                        <h4 className="text-lg font-black tracking-tight">{item.version}</h4>
                                        <span className="text-[10px] font-mono font-bold opacity-30">{item.date}</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {item.changes.map((change, i) => (
                                            <li key={i} className="text-xs text-muted-foreground/90 font-medium flex items-start gap-2 leading-relaxed">
                                                <div className="w-1 h-1 bg-primary/40 rounded-full mt-1.5 shrink-0" />
                                                {change}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Drawer>
    );
}
