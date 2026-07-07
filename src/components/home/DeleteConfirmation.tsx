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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] backdrop flex items-center justify-center p-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="w-full max-w-xs bg-bg rounded-2xl p-6 text-center shadow-xl border border-border">
                        <div className="w-12 h-12 rounded-full bg-destructive/5 flex items-center justify-center mx-auto mb-4 border border-destructive/10">
                            <AlertCircle className="w-6 h-6 text-destructive" />
                        </div>
                        <h3 className="text-[17px] font-semibold text-text mb-2">确认删除？</h3>
                        <p className="text-[13px] text-text2 mb-6 leading-relaxed">此操作无法撤销。</p>
                        <div className="flex gap-3">
                            <button onClick={onCancel}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-card2 text-text font-medium text-[15px] hover:bg-card transition-colors">
                                取消
                            </button>
                            <button onClick={onConfirm}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-destructive text-white font-semibold text-[15px] active:scale-95 transition-transform">
                                删除
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
