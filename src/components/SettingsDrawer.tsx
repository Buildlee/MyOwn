'use client';

import { useTheme } from 'next-themes';
import { Drawer } from '@/components/Drawer';
import { Moon, Sun, Monitor, ChevronRight, History, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CHANGELOG } from '@/lib/changelog';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onShowGuide?: () => void;
    enableStatsClick: boolean;
    onToggleStatsClick: (enabled: boolean) => void;
}

function SettingRow({ icon: Icon, label, desc, onClick }: { icon: any; label: string; desc?: string; onClick?: () => void }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-card2 active:bg-card transition-colors rounded-xl group">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-card2 flex items-center justify-center text-text2">
                    <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                    <p className="text-[15px] font-medium text-text">{label}</p>
                    {desc && <p className="text-[13px] text-text3 mt-0.5">{desc}</p>}
                </div>
            </div>
            {onClick && <ChevronRight className="w-4 h-4 text-text3 group-hover:translate-x-0.5 transition-transform" />}
        </button>
    );
}

export function SettingsDrawer({ isOpen, onClose, onShowGuide, enableStatsClick, onToggleStatsClick }: Props) {
    const { theme, setTheme } = useTheme();
    const [view, setView] = useState<'menu' | 'changelog'>('menu');
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (isOpen) setView('menu'); }, [isOpen]);

    if (!mounted) return null;

    const themes = [
        { id: 'light', label: '浅色', icon: Sun },
        { id: 'dark', label: '深色', icon: Moon },
        { id: 'system', label: '系统', icon: Monitor },
    ];

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={view === 'menu' ? '设置' : '更新日志'}>
            <AnimatePresence mode="wait">
                {view === 'menu' && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Theme */}
                        <div>
                            <p className="text-[13px] font-medium text-text3 mb-3 px-1">主题</p>
                            <div className="flex gap-2">
                                {themes.map(t => (
                                    <button key={t.id} onClick={() => setTheme(t.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                                            theme === t.id ? 'card text-text shadow-sm' : 'bg-card2 text-text2 hover:text-text'
                                        }`}
                                    >
                                        <t.icon className="w-4 h-4" />
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Feature toggles */}
                        <div>
                            <p className="text-[13px] font-medium text-text3 mb-3 px-1">功能</p>
                            <div onClick={() => onToggleStatsClick(!enableStatsClick)}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-card2 active:bg-card transition-colors cursor-pointer"
                            >
                                <div>
                                    <p className="text-[15px] font-medium text-text">资产统计看板</p>
                                    <p className="text-[13px] text-text3 mt-0.5">点击分类查看分析</p>
                                </div>
                                <div className={`w-[42px] h-[24px] rounded-full p-[3px] transition-colors ${
                                    enableStatsClick ? 'bg-text' : 'bg-border'
                                }`}>
                                    <motion.div animate={{ x: enableStatsClick ? 18 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="w-[18px] h-[18px] bg-bg rounded-full shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* AI Key */}
                        <div>
                            <p className="text-[13px] font-medium text-text3 mb-3 px-1">AI 识别</p>
                            <div className="p-4 rounded-xl bg-card2 space-y-2">
                                <p className="text-[15px] font-medium text-text">Gemini API Key</p>
                                <input type="password" placeholder="sk-..."
                                    defaultValue={typeof window !== 'undefined' ? localStorage.getItem('myown_gemini_api_key') || '' : ''}
                                    onChange={(e) => localStorage.setItem('myown_gemini_api_key', e.target.value)}
                                    className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text outline-none placeholder:text-text3/60 font-mono"
                                />
                                <p className="text-xs text-text3">Key 仅存储在本地浏览器。</p>
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <p className="text-[13px] font-medium text-text3 mb-3 px-1">关于</p>
                            <div className="space-y-0.5">
                                <SettingRow icon={History} label="更新日志" desc="版本演进历史" onClick={() => setView('changelog')} />
                                <SettingRow icon={HelpCircle} label="使用说明" desc="核心功能与交互" onClick={() => { onShowGuide?.(); onClose(); }} />
                            </div>
                        </div>

                        <p className="text-center text-xs text-text3/50 font-mono pt-4">MyOwn v1.66.0</p>
                    </motion.div>
                )}

                {view === 'changelog' && (
                    <motion.div key="changelog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <button onClick={() => setView('menu')}
                            className="flex items-center gap-1 text-sm font-medium text-text2 hover:text-text transition-colors mb-4"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" /> 返回
                        </button>
                        <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
                            {CHANGELOG.map(item => (
                                <div key={item.version} className="relative pl-4 border-l border-border">
                                    <div className="absolute left-[-3px] top-[6px] w-[6px] h-[6px] rounded-full bg-border" />
                                    <div className="flex items-baseline gap-3 mb-1.5">
                                        <h4 className="text-[15px] font-semibold text-text">{item.version}</h4>
                                        <span className="text-[11px] text-text3 font-mono">{item.date}</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {item.changes.map((c, i) => (
                                            <li key={i} className="text-[13px] text-text2 flex items-start gap-2">
                                                <span className="w-[3px] h-[3px] rounded-full bg-text3/40 mt-[7px] shrink-0" />
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
