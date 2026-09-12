'use client';

import { useMemo } from 'react';
import { formatLargeNumber } from '@/lib/utils';
import { computeStats } from '@/lib/stats';
import { CategoryBar } from '@/components/home/CategoryBar';
import { Item, ItemStatus } from '@/lib/types';

interface StatsDashboardProps {
    items: Item[];
    status: ItemStatus;
}

function RankList({ rows }: { rows: { id: string; icon?: string; name: string; cost: number; unit: string }[] }) {
    if (rows.length === 0) return null;
    return (
        <div className="group card-in">
            {rows.map((r, i) => (
                <div key={r.id} className="rowitem px-3.5 py-[11px] gap-3">
                    <span className="w-[22px] h-[22px] rounded-[7px] grid place-items-center text-[11px] font-bold bg-fill text-label2 shrink-0 tabular-nums">
                        {i + 1}
                    </span>
                    <span className="text-[17px] leading-none shrink-0">{r.icon || '📦'}</span>
                    <span className="flex-1 text-[14px] font-medium tracking-[-0.01em] text-label truncate">
                        {r.name}
                    </span>
                    <span className="text-[14px] font-semibold text-tint tabular-nums shrink-0">
                        ¥{formatLargeNumber(r.cost, 1)}
                        <span className="text-[11px] font-medium text-label3 ml-px">/{r.unit}</span>
                    </span>
                </div>
            ))}
        </div>
    );
}

export function StatsDashboard({ items, status }: StatsDashboardProps) {
    const isUsing = status === 'using';
    const s = useMemo(() => computeStats(items, status), [items, status]);

    const avg = s.count > 0 ? s.totalValue / s.count : 0;

    return (
        <div className="pb-4">
            {/* 总价值 */}
            <section>
                <h2 className="sechead">{isUsing ? '使用中资产' : '已归档资产'}</h2>
                <div className="group card-in px-3.5 py-4 text-center">
                    <div className="text-[12px] font-semibold text-label2 uppercase tracking-[0.05em]">
                        总价值
                    </div>
                    <div className="text-[44px] font-bold tracking-[-0.04em] text-tint tabular-nums mt-1.5 leading-none">
                        ¥{formatLargeNumber(s.totalValue)}
                    </div>
                    <div className="text-[12.5px] text-label3 mt-2 tabular-nums">
                        {s.count} 件物品 · 平均 ¥{formatLargeNumber(avg)}
                    </div>
                </div>
            </section>

            {/* 类别分布 */}
            {s.categories.length > 0 && (
                <section>
                    <h2 className="sechead">类别分布</h2>
                    <CategoryBar categories={s.categories} />
                </section>
            )}

            {/* 日均消耗 */}
            {s.count > 0 && (
                <section>
                    <h2 className="sechead">每日均摊合计</h2>
                    <div className="group card-in px-3.5 py-4 flex items-baseline justify-center gap-1 tabular-nums">
                        <span className="text-[22px] font-semibold text-tint">¥</span>
                        <span className="text-[40px] font-bold tracking-[-0.04em] text-tint leading-none">
                            {s.dailyBurn.toFixed(2)}
                        </span>
                        <span className="text-[14px] font-medium text-label3 ml-1">/天</span>
                    </div>
                </section>
            )}

            {/* 高效能 */}
            {s.efficient.length > 0 && (
                <section>
                    <h2 className="sechead">高效能 · 每元用最久</h2>
                    <RankList
                        rows={s.efficient.map(i => ({
                            id: i.id, icon: i.icon, name: i.name,
                            cost: i.unitCost, unit: i.costType === 'daily' ? '天' : '次',
                        }))}
                    />
                </section>
            )}

            {/* 最烧钱 */}
            {s.highCost.length > 0 && (
                <section>
                    <h2 className="sechead">最烧钱 · 单位成本最高</h2>
                    <RankList
                        rows={s.highCost.map(i => ({
                            id: i.id, icon: i.icon, name: i.name,
                            cost: i.unitCost, unit: i.costType === 'daily' ? '天' : '次',
                        }))}
                    />
                </section>
            )}
        </div>
    );
}
