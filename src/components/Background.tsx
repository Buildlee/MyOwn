'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Background() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent)]">
            {/* Dynamic Blobs - Enhanced for Liquid Effect */}
            <motion.div
                animate={{
                    x: [0, 80, -40, 0],
                    y: [0, -100, 40, 0],
                    rotate: [0, 90, 180, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-violet-400/30 dark:bg-violet-600/10 blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, -60, 100, 0],
                    y: [0, 80, -60, 0],
                    rotate: [0, -120, 60, 0],
                    scale: [1, 0.9, 1.3, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-fuchsia-400/30 dark:bg-fuchsia-600/10 blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, 100, -80, 0],
                    y: [0, -40, 100, 0],
                    scale: [1, 1.3, 0.7, 1],
                }}
                transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[0%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[100px]"
            />
            <motion.div
                animate={{
                    x: [0, -40, 60, 0],
                    y: [0, 120, -40, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-[20%] right-[10%] w-[75%] h-[75%] rounded-full bg-emerald-300/15 dark:bg-emerald-500/05 blur-[120px]"
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
