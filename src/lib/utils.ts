import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getGradient(name: string) {
    const gradients = [
        'from-violet-500/20 to-fuchsia-500/20',
        'from-blue-500/20 to-cyan-500/20',
        'from-emerald-500/20 to-teal-500/20',
        'from-amber-500/20 to-orange-500/20',
        'from-rose-500/20 to-pink-500/20',
        'from-indigo-500/20 to-purple-500/20',
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return gradients[Math.abs(hash) % gradients.length];
}
