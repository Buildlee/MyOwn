export type CostType = 'daily' | 'per_use';

export interface Item {
    id: string;
    name: string;
    price: number;
    purchaseDate: string;
    usageCount: number;
    costType: CostType;
    category: string;
    icon: string;
}

export interface SummaryData {
    totalValue: number;
    dailyCost: number;
}
