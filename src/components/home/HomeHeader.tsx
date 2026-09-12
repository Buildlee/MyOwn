'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, MoreVertical, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';

interface HomeHeaderProps {
    isScrolled: boolean;
    onOpenSettings: () => void;
    onOpenAdd: () => void;
    mounted: boolean;
    title?: string;
    subtitle?: string;
}

export function HomeHeader({
    isScrolled, onOpenSettings, onOpenAdd, mounted,
    title = '物品成本', subtitle = '记录每一件物品的真实花费',
}: HomeHeaderProps) {
    const { theme, setTheme } = useTheme();
    const [busy, setBusy] = useState(false);

    return (
        <motion.header
            initial={false}
            animate={{
                boxShadow: isScrolled
                    ? '0 1px 0 var(--sep), 0 1px 12px rgba(0,0,0,0.04)'
                    : '0 1px 0 transparent, 0 0 0 rgba(0,0,0,0)',
            }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="sticky top-0 z-20 shrink-0 bg-bg px-4 pt-0.5 pb-2"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h1 className="text-[34px] font-bold tracking-[-0.026em] leading-[1.1] text-label truncate">
                        {title}
                    </h1>
                    <p className="text-[13px] text-label2 mt-px truncate">{subtitle}</p>
                </div>

                <div className="flex items-center gap-0.5 mt-1.5 shrink-0">
                    {mounted && (
                        <motion.button
                            whileTap={{ scale: 0.87 }}
                            aria-label="切换主题"
                            onClick={() => {
                                if (busy) return;
                                setBusy(true);
                                setTheme(theme === 'dark' ? 'light' : 'dark');
                                setTimeout(() => setBusy(false), 400);
                            }}
                            className="w-8 h-8 grid place-items-center rounded-full bg-fill text-label2 active:opacity-60 transition-opacity"
                        >
                            {theme === 'dark'
                                ? <Sun className="w-[17px] h-[17px]" />
                                : <Moon className="w-[17px] h-[17px]" />}
                        </motion.button>
                    )}
                    <motion.button
                        whileTap={{ scale: 0.87 }}
                        aria-label="设置"
                        onClick={onOpenSettings}
                        className="w-8 h-8 grid place-items-center rounded-full bg-fill text-label2 active:opacity-60 transition-opacity"
                    >
                        <MoreVertical className="w-[17px] h-[17px]" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        aria-label="添加物品"
                        onClick={onOpenAdd}
                        className="w-8 h-8 grid place-items-center rounded-full text-white shadow-[0_2px_8px_var(--tint-soft)] transition-opacity active:opacity-85"
                        style={{ background: 'var(--tint)' }}
                    >
                        <Plus className="w-[18px] h-[18px]" strokeWidth={2.8} />
                    </motion.button>
                </div>
            </div>
        </motion.header>
    );
}
