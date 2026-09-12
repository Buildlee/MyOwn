'use client';

import { motion, useAnimation, motionValue, useTransform } from 'framer-motion';
import { Pin, Trash2 } from 'lucide-react';
import { Item } from '@/lib/types';
import { cn, formatLargeNumber } from '@/lib/utils';

interface ItemCardProps {
    item: Item;
    /** 该物品的均摊成本，由父级统一计算避免重复 */
    unitCost: number;
    /** 同组内最大成本，用于刻度条归一化 */
    maxCost: number;
    delay?: number;
    onClick: (e: React.MouseEvent) => void;
    onDelete: () => void;
    onPin: () => void;
}

export function ItemCard({ item, unitCost, maxCost, delay = 0, onClick, onDelete, onPin }: ItemCardProps) {
    const controls = useAnimation();
    const x = motionValue(0);

    const isSold = item.status === 'sold';
    const isPinned = item.isPinned;

    const pinOpacity = useTransform(x, [0, 20, 80], [0, 0.4, 1]);
    const delOpacity = useTransform(x, [-80, -20, 0], [1, 0.4, 0]);

    const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / 86400000));
    const meta = item.costType === 'daily'
        ? `${days} 天 · ¥${formatLargeNumber(item.price)}`
        : `${item.usageCount} 次 · ¥${formatLargeNumber(item.price)}`;

    const pct = maxCost > 0 ? Math.min(100, Math.round((unitCost / maxCost) * 100)) : 0;

    const reset = () => controls.start({ x: 0 });

    return (
        <div className="rowitem overflow-hidden">
            {/* 左侧：置顶 */}
            <div className="absolute inset-y-0 left-0 flex">
                <motion.div
                    style={{ opacity: pinOpacity }}
                    onClick={() => { onPin(); reset(); }}
                    className="w-20 flex flex-col items-center justify-center gap-[3px] text-white"
                >
                    <Pin className={cn('w-[17px] h-[17px]', isPinned && 'fill-current')} />
                    <span className="text-[10px] font-semibold">{isPinned ? '取消' : '置顶'}</span>
                </motion.div>
            </div>
            {/* 右侧：删除 */}
            <div className="absolute inset-y-0 right-0 flex">
                <motion.div
                    style={{ opacity: delOpacity, background: 'var(--red)' }}
                    onClick={() => { onDelete(); reset(); }}
                    className="w-20 flex flex-col items-center justify-center gap-[3px] text-white ml-auto"
                >
                    <Trash2 className="w-[17px] h-[17px]" />
                    <span className="text-[10px] font-semibold">删除</span>
                </motion.div>
            </div>

            <motion.div
                animate={controls}
                style={{ x, background: 'var(--card)' }}
                drag="x"
                dragConstraints={{ left: -100, right: 100 }}
                dragElastic={0.04}
                onDragEnd={() => {
                    const cx = x.get();
                    if (cx < -44) controls.start({ x: -82 });
                    else if (cx > 44) controls.start({ x: 82 });
                    else reset();
                }}
                onClick={(e) => { if (Math.abs(x.get()) > 5) reset(); else onClick(e); }}
                className="relative flex items-center gap-3 px-3.5 py-[11px] min-h-[52px] cursor-pointer select-none touch-pan-y"
            >
                {/* 图标 */}
                <div
                    className="w-9 h-9 rounded-[9px] grid place-items-center shrink-0 text-[19px] leading-none bg-fill"
                >
                    {item.icon || '📦'}
                </div>

                {/* 名称 + 元信息 */}
                <div className="flex-1 min-w-0 pointer-events-none">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-semibold tracking-[-0.014em] text-label truncate">
                            {item.name}
                        </span>
                        {isPinned && <Pin className="w-2.5 h-2.5 text-label3 shrink-0 fill-current" />}
                    </div>
                    <div className="text-[12px] text-label3 mt-0.5 tabular-nums">{meta}</div>
                </div>

                {/* 成本 + 刻度条 */}
                <div className="text-right shrink-0 pointer-events-none">
                    <div className="text-[16px] font-bold tracking-[-0.024em] text-label tabular-nums leading-tight">
                        ¥{formatLargeNumber(unitCost, 1)}
                        <span className="text-[11px] font-medium text-label3 ml-px">
                            /{item.costType === 'daily' ? '天' : '次'}
                        </span>
                    </div>
                    {/* 组内只有一项时刻度条没有比较意义，隐藏 */}
                    {!isSold && maxCost > unitCost + 0.001 && (
                        <div className="mt-[5px] h-[3px] w-16 rounded-full bg-fill overflow-hidden ml-auto">
                            <span
                                className="block h-full rounded-full scale-in"
                                style={{
                                    width: `${pct}%`,
                                    background: 'var(--tint)',
                                    animationDelay: `${delay + 0.3}s`,
                                }}
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
