'use client';

import { useTheme } from 'next-themes';
import { Drawer } from './Drawer';
import { Moon, Sun, Monitor, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
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
        <Drawer isOpen={isOpen} onClose={onClose} title="应用设置">
            <div className="space-y-6">
                <section className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Settings className="w-4 h-4" /> 外观主题
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {themes.map((t) => {
                            const Icon = t.icon;
                            const isActive = theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                                        isActive
                                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                                            : "border-white/10 hover:bg-white/5 text-muted-foreground"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs">{t.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="pt-4 border-t border-white/10">
                    <div className="text-xs text-muted-foreground text-center">
                        MyOwn v0.1.0 • 感知价值，理智消费
                    </div>
                </section>
            </div>
        </Drawer>
    );
}
