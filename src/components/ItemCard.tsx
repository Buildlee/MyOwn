'use client';

import { motion, useAnimation, motionValue, useTransform } from 'framer-motion';
import { Pin, Trash2 } from 'lucide-react';
import { Item } from '@/lib/types';
import { cn, formatLargeNumber } from '@/lib/utils';

interface ItemCardProps {
    item: Item;
    delay?: number;
    onClick: (e: React.MouseEvent) => void;
    onDelete: () => void;
    onPin: () => void;
}

export function ItemCard({ item, delay = 0, onClick, onDelete, onPin }: ItemCardProps) {
    const controls = useAnimation();
    const x = motionValue(0);

    const isSold = item.status === 'sold';
    const isPinned = item.isPinned;
    const deleteOpacity = useTransform(x, [-80, -20, 0], [1, 0.4, 0]);
    const pinOpacity = useTransform(x, [0, 20, 80], [0, 0.4, 1]);

    const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / 86400000));
    const costValue = item.costType === 'daily' ? (item.price / days) : (item.price / Math.max(1, item.usageCount));
    const usageDetail = item.costType === 'daily'
        ? `已用 ${days} 天` : `使用 ${item.usageCount} 次`;

    const reset = () => controls.start({ x: 0 });

    return (
        <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-y-0 left-0 flex items-stretch">
                <motion.div style={{ opacity: pinOpacity }}
                    className="w-[72px] bg-text rounded-xl flex items-center justify-center"
                    onClick={() => { onPin(); reset(); }}>
                    <div className="flex flex-col items-center gap-1">
                        <Pin className={cn("w-4 h-4 text-bg", isPinned && "fill-bg")} />
                        <span className="text-[9px] font-semibold text-bg/80">{isPinned ? '取消' : '置顶'}</span>
                    </div>
                </motion.div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-stretch">
                <motion.div style={{ opacity: deleteOpacity }}
                    className="w-[72px] bg-destructive rounded-xl flex items-center justify-center"
                    onClick={() => { onDelete(); reset(); }}>
                    <div className="flex flex-col items-center gap-1">
                        <Trash2 className="w-4 h-4 text-white" />
                        <span className="text-[9px] font-semibold text-white/80">删除</span>
                    </div>
                </motion.div>
            </div>

            <motion.div
                animate={controls}
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -72, right: 72 }}
                dragElastic={0.05}
                onDragEnd={() => {
                    const cx = x.get();
                    if (cx < -30) controls.start({ x: -60 });
                    else if (cx > 30) controls.start({ x: 60 });
                    else reset();
                }}
                onClick={(e) => { if (Math.abs(x.get()) > 5) reset(); else onClick(e); }}
                className={cn(
                    "relative card px-4 py-[13px] flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform",
                    isSold && "opacity-50",
                    isPinned && "ring-1 ring-text/10"
                )}
            >
                <motion.div
                    initial={false}
                    whileTap={{ scale: 0.95 }}
                    className="w-[38px] h-[38px] rounded-[10px] bg-card2 flex items-center justify-center shrink-0 border border-border/50"
                >
                    <span className="text-lg leading-none">{item.icon || '📦'}</span>
                </motion.div>
                <div className="flex-1 min-w-0 pointer-events-none">
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-text truncate">{item.name}</span>
                        {isPinned && <Pin className="w-2.5 h-2.5 text-text3 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[13px] text-text2">¥{formatLargeNumber(item.price)}</span>
                        <span className="w-[3px] h-[3px] rounded-full bg-text3/40" />
                        <span className="text-[13px] text-text3">{usageDetail}</span>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2 pointer-events-none">
                    <div className="text-lg font-bold text-text tracking-tight leading-none">
                        ¥{formatLargeNumber(costValue, 1)}
                    </div>
                    <div className="text-[11px] text-text3 font-medium mt-0.5">
                        /{item.costType === 'daily' ? '天' : '次'}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
