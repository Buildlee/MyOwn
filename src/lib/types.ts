export type CostType = 'daily' | 'per_use';
export type ItemStatus = 'using' | 'sold';

export interface Item {
    id: string;
    name: string;
    price: number;
    purchaseDate: string;
    usageCount: number;
    costType: CostType;
    status: ItemStatus;
    category: string;
    icon: string;
}

export interface SummaryData {
    totalValue: number;
    dailyCost: number;
}
