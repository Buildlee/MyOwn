import { Item, ItemStatus } from './types';

export interface CategorySlice {
    name: string;
    value: number;
    /** 0-100 */
    pct: number;
}

export interface ItemWithCost extends Item {
    /** 每天或每次的均摊成本 */
    unitCost: number;
}

/** 计算单件物品的均摊成本 */
export function costOf(item: Item): number {
    if (item.costType === 'per_use') {
        return item.price / Math.max(1, item.usageCount);
    }
    const days = Math.max(1, Math.floor(
        (Date.now() - new Date(item.purchaseDate).getTime()) / 86400000
    ));
    const v = item.price / days;
    return Number.isFinite(v) ? v : 0;
}

/** 类别价值占比分布，按价值降序 */
export function categoryBreakdown(items: Item[]): CategorySlice[] {
    const total = items.reduce((a, c) => a + c.price, 0);
    if (total <= 0) return [];

    const acc: Record<string, number> = {};
    items.forEach(i => { acc[i.category] = (acc[i.category] || 0) + i.price; });

    return Object.entries(acc)
        .sort(([, a], [, b]) => b - a)
        .map(([name, value]) => ({ name, value, pct: (value / total) * 100 }));
}

/** 指定状态下的完整统计 */
export function computeStats(items: Item[], status: ItemStatus) {
    const filtered = items.filter(i => i.status === status);
    const totalValue = filtered.reduce((a, c) => a + c.price, 0);

    const withCost: ItemWithCost[] = filtered
        .map(i => ({ ...i, unitCost: costOf(i) }))
        .sort((a, b) => a.unitCost - b.unitCost);

    return {
        count: filtered.length,
        totalValue,
        categories: categoryBreakdown(filtered),
        efficient: withCost.slice(0, 3),
        highCost: [...withCost].reverse().slice(0, 3),
        dailyBurn: withCost.reduce((a, c) => a + c.unitCost, 0),
    };
}
