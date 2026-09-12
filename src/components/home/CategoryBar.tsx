'use client';

import { formatLargeNumber } from '@/lib/utils';
import type { CategorySlice } from '@/lib/stats';

interface CategoryBarProps {
    categories: CategorySlice[];
}

export function CategoryBar({ categories }: CategoryBarProps) {
    if (categories.length === 0) return null;

    const shown = categories.slice(0, 4);
    // 超过 4 类时把余量并进最后一项，保证总和 100%
    const restPct = categories.slice(4).reduce((a, c) => a + c.pct, 0);
    // 只有一类时满格长条没有信息量，隐藏
    const showBar = categories.length > 1;

    return (
        <div className="group card-in px-3.5 py-3.5">
            {/* 单条堆叠占比条，段间留 3px 缺口避免糊成一片 */}
            {showBar && (
                <div className="flex gap-[3px] h-[7px] rounded-full overflow-hidden">
                    {shown.map((c, i) => (
                        <span
                            key={c.name}
                            className="h-full rounded-full scale-in card-in"
                            style={{
                                width: `${c.pct}%`,
                                background: `var(--cat-${i})`,
                                animationDelay: `${i * 60}ms`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* 图例：金额是与类别同等重要的数据，用足对比度 */}
            <div className={showBar ? 'mt-3' : ''}>
                {shown.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-2.5 py-1.5 relative">
                        {i > 0 && <span className="absolute top-0 left-0 right-0 h-px bg-sep" />}
                        <span
                            className="w-2 h-2 rounded-[2.5px] shrink-0"
                            style={{ background: `var(--cat-${i})` }}
                        />
                        <span className="flex-1 text-[13px] font-medium text-label truncate">
                            {c.name}
                        </span>
                        <span className="text-[13px] font-semibold text-label tabular-nums">
                            ¥{formatLargeNumber(c.value)}
                        </span>
                        <span className="text-[12px] text-label2 tabular-nums text-right min-w-[34px]">
                            {i === shown.length - 1 && restPct > 0
                                ? `${(c.pct + restPct).toFixed(0)}%`
                                : `${c.pct.toFixed(0)}%`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
