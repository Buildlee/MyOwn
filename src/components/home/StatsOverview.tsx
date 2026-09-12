'use client';

import { useEffect, useRef, useState } from 'react';
import { formatLargeNumber } from '@/lib/utils';

interface StatsOverviewProps {
    summary: { totalValue: number; dailyCost: number };
    usingCount: number;
    soldCount: number;
}

/** 主数字滚动计数，尊重减少动效偏好 */
function useCountUp(target: number, duration = 900) {
    const [val, setVal] = useState(0);
    const raf = useRef<number>(0);

    useEffect(() => {
        const reduce = typeof window !== 'undefined'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { setVal(target); return; }

        const t0 = performance.now();
        const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            setVal(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [target, duration]);

    return val;
}

export function StatsOverview({ summary, usingCount, soldCount }: StatsOverviewProps) {
    const animated = useCountUp(summary.dailyCost);

    return (
        <div className="group card-in">
            {/* 主指标 */}
            <div className="px-3.5 pt-4">
                <div className="text-[13px] font-medium text-label2">日均成本</div>
                <div className="flex items-baseline gap-px mt-1.5 tabular-nums">
                    <span className="text-[25px] font-semibold text-tint tracking-[-0.02em]">¥</span>
                    <span className="text-[56px] font-bold tracking-[-0.042em] leading-[0.9] text-tint">
                        {animated.toFixed(1)}
                    </span>
                    <span className="text-[15px] font-medium text-label3 ml-1">/天</span>
                </div>
                <div className="text-[12.5px] text-label2 mt-2.5 tabular-nums">
                    每月约 <b className="text-label font-semibold">¥{formatLargeNumber(summary.dailyCost * 30, 0)}</b>
                    <span className="text-label3 mx-1.5">·</span>
                    每小时 <b className="text-label font-semibold">¥{(summary.dailyCost / 24).toFixed(1)}</b>
                </div>
            </div>

            {/* 三列 */}
            <div className="flex border-t border-sep mt-3.5">
                {[
                    { k: '使用中', v: `${usingCount} 件` },
                    { k: '总价值', v: `¥${formatLargeNumber(summary.totalValue)}` },
                    { k: '已售出', v: `${soldCount} 件` },
                ].map((c, i) => (
                    <div
                        key={c.k}
                        className="flex-1 px-3.5 py-3 relative"
                    >
                        {i > 0 && (
                            <span className="absolute left-0 top-[11px] bottom-[11px] w-px bg-sep" />
                        )}
                        <div className="text-[12px] font-medium text-label2">{c.k}</div>
                        <div className="text-[16px] font-semibold tracking-[-0.018em] mt-[3px] tabular-nums text-label">
                            {c.v}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
