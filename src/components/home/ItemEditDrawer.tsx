'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Drawer } from '@/components/Drawer';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { Item } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ItemEditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    formData: Omit<Item, 'id'>;
    setFormData: (data: Omit<Item, 'id'>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isCustomizingIcon?: boolean; // Optional, might not be needed if logic is internal
    iconCategories: Record<string, string[]>;
}

export function ItemEditDrawer({
    isOpen,
    onClose,
    title,
    formData,
    setFormData,
    onSubmit,
    iconCategories
}: ItemEditDrawerProps) {

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <form onSubmit={onSubmit} className="space-y-3 pb-4">
                {/* Main Grid: Info & Strategy mixed for density */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-4">物品名称</label>
                        <input
                            type="text"
                            placeholder="如：MacBook Pro M3"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/[0.015] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/10 rounded-[0.9rem] px-4 py-2.5 outline-none focus:ring-2 ring-primary/20 transition-all font-bold text-base placeholder:text-muted-foreground/30 text-foreground shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between ml-4 mr-1">
                                <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase">入手价格</label>
                                <AnimatePresence>
                                    {formData.price >= 1000 && (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, x: 10 }}
                                            className="text-[9px] font-black text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10"
                                        >
                                            ≈ {(() => {
                                                const p = formData.price;
                                                if (p >= 100000000) return (p / 100000000).toFixed(2) + '亿';
                                                if (p >= 10000000) return (p / 10000000).toFixed(2) + '千万';
                                                if (p >= 1000000) return (p / 1000000).toFixed(2) + '百万';
                                                if (p >= 100000) return (p / 100000).toFixed(2) + '十万';
                                                if (p >= 10000) return (p / 10000).toFixed(2) + '万';
                                                return (p / 1000).toFixed(1) + '千';
                                            })()}
                                        </motion.span>
                                    )}

                                </AnimatePresence>
                            </div>
                            <input
                                required
                                type="number"
                                className="w-full bg-black/[0.015] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/10 rounded-[0.9rem] px-4 py-2.5 outline-none focus:ring-2 ring-primary/20 transition-all font-bold text-sm placeholder:text-muted-foreground/30 text-foreground shadow-inner"
                                value={formData.price || ''}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-4">入手日期</label>
                            <CustomDatePicker
                                value={formData.purchaseDate}
                                onChange={(val: string) => setFormData({ ...formData, purchaseDate: val })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-4">计费模式</label>
                            <div className="relative grid grid-cols-2 gap-px liquid-glass p-0.5 rounded-[0.8rem] overflow-hidden border-none bg-black/[0.02] dark:bg-white/[0.06] shadow-sm">
                                <motion.div
                                    className="absolute inset-y-0.5 bg-foreground rounded-[0.6rem] shadow-md z-0"
                                    initial={false}
                                    animate={{
                                        left: formData.costType === 'daily' ? '2px' : '50%',
                                        width: 'calc(50% - 2px)'
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }} // Fast snappy spring
                                />
                                {['daily', 'per_use'].map(id => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, costType: id as any })}
                                        className={cn(
                                            "relative z-10 py-2 transition-colors font-black text-[10px] tracking-tighter rounded-[0.7rem]",
                                            formData.costType === id ? "text-background" : "text-muted-foreground"
                                        )}
                                    >
                                        {id === 'daily' ? '每日' : '单次'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-4">物品状态</label>
                            <div className="relative grid grid-cols-2 gap-px liquid-glass p-0.5 rounded-[0.8rem] overflow-hidden border-none bg-black/[0.02] dark:bg-white/[0.06] shadow-sm">
                                <motion.div
                                    className="absolute inset-y-0.5 bg-foreground rounded-[0.6rem] shadow-md z-0"
                                    initial={false}
                                    animate={{
                                        left: formData.status === 'using' ? '2px' : '50%',
                                        width: 'calc(50% - 2px)'
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }} // Fast snappy spring
                                />
                                {['using', 'sold'].map(id => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: id as any })}
                                        className={cn(
                                            "relative z-10 py-2 transition-colors font-black text-[10px] tracking-tighter rounded-[0.7rem]",
                                            formData.status === id ? "text-background" : "text-muted-foreground"
                                        )}
                                    >
                                        {id === 'using' ? '使用中' : '已售出'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {formData.costType === 'per_use' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden bg-primary/5 rounded-[0.9rem] border border-primary/10"
                            >
                                <div className="flex items-center justify-between px-4 py-2">
                                    <label className="text-[9px] font-black tracking-[0.15em] text-primary uppercase">累计使用次数</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-16 bg-transparent text-right outline-none font-black text-sm text-primary"
                                        value={formData.usageCount || ''}
                                        onChange={e => setFormData({ ...formData, usageCount: Math.max(1, Number(e.target.value)) })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent mx-auto opacity-50" />

                {/* Classification: Compact Horizontal */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-3">分类与标识</label>
                        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide max-w-[200px]">
                            {['全部', '科技', '居家', '出行', '个护', '运动'].map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={cn(
                                        "text-[8px] font-black px-2 py-1 rounded-full transition-all whitespace-nowrap",
                                        formData.category === cat ? "bg-foreground text-background shadow-md" : "bg-black/[0.03] dark:bg-white/[0.03] text-muted-foreground"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-[105px] overflow-hidden liquid-glass rounded-[1rem] bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 relative shadow-inner">
                        <div className="grid grid-cols-8 gap-1.5 content-start overflow-y-auto h-full p-2.5 custom-scrollbar scroll-smooth">
                            {(() => {
                                const currentCat = formData.category || '全部';
                                const icons = currentCat === '全部'
                                    ? Object.values(iconCategories).flat()
                                    : (iconCategories[currentCat as keyof typeof iconCategories] || Object.values(iconCategories).flat());

                                return icons.map((emoji: string, idx: number) => (
                                    <button
                                        key={`${emoji}-${idx}`}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon: emoji })}
                                        className={cn(
                                            "text-base p-1 rounded-lg transition-all flex items-center justify-center aspect-square",
                                            formData.icon === emoji
                                                ? "bg-foreground/10 ring-1 ring-foreground/40 scale-105"
                                                : "opacity-30 hover:opacity-100"
                                        )}
                                    >
                                        {emoji}
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 rounded-[1rem] font-black text-sm text-background bg-foreground shadow-lg shadow-foreground/10 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>{title.includes("编辑") ? "保存修改" : "确认添加物品"}</span>
                    </div>
                </motion.button>
            </form>
        </Drawer>
    );
}
