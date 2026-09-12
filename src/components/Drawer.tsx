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
                        transition={{ duration: 0.28 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[200] backdrop-blur-[2px]"
                        style={{ background: 'oklch(0 0 0 / 0.4)' }}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 32, stiffness: 300, mass: 0.9 }}
                        className="fixed inset-x-0 bottom-0 z-[210] bg-bg max-h-[90vh] overflow-y-auto no-scrollbar rounded-t-[16px]"
                    >
                        {/* Grabber */}
                        <div className="sticky top-0 z-10 bg-bg rounded-t-[16px]">
                            <div className="flex justify-center pt-2 pb-0.5">
                                <span className="block w-9 h-[5px] rounded-full bg-sep" />
                            </div>
                            {title && (
                                <div className="flex items-center justify-between px-4 pt-1.5 pb-3.5">
                                    <h2 className="text-[20px] font-bold tracking-[-0.022em] text-label">
                                        {title}
                                    </h2>
                                    <motion.button
                                        whileTap={{ scale: 0.87 }}
                                        onClick={onClose}
                                        aria-label="关闭"
                                        className="w-8 h-8 grid place-items-center rounded-full bg-fill text-label2"
                                    >
                                        <X className="w-[15px] h-[15px]" strokeWidth={2.6} />
                                    </motion.button>
                                </div>
                            )}
                        </div>
                        <div className="px-4 pb-8">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
