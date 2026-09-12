'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export function Drawer({ isOpen, onClose, children, title }: DrawerProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[200] backdrop"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.9 }}
                        className="fixed inset-x-0 bottom-0 z-[210] bg-bg rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-[0_-4px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_40px_rgba(0,0,0,0.3)]"
                    >
                        {/* Grabber */}
                        <div className="sticky top-0 z-10 bg-bg rounded-t-2xl">
                            <div className="flex justify-center pt-2 pb-1">
                                <div className="w-9 h-[4px] rounded-full bg-border" />
                            </div>
                            {title && (
                                <div className="px-6 pb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-text">{title}</h2>
                                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card2 transition-colors text-text2">
                                        <X className="w-[18px] h-[18px]" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="px-6 pb-6">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
