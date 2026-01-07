'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export function Drawer({ isOpen, onClose, children, title }: DrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 z-50 liquid-glass rounded-t-[2.2rem] max-h-[90vh] overflow-y-auto pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                    >
                        <div className="sticky top-0 z-30 bg-white/40 dark:bg-black/20 backdrop-blur-3xl border-b border-black/[0.03] dark:border-white/5 rounded-t-[2.2rem]">
                            <div className="px-6 py-5 flex justify-between items-center">
                                <h2 className="text-xl font-black tracking-tighter text-foreground/80 lowercase">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all active:scale-90"
                                >
                                    <X className="w-5 h-5 text-foreground/40" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
