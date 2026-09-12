'use client';

import { useTheme } from 'next-themes';
import { Drawer } from '@/components/Drawer';
import { ChevronRight, History, CircleHelp, BarChart3, Ruler } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CHANGELOG } from '@/lib/changelog';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onShowGuide?: () => void;
    enableStatsClick: boolean;
    onToggleStatsClick: (enabled: boolean) => void;
}

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={onToggle}
            className="w-[51px] h-[31px] rounded-full shrink-0 relative transition-colors"
            style={{ background: on ? 'var(--green)' : 'var(--fill)' }}
        >
            <motion.span
                animate={{ x: on ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                className="absolute top-0.5 left-0.5 w-[27px] h-[27px] rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)]"
            />
        </button>
    );
}

function IconTile({ children }: { children: React.ReactNode }) {
    return (
        <span className="w-[29px] h-[29px] rounded-[7px] grid place-items-center shrink-0 bg-fill text-label2">
            {children}
        </span>
    );
}

export function SettingsDrawer({
    isOpen, onClose, onShowGuide, enableStatsClick, onToggleStatsClick,
}: SettingsDrawerProps) {
    const { theme, setTheme } = useTheme();
    const [view, setView] = useState<'menu' | 'changelog'>('menu');
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (isOpen) setView('menu'); }, [isOpen]);

    if (!mounted) return null;

    const themes = [
        { id: 'light', label: '浅色' },
        { id: 'dark', label: '深色' },
        { id: 'system', label: '跟随系统' },
    ];

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={view === 'menu' ? '设置' : '更新日志'}>
            <AnimatePresence mode="wait" initial={false}>
                {view === 'menu' ? (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                    >
                        {/* 外观 */}
                        <div className="mb-5">
                            <div className="text-[12px] font-semibold text-label2 uppercase tracking-[0.05em] px-0.5 mb-[7px]">
                                外观
                            </div>
                            <div className="group p-1.5">
                                <div className="flex bg-fill rounded-[9px] p-0.5 relative">
                                    {themes.map(t => {
                                        const on = theme === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                className="flex-1 relative z-10 py-2 text-[13px] rounded-[7px] transition-colors"
                                                style={{
                                                    color: on ? 'var(--label)' : 'var(--label2)',
                                                    fontWeight: on ? 600 : 500,
                                                }}
                                            >
                                                {on && (
                                                    <motion.span
                                                        layoutId="theme-pill"
                                                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                                        className="absolute inset-0 rounded-[7px] bg-card shadow-[0_1.5px_4px_rgba(0,0,0,0.14)] dark:bg-[oklch(0.34_0.004_265)]"
                                                        style={{ zIndex: -1 }}
                                                    />
                                                )}
                                                {t.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 功能 */}
                        <div className="mb-5">
                            <div className="text-[12px] font-semibold text-label2 uppercase tracking-[0.05em] px-0.5 mb-[7px]">
                                功能
                            </div>
                            <div className="group">
                                <div className="rowitem px-3.5 py-3 gap-3">
                                    <IconTile><BarChart3 className="w-4 h-4" /></IconTile>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[16px] font-medium tracking-[-0.012em] text-label">
                                            资产统计看板
                                        </div>
                                        <div className="text-[12px] text-label3 mt-px">
                                            显示类别占比与效率分析
                                        </div>
                                    </div>
                                    <Switch on={enableStatsClick} onToggle={() => onToggleStatsClick(!enableStatsClick)} />
                                </div>
                            </div>
                        </div>

                        {/* AI */}
                        <div className="mb-5">
                            <div className="text-[12px] font-semibold text-label2 uppercase tracking-[0.05em] px-0.5 mb-[7px]">
                                AI 识别
                            </div>
                            <div className="group">
                                <div className="rowitem px-3.5 py-3 gap-3">
                                    <Ruler className="hidden" />
                                    <span className="text-[15px] font-medium text-label shrink-0">Key</span>
                                    <input
                                        type="password"
                                        placeholder="sk-..."
                                        defaultValue={typeof window !== 'undefined'
                                            ? localStorage.getItem('myown_gemini_api_key') || ''
                                            : ''}
                                        onChange={e => localStorage.setItem('myown_gemini_api_key', e.target.value)}
                                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] text-right font-mono text-label placeholder:text-label3"
                                    />
                                </div>
                            </div>
                            <p className="text-[11px] text-label3 px-0.5 mt-[7px]">
                                仅存储在本地浏览器，不会上传
                            </p>
                        </div>

                        {/* 关于 */}
                        <div>
                            <div className="text-[12px] font-semibold text-label2 uppercase tracking-[0.05em] px-0.5 mb-[7px]">
                                关于
                            </div>
                            <div className="group">
                                <button
                                    onClick={() => setView('changelog')}
                                    className="rowitem w-full px-3.5 py-3 gap-3 text-left"
                                >
                                    <IconTile><History className="w-4 h-4" /></IconTile>
                                    <span className="flex-1 text-[16px] font-medium tracking-[-0.012em] text-label">
                                        更新日志
                                    </span>
                                    <ChevronRight className="w-[13px] h-[13px] text-label3" strokeWidth={2.6} />
                                </button>
                                <button
                                    onClick={() => { onShowGuide?.(); onClose(); }}
                                    className="rowitem w-full px-3.5 py-3 gap-3 text-left"
                                >
                                    <IconTile><CircleHelp className="w-4 h-4" /></IconTile>
                                    <span className="flex-1 text-[16px] font-medium tracking-[-0.012em] text-label">
                                        使用说明
                                    </span>
                                    <ChevronRight className="w-[13px] h-[13px] text-label3" strokeWidth={2.6} />
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-[11px] text-label3 font-mono pt-6">
                            MyOwn v2.0.0
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="changelog"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                    >
                        <button
                            onClick={() => setView('menu')}
                            className="flex items-center gap-1 text-[14px] font-medium text-tint mb-4"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" /> 返回
                        </button>
                        <div className="space-y-5 max-h-[54vh] overflow-y-auto no-scrollbar pr-0.5">
                            {CHANGELOG.map(item => (
                                <div key={item.version} className="relative pl-4 border-l border-sep">
                                    <span className="absolute left-[-3px] top-[6px] w-1.5 h-1.5 rounded-full bg-sep" />
                                    <div className="flex items-baseline gap-3 mb-1.5">
                                        <h4 className="text-[15px] font-semibold text-label">{item.version}</h4>
                                        <span className="text-[11px] text-label3 font-mono tabular-nums">{item.date}</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {item.changes.map((c, i) => (
                                            <li key={i} className="text-[13px] text-label2 flex gap-2 leading-relaxed">
                                                <span className="w-[3px] h-[3px] rounded-full bg-label3 mt-[7px] shrink-0" />
                                                {c}
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
