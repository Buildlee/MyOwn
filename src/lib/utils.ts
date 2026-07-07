import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatLargeNumber(num: number, digits: number = 2): string {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(digits).replace(/\.?0+$/, '') + '亿';
    }
    if (num >= 10000) {
        return (num / 10000).toFixed(digits).replace(/\.?0+$/, '') + '万';
    }

    if (num % 1 !== 0) {
        return num.toLocaleString('zh-CN', { maximumFractionDigits: digits });
    }
    return num.toLocaleString('zh-CN');
}
