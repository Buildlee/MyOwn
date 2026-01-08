'use client';

import { motion, useAnimation, motionValue, useTransform } from 'framer-motion';
import { Pin, Trash2 } from 'lucide-react';
import { Item } from '@/lib/types';
import { cn, getGradient } from '@/lib/utils';

interface ItemCardProps {
    item: Item;
    delay?: number;
    onClick: (e: React.MouseEvent) => void;
    onDelete: () => void;
    onPin: () => void;
}

export function ItemCard({ item, delay = 0, onClick, onDelete, onPin }: ItemCardProps) {
    const gradient = getGradient(item.name);
    const isSold = item.status === 'sold';
    const isPinned = item.isPinned;
    const controls = useAnimation();

    const x = motionValue(0);

    // Right Overlay (Delete) - Rose Color
    const deleteOpacity = useTransform(x, [-80, -20, 0], [1, 0.4, 0]);
    const deleteScale = useTransform(x, [-80, -20], [1, 0.8]);
    const deleteWidth = useTransform(x, [-140, 0], [140, 0]);

    // Left Overlay (Pin) - Soft Violet/Indigo
    const pinOpacity = useTransform(x, [0, 20, 80], [0, 0.4, 1]);
    const pinScale = useTransform(x, [20, 80], [0.8, 1]);
    const pinWidth = useTransform(x, [0, 140], [0, 140]);

    const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / 86400000));
    const costValue = item.costType === 'daily' ? (item.price / days) : (item.price / Math.max(1, item.usageCount));
    const usageDetail = item.costType === 'daily'
        ? (isSold ? `曾使用 ${days} 天` : `已使用 ${days} 天`)
        : (isSold ? `共使用 ${item.usageCount} 次` : `已使用 ${item.usageCount} 次`);

    const resetPosition = () => controls.start({ x: 0 });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                delay,
                layout: { type: "spring", stiffness: 500, damping: 50 }
            }}
            className="relative overflow-hidden rounded-[1.6rem] group"
        >
            {/* Left Overlay - Pin Action */}
            <div className="absolute inset-y-0 left-0 flex items-stretch justify-start z-0">
                <motion.div
                    style={{ width: pinWidth, opacity: pinOpacity }}
                    className="bg-violet-500 rounded-l-[1.6rem] rounded-r-[1.6rem] flex items-center justify-center overflow-hidden"
                    onClick={() => {
                        onPin();
                        resetPosition();
                    }}
                >
                    <motion.div
                        style={{ scale: pinScale }}
                        className="flex flex-col items-center gap-1.5 px-8"
                    >
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            <Pin className={cn("w-6 h-6 text-white", isPinned && "fill-white")} />
                        </div>
                        <span className="text-[10px] text-white font-black uppercase tracking-widest drop-shadow-md whitespace-nowrap">
                            {isPinned ? "取消" : "置顶"}
                        </span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Right Overlay - Softened Delete Action */}
            <div className="absolute inset-y-0 right-0 flex items-stretch justify-end z-0">
                <motion.div
                    style={{ width: deleteWidth, opacity: deleteOpacity }}
                    className="bg-rose-400 rounded-l-[1.6rem] rounded-r-[1.6rem] flex items-center justify-center overflow-hidden"
                    onClick={() => {
                        onDelete();
                        resetPosition();
                    }}
                >
                    <motion.div
                        style={{ scale: deleteScale }}
                        className="flex flex-col items-center gap-1.5 px-8"
                    >
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] shrink-0">
                            <Trash2 className="text-white w-6 h-6 fill-white/10" />
                        </div>
                        <span className="text-[10px] text-white font-black uppercase tracking-widest drop-shadow-md whitespace-nowrap">删除</span>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                animate={controls}
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -140, right: 140 }}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                onDragEnd={() => {
                    const currentX = x.get();
                    if (currentX < -40) {
                        controls.start({ x: -100 });
                    } else if (currentX > 40) {
                        controls.start({ x: 100 });
                    } else {
                        resetPosition();
                    }
                }}
                onClick={(e) => {
                    if (Math.abs(x.get()) > 5) {
                        resetPosition();
                    } else {
                        onClick(e);
                    }
                }}
                className={cn(
                    "relative glass-modern px-4 py-3.5 h-full flex flex-col justify-center hover:bg-white/30 dark:hover:bg-white/[0.07] active:scale-[0.98] transition-all cursor-pointer min-h-[85px] border-white/30 dark:border-white/5 rounded-[1.4rem] shadow-sm hover:shadow-xl duration-500",
                    "dark:border-t-white/10 dark:border-l-white/10", // Rim Light
                    isSold && "grayscale-[0.8] opacity-60",
                    isPinned && "ring-2 ring-primary/30 bg-primary/5 shadow-lg shadow-primary/10"
                )}
            >
                {/* Main Horizontal Row: Icon | Name | Usage | Value */}
                <div className="flex items-center gap-3 w-full">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-white/40 dark:bg-white/5 rounded-[1.2rem] flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm border border-white/40 dark:border-white/10">
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-tr opacity-10 transition-opacity",
                            gradient
                        )} />
                        <span className="text-lg z-10 drop-shadow-sm">{item.icon || '📦'}</span>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        {/* Top Line: Name + Usage + Value */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <h3 className="font-bold text-[15px] leading-none truncate text-foreground/90 tracking-tight">{item.name}</h3>
                                {isPinned && <Pin className="w-3 h-3 text-primary fill-primary opacity-60 shrink-0" />}
                                {/* Usage Badge Inline */}
                                <span className="px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[9px] font-bold text-muted-foreground whitespace-nowrap hidden sm:inline-block">
                                    {usageDetail}
                                </span>
                            </div>

                            {/* Value - Highlighted & Big */}
                            <div className={cn(
                                "text-xl font-black leading-none tracking-tighter flex items-center shrink-0",
                                isSold ? "text-muted-foreground/50" : "text-primary dark:text-primary-foreground"
                            )}>
                                <span className="text-[10px] font-bold mr-0.5 opacity-50">¥</span>
                                {costValue.toFixed(1)}
                                <span className="text-[9px] font-bold ml-0.5 opacity-60">/{item.costType === 'daily' ? '天' : '次'}</span>
                            </div>
                        </div>

                        {/* Sub Line: Price + Usage(Mobile) + Label */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 font-medium tracking-wide">
                            <div className="flex items-center gap-2">
                                <span>¥{item.price.toLocaleString()}</span>
                                <span className="sm:hidden">• {usageDetail}</span>
                            </div>
                            <div className="scale-90 origin-right opacity-70">
                                感知价值
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
