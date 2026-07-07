'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, MoreVertical, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';

interface HomeHeaderProps {
    isScrolled: boolean;
    onOpenSettings: () => void;
    onOpenAdd: () => void;
    mounted: boolean;
}

export function HomeHeader({ isScrolled, onOpenSettings, onOpenAdd, mounted }: HomeHeaderProps) {
    const { theme, setTheme } = useTheme();
    const [busy, setBusy] = useState(false);

    return (
        <motion.header
            initial={false}
            animate={{
                backgroundColor: isScrolled
                    ? 'var(--bg)'
                    : 'oklch(0 0 0 / 0)',
                borderBottomColor: isScrolled
                    ? 'var(--border)'
                    : 'oklch(0 0 0 / 0)',
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-0 z-[100] backdrop-blur-xl pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 px-5"
            style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h1 className="text-[34px] font-bold text-text tracking-tight leading-tight">
                        MyOwn
                    </h1>
                    <p className="text-sm text-text2 font-medium -mt-0.5">
                        真实物品成本
                    </p>
                </div>
                <div className="flex items-center gap-1 self-start mt-1">
                    {mounted && (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                if (busy) return;
                                setBusy(true);
                                setTheme(theme === 'dark' ? 'light' : 'dark');
                                setTimeout(() => setBusy(false), 400);
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-card2 active:bg-card transition-colors text-text2"
                        >
                            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                        </motion.button>
                    )}
                    <button
                        onClick={onOpenSettings}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-card2 active:bg-card transition-colors text-text2"
                    >
                        <MoreVertical className="w-[18px] h-[18px]" />
                    </button>
                    <button
                        onClick={onOpenAdd}
                        className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-text text-bg hover:opacity-85 active:scale-95 transition-all press"
                    >
                        <Plus className="w-[18px] h-[18px]" />
                    </button>
                </div>
            </div>
        </motion.header>
    );
}
