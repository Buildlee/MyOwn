'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Layers, BarChart3, RefreshCw, Sparkles } from 'lucide-react';

interface WelcomeGuideProps {
    showGuide: boolean;
    onComplete: () => void;
}

const FEATURES = [
    { Icon: Coins, title: '感知价值核心', desc: '每件物品按天或按次摊算真实成本' },
    { Icon: Layers, title: '手势交互', desc: '左滑置顶，右滑删除' },
    { Icon: BarChart3, title: '资产洞察', desc: '类别占比与效率分析' },
    { Icon: RefreshCw, title: '生命周期', desc: '从购入到售出的完整追踪' },
    { Icon: Sparkles, title: 'AI 录入', desc: '扫描小票自动填入名称与价格' },
];

export function WelcomeGuide({ showGuide, onComplete }: WelcomeGuideProps) {
    return (
        <AnimatePresence>
            {showGuide && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[300] flex items-center justify-center p-5 backdrop-blur-[3px]"
                    style={{ background: 'oklch(0 0 0 / 0.45)' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="w-full max-w-sm bg-bg rounded-[16px] overflow-hidden"
                        style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
                    >
                        <div className="px-5 pt-5 pb-4">
                            <h2 className="text-[22px] font-bold tracking-[-0.024em] text-label">
                                欢迎使用 MyOwn
                            </h2>
                            <p className="text-[13px] text-label2 mt-1">
                                花 20 秒了解核心能力
                            </p>
                        </div>

                        <div className="px-5 pb-4 space-y-2.5 max-h-[52vh] overflow-y-auto no-scrollbar">
                            {FEATURES.map(({ Icon, title, desc }, i) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className="w-8 h-8 rounded-[9px] grid place-items-center shrink-0 mt-0.5 bg-fill text-tint"
                                    >
                                        <Icon className="w-[17px] h-[17px]" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[15px] font-semibold text-label">{title}</div>
                                        <div className="text-[12.5px] text-label2 mt-0.5 leading-relaxed">{desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="px-5 pb-5 pt-1">
                            <motion.button
                                whileTap={{ scale: 0.975 }}
                                onClick={onComplete}
                                className="w-full h-[50px] rounded-[12px] text-white text-[17px] font-semibold tracking-[-0.015em]"
                                style={{ background: 'var(--tint)' }}
                            >
                                开始使用
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
