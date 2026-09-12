'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, Sparkles } from 'lucide-react';
import { Drawer } from '@/components/Drawer';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { recognizeImage, parseItemDetails } from '@/lib/ocr';
import { recognizeImageWithGemini } from '@/lib/gemini';
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

const CATS = ['全部', '科技', '居家', '出行', '个护', '运动'];

/** 分组小标题 */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: React.ReactNode }) {
    return (
        <div className="mb-4">
            <div className="text-[12px] font-semibold text-label2 uppercase tracking-[0.05em] px-0.5 mb-[7px]">
                {label}
            </div>
            {children}
            {hint}
        </div>
    );
}

function Row({ children }: { children: React.ReactNode }) {
    return <div className="rowitem px-3.5 py-[11px] min-h-[46px] gap-2">{children}</div>;
}

export function ItemEditDrawer({
    isOpen, onClose, title, formData, setFormData, onSubmit, iconCategories,
}: ItemEditDrawerProps) {
    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    /** 识别截图：优先 Gemini，失败或无 Key 时降级本地 Tesseract */
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setScanError(null);
        setScanning(true);

        const rawKey = typeof window !== 'undefined' ? localStorage.getItem('myown_gemini_api_key') : null;
        const apiKey = rawKey ? rawKey.trim() : null;

        try {
            let next: Partial<Item>;
            if (apiKey) {
                try {
                    next = await recognizeImageWithGemini(file, apiKey);
                } catch {
                    // AI 失败（含配额）统一降级本地引擎
                    const text = await recognizeImage(file);
                    next = parseItemDetails(text);
                }
            } else {
                const text = await recognizeImage(file);
                next = parseItemDetails(text);
            }

            setFormData({
                ...formData,
                name: next.name || formData.name,
                price: next.price ?? formData.price,
                purchaseDate: next.purchaseDate || formData.purchaseDate,
            });
        } catch (err) {
            console.error('OCR Error:', err);
            setScanError('识别失败，请手动填写');
        } finally {
            setScanning(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const currentCat = formData.category || '全部';
    const icons = currentCat === '全部'
        ? Object.values(iconCategories).flat()
        : (iconCategories[currentCat] || Object.values(iconCategories).flat());

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={onSubmit}>
                <Field label="名称">
                    <div className="group">
                        <Row>
                            <input
                                type="text"
                                placeholder="MacBook Pro M3"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="flex-1 min-w-0 bg-transparent border-none outline-none text-[16px] tracking-[-0.012em] text-label placeholder:text-label3"
                            />
                        </Row>
                    </div>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                    <Field
                        label="价格"
                        hint={formData.price >= 1000 ? (
                            <span className="inline-block mt-[7px] px-2 py-0.5 rounded-full bg-fill text-[11px] font-medium text-label2">
                                ≈ {formData.price >= 100000000
                                    ? (formData.price / 100000000).toFixed(2) + '亿'
                                    : formData.price >= 10000
                                        ? (formData.price / 10000).toFixed(2) + '万'
                                        : (formData.price / 1000).toFixed(1) + '千'}
                            </span>
                        ) : undefined}
                    >
                        <div className="group">
                            <Row>
                                <span className="text-[16px] font-medium text-label3 shrink-0">¥</span>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    required
                                    value={formData.price || ''}
                                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-[16px] font-semibold text-right tabular-nums text-label"
                                />
                            </Row>
                        </div>
                    </Field>

                    <Field label="入手日期">
                        <CustomDatePicker
                            value={formData.purchaseDate}
                            onChange={(v: string) => setFormData({ ...formData, purchaseDate: v })}
                        />
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="计费方式">
                        <Segmented
                            value={formData.costType}
                            options={[{ id: 'daily', label: '每日' }, { id: 'per_use', label: '单次' }]}
                            onChange={v => setFormData({ ...formData, costType: v as Item['costType'] })}
                        />
                    </Field>
                    <Field label="状态">
                        <Segmented
                            value={formData.status}
                            options={[{ id: 'using', label: '使用中' }, { id: 'sold', label: '已售出' }]}
                            onChange={v => setFormData({ ...formData, status: v as Item['status'] })}
                        />
                    </Field>
                </div>

                <AnimatePresence initial={false}>
                    {formData.costType === 'per_use' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                            className="overflow-hidden"
                        >
                            <Field label="使用次数">
                                <div className="group">
                                    <Row>
                                        <span className="flex-1 text-[16px] text-label">累计次数</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.usageCount || ''}
                                            onChange={e => setFormData({
                                                ...formData,
                                                usageCount: Math.max(1, Number(e.target.value)),
                                            })}
                                            className="w-16 bg-transparent border-none outline-none text-[16px] font-semibold text-right tabular-nums text-label"
                                        />
                                    </Row>
                                </div>
                            </Field>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Field
                    label="扫描小票"
                    hint={
                        scanError
                            ? <span className="text-[11px] text-[var(--red)] px-0.5">{scanError}</span>
                            : <span className="text-[11px] text-label3 px-0.5">识别后自动填入名称与价格</span>
                    }
                >
                    <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} />
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        disabled={scanning}
                        onClick={() => fileRef.current?.click()}
                        className="w-full h-12 rounded-[10px] flex items-center justify-center gap-2 text-[15px] font-semibold text-tint bg-tintsoft disabled:opacity-50 transition-opacity"
                    >
                        {scanning
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Camera className="w-4 h-4" />}
                        {scanning ? '识别中…' : '选择图片'}
                    </motion.button>
                </Field>

                <Field label="分类">
                    <div className="flex gap-2 flex-wrap">
                        {CATS.map(cat => {
                            const on = formData.category === cat;
                            return (
                                <motion.button
                                    key={cat}
                                    whileTap={{ scale: 0.93 }}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={cn(
                                        'px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors',
                                        !on && 'bg-card text-label2'
                                    )}
                                    style={on ? { background: 'var(--tint)', color: '#fff' } : undefined}
                                >
                                    {cat}
                                </motion.button>
                            );
                        })}
                    </div>
                </Field>

                <Field label="图标">
                    <div className="group p-2 h-[112px] overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-8 gap-0.5">
                            {icons.slice(0, 64).map((emoji, idx) => {
                                const on = formData.icon === emoji;
                                return (
                                    <motion.button
                                        key={`${emoji}-${idx}`}
                                        whileTap={{ scale: 0.84 }}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon: emoji })}
                                        className={cn(
                                            'aspect-square grid place-items-center text-[18px] rounded-lg transition-all',
                                            on ? 'bg-fill opacity-100' : 'opacity-35 hover:opacity-100'
                                        )}
                                        style={on ? { boxShadow: '0 0 0 1.5px var(--tint)' } : undefined}
                                    >
                                        {emoji}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </Field>

                <motion.button
                    whileTap={{ scale: 0.975 }}
                    type="submit"
                    className="w-full h-[50px] rounded-[12px] text-white text-[17px] font-semibold tracking-[-0.015em] flex items-center justify-center gap-2 transition-opacity active:opacity-88 mt-1"
                    style={{ background: 'var(--tint)' }}
                >
                    <Sparkles className="w-[17px] h-[17px]" />
                    {title.includes('编辑') ? '保存修改' : '添加物品'}
                </motion.button>
            </form>
        </Drawer>
    );
}

/** iOS 原生分段控件 */
function Segmented({
    value, options, onChange,
}: {
    value: string;
    options: { id: string; label: string }[];
    onChange: (v: string) => void;
}) {
    return (
        <div className="group p-1.5">
            <div className="flex bg-fill rounded-[9px] p-0.5 relative">
                {options.map(o => {
                    const on = value === o.id;
                    return (
                        <button
                            key={o.id}
                            type="button"
                            onClick={() => onChange(o.id)}
                            className="flex-1 relative z-10 py-1.5 text-[13px] rounded-[7px] transition-colors"
                            style={{
                                color: on ? 'var(--label)' : 'var(--label2)',
                                fontWeight: on ? 600 : 500,
                            }}
                        >
                            {on && (
                                <motion.span
                                    layoutId={`seg-${options.map(x => x.id).join('')}`}
                                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                    className="absolute inset-0 rounded-[7px] bg-card shadow-[0_1.5px_4px_rgba(0,0,0,0.14)] dark:bg-[oklch(0.34_0.004_265)]"
                                    style={{ zIndex: -1 }}
                                />
                            )}
                            {o.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
