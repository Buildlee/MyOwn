'use client';

import { useTheme } from 'next-themes';
import { Drawer } from './Drawer';
import { Moon, Sun, Monitor, Settings, History, ChevronRight, Info, HelpCircle, PieChart, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
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

export function SettingsDrawer({ isOpen, onClose, onShowGuide, enableStatsClick, onToggleStatsClick }: SettingsDrawerProps) {
    const { theme, setTheme } = useTheme();
    const [currentView, setCurrentView] = useState<'menu' | 'changelog' | 'thanks'>('menu');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setCurrentView('menu');
        }
    }, [isOpen]);

    if (!mounted) return null;

    const themes = [
        { id: 'light', name: '浅色', icon: Sun },
        { id: 'dark', name: '深色', icon: Moon },
        { id: 'system', name: '系统', icon: Monitor },
    ];

    const getTitle = () => {
        switch (currentView) {
            case 'changelog': return "更新日志";
            case 'thanks': return "特别鸣谢";
            default: return "应用设置";
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={getTitle()}>
            <AnimatePresence mode="wait">
                {currentView === 'menu' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <section className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2 ml-1">
                                <Info className="w-3.5 h-3.5" /> 关于应用
                            </label>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setCurrentView('changelog')}
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

                                <button
                                    onClick={() => {
                                        onShowGuide?.();
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-between p-5 rounded-[1.6rem] bg-black/[0.03] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                            <HelpCircle className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-black">使用说明</div>
                                            <div className="text-[10px] text-muted-foreground font-medium">了解核心功能与逻辑</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2 ml-1">
                                <Monitor className="w-3.5 h-3.5" /> 功能开关
                            </label>
                            <div
                                onClick={() => onToggleStatsClick(!enableStatsClick)}
                                className="w-full flex items-center justify-between p-5 rounded-[1.6rem] bg-black/[0.03] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-xl transition-colors",
                                        enableStatsClick ? "bg-primary/10 text-primary" : "bg-muted/10 text-muted-foreground"
                                    )}>
                                        <PieChart className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black">资产统计看板</div>
                                        <div className="text-[10px] text-muted-foreground font-medium">点击“使用中”或“已售出”胶囊弹出</div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-12 h-6 rounded-full p-1 transition-colors relative",
                                    enableStatsClick ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-black/10 dark:bg-white/10"
                                )}>
                                    <span className={cn(
                                        "absolute inset-0 flex items-center justify-center text-[8px] font-bold pointer-events-none transition-all duration-300",
                                        enableStatsClick ? "text-white pr-4 opacity-100" : "text-muted-foreground pl-4 opacity-60"
                                    )}>
                                        {enableStatsClick ? "ON" : "OFF"}
                                    </span>
                                    <motion.div
                                        animate={{ x: enableStatsClick ? 24 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="w-4 h-4 bg-white rounded-full shadow-sm z-10"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2 ml-1">
                                <Settings className="w-3.5 h-3.5" /> AI 增强 (Beta)
                            </label>
                            <div className="w-full p-5 rounded-[1.6rem] bg-black/[0.03] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 space-y-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black">Gemini API Key</div>
                                        <div className="text-[10px] text-muted-foreground font-medium">填入 Key 以启用高精度 AI 识别 (推荐 Gemini Flash)</div>
                                    </div>
                                </div>
                                <input
                                    type="password"
                                    placeholder="sk-..."
                                    className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        localStorage.setItem('myown_gemini_api_key', val);
                                    }}
                                    defaultValue={typeof window !== 'undefined' ? localStorage.getItem('myown_gemini_api_key') || '' : ''}
                                />
                                <div className="text-[9px] text-muted-foreground/60 px-1">
                                    * Key 仅存储在本地浏览器，不会上传至服务器。
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2 ml-1">
                                <Heart className="w-3.5 h-3.5" /> 致谢
                            </label>
                            <button
                                onClick={() => setCurrentView('thanks')}
                                className="w-full flex items-center justify-between p-5 rounded-[1.6rem] bg-gradient-to-br from-red-500/5 to-pink-500/5 border border-red-500/10 dark:border-red-500/5 hover:scale-[1.02] transition-transform duration-500 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                        <Heart className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black flex items-center gap-1.5">
                                            特别鸣谢 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Acknowledgements</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                            感谢所有为项目做出贡献的人
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>
                        </section>

                        <section className="pt-4 text-center">
                            <div className="text-[9px] text-muted-foreground font-medium tracking-[0.35em] uppercase opacity-20 flex items-center justify-center gap-2">
                                MyOwn v1.66.0 <span className="w-1 h-1 rounded-full bg-foreground/20" /> Focus on value
                            </div>
                        </section>
                    </motion.div>
                )}

                {currentView === 'changelog' && (
                    <motion.div
                        key="changelog"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <button
                            onClick={() => setCurrentView('menu')}
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

                {currentView === 'thanks' && (
                    <motion.div
                        key="thanks"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <button
                            onClick={() => setCurrentView('menu')}
                            className="flex items-center gap-2 text-[10px] font-black text-primary hover:opacity-80 transition-opacity mb-4"
                        >
                            <ChevronRight className="w-3.5 h-3.5 rotate-180" /> 返回设置
                        </button>

                        <div className="space-y-4">
                            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/10 flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-red-500/30 text-3xl mb-1">
                                    ❤️
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-foreground">感恩有你</h3>
                                    <p className="text-xs text-muted-foreground mt-1 px-4 leading-relaxed">
                                        MyOwn 的每一步成长，都离不开你们的建议与陪伴。
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-2 opacity-60">测试与建议</div>
                                {/* Contributors List */}
                                <div className="w-full p-4 rounded-[1.6rem] bg-black/[0.03] dark:bg-white/5 border border-black/[0.03] dark:border-white/5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0 text-lg">
                                        🐕
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-foreground">狗哥</div>
                                        <div className="text-[10px] text-muted-foreground font-medium">首席测试官 (Chief Bug Hunter)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Drawer>
    );
}
