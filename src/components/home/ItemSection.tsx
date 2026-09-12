'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Item } from '@/lib/types';
import { costOf } from '@/lib/stats';
import { ItemCard } from '@/components/ItemCard';

interface ItemSectionProps {
    title: string;
    items: Item[];
    /** 可选：插在组卡片顶部的控件（排序条） */
    header?: React.ReactNode;
    onItemClick: (item: Item) => void;
    onDelete: (id: string) => void;
    onPin: (id: string) => void;
}

export function ItemSection({
    title, items, header, onItemClick, onDelete, onPin,
}: ItemSectionProps) {
    if (items.length === 0) return null;

    // 刻度条归一化基准：同组内最大成本
    const costs = items.map(costOf);
    const maxCost = Math.max(...costs, 0);

    return (
        <section>
            <h2 className="sechead">
                {title} · {items.length}
            </h2>
            <div className="group mx-4">
                {header}
                <AnimatePresence initial={false} mode="popLayout">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                                layout: { type: 'spring', stiffness: 480, damping: 42 },
                                duration: 0.3,
                                ease: [0.32, 0.72, 0, 1],
                            }}
                            className="overflow-hidden"
                        >
                            <ItemCard
                                item={item}
                                unitCost={costs[i]}
                                maxCost={maxCost}
                                delay={i * 0.06}
                                onClick={() => onItemClick(item)}
                                onDelete={() => onDelete(item.id)}
                                onPin={() => onPin(item.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
