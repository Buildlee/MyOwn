'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmationProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmation({ isOpen, onCancel, onConfirm }: DeleteConfirmationProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm liquid-glass p-8 rounded-[2.5rem] shadow-2xl text-center border-none"
                    >
                        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-5 border border-destructive/20">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-black tracking-tight text-foreground">确认移除项目？</h3>
                            <div className="bg-black/[0.03] dark:bg-white/[0.05] p-4 rounded-2xl">
                                <p className="text-muted-foreground/80 text-xs font-bold leading-relaxed">
                                    此操作将永久删除该物品记录，<br />数据一经移除将无法恢复。
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button
                                onClick={onCancel}
                                className="p-4 rounded-2xl bg-black/[0.05] dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-black transition-all text-xs tracking-widest uppercase"
                            >
                                放弃
                            </button>
                            <button
                                onClick={onConfirm}
                                className="p-4 rounded-2xl bg-foreground text-background font-black shadow-lg shadow-foreground/20 active:scale-95 transition-all text-xs tracking-widest uppercase"
                            >
                                立即移除
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
