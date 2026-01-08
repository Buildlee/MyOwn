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
    const [isTransitioning, setIsTransitioning] = useState(false);

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{
                opacity: 1,
                y: 0,
                backgroundColor: isScrolled ? (theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)') : 'rgba(0,0,0,0)',
                backdropFilter: isScrolled ? 'blur(24px) saturate(180%)' : 'blur(0px) saturate(100%)',
                boxShadow: isScrolled ? '0 12px 40px -10px rgba(0, 0, 0, 0.15)' : '0 0 0 0 rgba(0,0,0,0)'
            }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="w-full flex justify-between items-center p-6 sm:p-8 pt-[calc(env(safe-area-inset-top)+1.5rem)] sticky top-0 z-[210] border-b border-transparent transform-gpu will-change-[background-color,backdrop-filter,box-shadow,border-bottom-color] transition-all duration-[250ms]"
        >
            <div className="flex flex-col">
                <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-500 via-fuchsia-500 to-primary bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
                    MyOwn
                </h1>
                <p className="text-muted-foreground/40 text-[9px] sm:text-[10px] font-medium mt-2 uppercase tracking-[0.35em] flex items-center gap-2 font-mono">
                    Value tracking
                    <span className="w-1 h-1 rounded-full bg-primary/30" />
                    Just focus
                </p>
            </div>
            <div className="flex items-center space-x-1.5">
                {mounted && (
                    <motion.button
                        whileTap={{ scale: 0.9, rotate: 15 }}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            if (isTransitioning) return;

                            setIsTransitioning(true);
                            const nextTheme = theme === 'dark' ? 'light' : 'dark';

                            // Set the clip-path origin coordinates
                            const x = e.clientX;
                            const y = e.clientY;
                            document.documentElement.style.setProperty('--x', `${x}px`);
                            document.documentElement.style.setProperty('--y', `${y}px`);

                            const toggleTheme = () => {
                                setTheme(nextTheme);
                                // Cooldown period matching the CSS duration (1s) plus a small buffer
                                setTimeout(() => setIsTransitioning(false), 1000);
                            };

                            if (!(document as any).startViewTransition) {
                                toggleTheme();
                                return;
                            }

                            // @ts-ignore
                            document.startViewTransition(() => {
                                setTheme(nextTheme);
                            });

                            // If using ViewTransition, we still need to unlock after the animation
                            setTimeout(() => setIsTransitioning(false), 1000);
                        }}
                        className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-white/5 border border-white/10 relative transform-gpu"
                    >
                        {theme === 'dark' ? (
                            <motion.div initial={{ scale: 0.5, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                                <Sun className="w-5 h-5 text-amber-400" />
                            </motion.div>
                        ) : (
                            <motion.div initial={{ scale: 0.5, rotate: 45 }} animate={{ scale: 1, rotate: 0 }}>
                                <Moon className="w-5 h-5 text-indigo-400" />
                            </motion.div>
                        )}
                    </motion.button>
                )}
                <button
                    onClick={onOpenSettings}
                    className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-white/5 border border-white/10"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
                <button
                    onClick={onOpenAdd}
                    className="hidden sm:flex p-2.5 bg-foreground text-background rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-foreground/5"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </motion.header>
    );
}
