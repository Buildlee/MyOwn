'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ItemCard } from '@/components/ItemCard';

interface ItemSectionProps {
    title: string;
    status: 'using' | 'sold';
    items: Item[];
    enableStats: boolean;
    onStatsClick: () => void;
    onItemClick: (item: Item) => void;
    onDelete: (id: string) => void;
    onPin: (id: string) => void;
}

export function ItemSection({
    title,
    status,
    items,
    enableStats,
    onStatsClick,
    onItemClick,
    onDelete,
    onPin
}: ItemSectionProps) {
    if (items.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className={cn(
                "flex items-center gap-4 px-2 transition-all",
                status === 'sold' && "opacity-50",
                enableStats && status === 'sold' && "hover:opacity-100"
            )}>
                <motion.button
                    whileHover={enableStats ? { scale: 1.02 } : {}}
                    whileTap={enableStats ? { scale: 0.98 } : {}}
                    onClick={onStatsClick}
                    className={cn(
                        "flex items-center gap-2.5 px-3 py-1.5 rounded-full liquid-glass border-white/20 shadow-sm group transition-all",
                        enableStats ? "hover:bg-emerald-500/5 cursor-pointer" : "cursor-default",
                        status === 'sold' && enableStats && "hover:bg-primary/5",
                        status === 'sold' && "border-white/10"
                    )}
                >
                    <div className={cn(
                        "w-1 h-1 rounded-full",
                        status === 'using' ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
                    )} />
                    <h2 className="text-[10px] font-black tracking-[0.2em] opacity-80 uppercase flex items-center gap-2">
                        {title}
                    </h2>
                </motion.button>
                <div className={cn(
                    "h-px flex-1 bg-gradient-to-r to-transparent",
                    status === 'using' ? "from-foreground/10" : "from-foreground/5"
                )} />
            </div>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                    {items.map((item, idx) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            delay={idx * 0.05}
                            onClick={() => onItemClick(item)}
                            onDelete={() => onDelete(item.id)}
                            onPin={() => onPin(item.id)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
