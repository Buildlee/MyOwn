'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
    title, status, items, enableStats,
    onStatsClick, onItemClick, onDelete, onPin
}: ItemSectionProps) {
    if (items.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 px-0.5">
                <h2 className="text-[13px] font-semibold text-text2 tracking-wide">
                    {title}
                    <span className="text-text3 font-normal ml-1.5">{items.length}</span>
                </h2>
                <div className="h-px flex-1 bg-border" />
            </div>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <AnimatePresence mode="popLayout">
                    {items.map((item, idx) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            delay={idx * 0.03}
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
