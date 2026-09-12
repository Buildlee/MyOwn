'use client';

import { motion } from 'framer-motion';
import { List, BarChart3 } from 'lucide-react';

export type TabKey = 'items' | 'stats';

interface TabBarProps {
    active: TabKey;
    onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string; Icon: typeof List }[] = [
    { key: 'items', label: '物品', Icon: List },
    { key: 'stats', label: '统计', Icon: BarChart3 },
];

export function TabBar({ active, onChange }: TabBarProps) {
    return (
        <nav
            className="sticky bottom-0 z-30 flex shrink-0 border-t border-sep"
            style={{
                height: 'calc(49px + env(safe-area-inset-bottom))',
                paddingBottom: 'env(safe-area-inset-bottom)',
                background: 'color-mix(in oklab, var(--bg) 82%, transparent)',
                backdropFilter: 'blur(22px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(22px) saturate(1.6)',
            }}
        >
            {TABS.map(({ key, label, Icon }) => {
                const on = active === key;
                return (
                    <motion.button
                        key={key}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onChange(key)}
                        aria-current={on ? 'page' : undefined}
                        className="flex-1 flex flex-col items-center justify-center gap-[3px] text-[10px] font-medium transition-colors"
                        style={{ color: on ? 'var(--tint)' : 'var(--label3)' }}
                    >
                        <Icon className="w-6 h-6" strokeWidth={on ? 2.1 : 1.8} />
                        {label}
                    </motion.button>
                );
            })}
        </nav>
    );
}
