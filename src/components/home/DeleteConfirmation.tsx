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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.24 }}
                    className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-[2px]"
                    style={{ background: 'oklch(0 0 0 / 0.4)' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                        className="w-full max-w-[280px] bg-bg rounded-[16px] p-5 text-center"
                        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
                    >
                        <div
                            className="w-11 h-11 rounded-full grid place-items-center mx-auto mb-3"
                            style={{ background: 'color-mix(in oklab, var(--red) 12%, transparent)' }}
                        >
                            <AlertCircle className="w-[22px] h-[22px]" style={{ color: 'var(--red)' }} />
                        </div>

                        <h3 className="text-[17px] font-semibold text-label mb-1.5">确认删除？</h3>
                        <p className="text-[13px] text-label2 leading-relaxed mb-5">
                            此操作无法撤销。
                        </p>

                        <div className="flex flex-col gap-2">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={onConfirm}
                                className="h-11 rounded-[12px] text-white text-[16px] font-semibold"
                                style={{ background: 'var(--red)' }}
                            >
                                删除
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={onCancel}
                                className="h-11 rounded-[12px] bg-fill text-tint text-[16px] font-semibold"
                            >
                                取消
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
