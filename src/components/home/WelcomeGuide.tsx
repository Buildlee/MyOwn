'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, BarChart3, History, MousePointer2 } from 'lucide-react';

interface WelcomeGuideProps {
    showGuide: boolean;
    onComplete: () => void;
}

export function WelcomeGuide({ showGuide, onComplete }: WelcomeGuideProps) {
    return (
        <AnimatePresence>
            {showGuide && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/60 backdrop-blur-2xl transform-gpu"
                        onClick={onComplete}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="relative w-full max-w-sm liquid-glass p-5 sm:p-7 rounded-[2.2rem] shadow-2xl border-none overflow-hidden transform-gpu"
                    >
                        {/* Decorative elements */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-[1.4rem] flex items-center justify-center mx-auto shadow-inner border border-primary/20">
                                <Sparkles className="w-7 h-7 text-primary" />
                            </div>

                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-black tracking-tight text-foreground">欢迎开启 MyOwn</h2>
                                <p className="text-muted-foreground/80 text-[11px] font-bold leading-relaxed">
                                    在这里，我们重新定义物品的价值。<br />
                                    不再只是冷冰冰的支出，而是真实的感知。
                                </p>
                            </div>

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
                                }}
                                className="space-y-3 max-h-[45vh] overflow-y-auto pr-1 no-scrollbar scroll-smooth transform-gpu"
                            >
                                <div className="space-y-4">
                                    {/* Core Logic */}
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-primary/20 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black">感知价值核心</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">重定义物品成本：长线物品按天分摊价格，高频单品按次数折算，让每一笔消费都有迹可循。</p>
                                        </div>
                                    </div>

                                    {/* Gestures */}
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-violet-500/20 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black">极速手势交互</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">👉 右滑【置顶】或【取消置顶】核心资产；👈 左滑轻松【移除】冗余记录。</p>
                                        </div>
                                    </div>

                                    {/* Stats Dashboard */}
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-emerald-500/20 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <BarChart3 className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black">资产洞察看板</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">点击列表分类标题可触发全屏看板，不仅有总值汇总，更有基于日均成本的资产效能深度分析。</p>
                                        </div>
                                    </div>

                                    {/* Status Flow */}
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-amber-500/20 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <History className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black">完整生命周期</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">编辑物品状态即可将其流转至“已售出”分类，记录一段物品陪伴的终点，实现资产闭环管理。</p>
                                        </div>
                                    </div>

                                    {/* Form efficiency */}
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-cyan-500/20 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <MousePointer2 className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black">极致录入体验</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">全新的零滚动高密度表单，在移动端无需滑动即可一屏完成所有资产信息的精准录入。</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-2" />
                            </motion.div>

                            <button
                                onClick={onComplete}
                                className="w-full py-4 rounded-[1.6rem] bg-foreground text-background font-black text-base shadow-xl shadow-foreground/10 active:scale-95 transition-all"
                            >
                                开始探索
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
