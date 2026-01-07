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
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Dynamic Blobs */}
            <motion.div
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -50, 20, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-violet-400/40 dark:bg-violet-600/15 blur-[100px]"
            />
            <motion.div
                animate={{
                    x: [0, -30, 50, 0],
                    y: [0, 40, -30, 0],
                    scale: [1, 0.9, 1.2, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[10%] -right-[10%] w-[55%] h-[55%] rounded-full bg-fuchsia-400/40 dark:bg-fuchsia-600/15 blur-[100px]"
            />
            <motion.div
                animate={{
                    x: [0, 60, -40, 0],
                    y: [0, -20, 60, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -bottom-[20%] left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-[100px]"
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
