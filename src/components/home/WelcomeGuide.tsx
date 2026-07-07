'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Layers, BarChart3, RefreshCw, Sparkles } from 'lucide-react';

interface WelcomeGuideProps {
    showGuide: boolean;
    onComplete: () => void;
}

export function WelcomeGuide({ showGuide, onComplete }: WelcomeGuideProps) {
    const features = [
        { icon: DollarSign, title: '感知价值核心', desc: '每件物品按天或按次计算真实成本' },
        { icon: Layers, title: '手势交互', desc: '左滑置顶，右滑删除' },
        { icon: BarChart3, title: '资产洞察', desc: '分类统计，高效能分析' },
        { icon: RefreshCw, title: '生命周期', desc: '从购入到售出的完整追踪' },
        { icon: Sparkles, title: 'AI 录入', desc: '拍照识别小票，自动填入信息' },
    ];

    return (
        <AnimatePresence>
            {showGuide && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] backdrop flex items-center justify-center p-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="w-full max-w-sm bg-bg rounded-2xl p-6 shadow-xl border border-border">
                        <h2 className="text-xl font-bold text-text mb-1">欢迎使用 MyOwn</h2>
                        <p className="text-[13px] text-text2 mb-5">花 20 秒了解核心功能</p>
                        <div className="space-y-2.5 mb-5">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-card2">
                                    <div className="w-7 h-7 rounded-lg bg-bg border border-border flex items-center justify-center text-text2 shrink-0 mt-0.5">
                                        <f.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-medium text-text">{f.title}</p>
                                        <p className="text-[12px] text-text3 mt-0.5">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={onComplete}
                            className="w-full py-3 rounded-xl bg-text text-bg font-semibold text-[15px] active:scale-95 transition-transform hover:opacity-90">
                            开始使用
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
