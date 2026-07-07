'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, Sparkles } from 'lucide-react';
import { Drawer } from '@/components/Drawer';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

interface ItemEditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    formData: Omit<Item, 'id'>;
    setFormData: (data: Omit<Item, 'id'>) => void;
    onSubmit: (e: React.FormEvent) => void;
    iconCategories: Record<string, string[]>;
}

export function ItemEditDrawer({
    isOpen, onClose, title, formData, setFormData, onSubmit, iconCategories
}: ItemEditDrawerProps) {
    const [scanning, setScanning] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={onSubmit} className="space-y-5">
                {/* Scan row */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-text3 font-medium">支持拍照自动识别</span>
                    <input type="file" accept="image/*" className="hidden" ref={fileRef}
                        onChange={() => { setScanning(true); setTimeout(() => setScanning(false), 500); }} />
                    <motion.button whileTap={{ scale: 0.95 }} type="button"
                        onClick={() => fileRef.current?.click()} disabled={scanning}
                        className="flex items-center gap-1.5 text-[13px] font-medium text-text2 bg-card2 px-3 py-1.5 rounded-lg border border-border hover:text-text transition-colors disabled:opacity-50 press">
                        {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                        {scanning ? '识别中...' : '扫码导入'}
                    </motion.button>
                </div>

                {/* Name field */}
                <div>
                    <label className="text-xs font-medium text-text3 mb-1.5 block">物品名称</label>
                    <input type="text" placeholder="例如 MacBook Pro M3" value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full card px-4 py-3 text-[15px] text-text outline-none focus:ring-1 focus:ring-text/20 placeholder:text-text3/60" />
                </div>

                {/* Price + Date */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium text-text3 mb-1.5 block">价格</label>
                        <div className="relative">
                            <input type="number" required value={formData.price || ''}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full card px-4 py-3 text-[15px] text-text outline-none focus:ring-1 focus:ring-text/20 pl-7" />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text3 font-medium">¥</span>
                        </div>
                        {formData.price >= 1000 && (
                            <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                                className="inline-block mt-1 text-[10px] text-text2 bg-card2 px-2 py-0.5 rounded-full">
                                ≈ {(() => {
                                    const p = formData.price;
                                    if (p >= 100000000) return (p / 100000000).toFixed(2) + '亿';
                                    if (p >= 10000) return (p / 10000).toFixed(2) + '万';
                                    return (p / 1000).toFixed(1) + '千';
                                })()}
                            </motion.span>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-medium text-text3 mb-1.5 block">日期</label>
                        <CustomDatePicker value={formData.purchaseDate}
                            onChange={(v: string) => setFormData({ ...formData, purchaseDate: v })} />
                    </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium text-text3 mb-1.5 block">计费方式</label>
                        <div className="flex bg-card2 rounded-lg p-0.5 border border-border">
                            {['daily', 'per_use'].map(id => (
                                <button key={id} type="button"
                                    onClick={() => setFormData({ ...formData, costType: id as any })}
                                    className={cn(
                                        "flex-1 py-2.5 text-[13px] font-medium rounded-[7px] transition-all press",
                                        formData.costType === id ? 'bg-text text-bg shadow-sm' : 'text-text2 hover:text-text'
                                    )}>
                                    {id === 'daily' ? '每日' : '单次'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-text3 mb-1.5 block">状态</label>
                        <div className="flex bg-card2 rounded-lg p-0.5 border border-border">
                            {['using', 'sold'].map(id => (
                                <button key={id} type="button"
                                    onClick={() => setFormData({ ...formData, status: id as any })}
                                    className={cn(
                                        "flex-1 py-2.5 text-[13px] font-medium rounded-[7px] transition-all press",
                                        formData.status === id ? 'bg-text text-bg shadow-sm' : 'text-text2 hover:text-text'
                                    )}>
                                    {id === 'using' ? '使用中' : '已售出'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Usage count */}
                <AnimatePresence>
                    {formData.costType === 'per_use' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <div className="card2 p-3 flex items-center justify-between">
                                <label className="text-sm font-medium text-text">使用次数</label>
                                <input type="number" min="1" value={formData.usageCount || ''}
                                    onChange={e => setFormData({ ...formData, usageCount: Math.max(1, Number(e.target.value)) })}
                                    className="w-16 bg-card border border-border rounded-lg px-3 py-1.5 text-right outline-none font-semibold text-sm text-text" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="sep" />

                {/* Category + Icon */}
                <div>
                    <label className="text-xs font-medium text-text3 mb-3 block">分类与图标</label>
                    <div className="flex gap-1.5 flex-wrap mb-3">
                        {['全部', '科技', '居家', '出行', '个护', '运动'].map(cat => (
                            <button key={cat} type="button"
                                onClick={() => setFormData({ ...formData, category: cat })}
                                className={cn(
                                    "text-xs px-3 py-1.5 rounded-lg font-medium transition-all press",
                                    formData.category === cat ? 'bg-text text-bg shadow-sm' : 'bg-card2 text-text2 hover:text-text border border-border'
                                )}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="h-[110px] overflow-y-auto card2 p-2">
                        <div className="grid grid-cols-8 gap-1">
                            {(() => {
                                const cat = formData.category || '全部';
                                const icons = cat === '全部' ? Object.values(iconCategories).flat() : (iconCategories[cat] || Object.values(iconCategories).flat());
                                return icons.slice(0, 64).map((emoji, idx) => (
                                    <motion.button key={`${emoji}-${idx}`} type="button" whileTap={{ scale: 0.9 }}
                                        onClick={() => setFormData({ ...formData, icon: emoji })}
                                        className={cn(
                                            "text-lg p-1.5 rounded-lg transition-all flex items-center justify-center aspect-square",
                                            formData.icon === emoji ? 'bg-card ring-1 ring-text/30 scale-105' : 'opacity-40 hover:opacity-100'
                                        )}>
                                        {emoji}
                                    </motion.button>
                                ));
                            })()}
                        </div>
                    </div>
                </div>

                <motion.button whileTap={{ scale: 0.97 }} type="submit"
                    className="w-full py-3.5 rounded-xl bg-text text-bg font-semibold text-[15px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 press">
                    <Sparkles className="w-4 h-4" />
                    {title.includes("编辑") ? '保存修改' : '添加物品'}
                </motion.button>
            </form>
        </Drawer>
    );
}
