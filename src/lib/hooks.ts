import { useState, useEffect } from 'react';
import { Item, SummaryData } from './types';

export function useItems() {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('myown_items');
        if (saved) {
            setItems(JSON.parse(saved));
        } else {
            // Initial mock data
            const mock: Item[] = [
                {
                    id: '1',
                    name: 'MacBook Pro 14',
                    price: 14999,
                    purchaseDate: new Date(Date.now() - 450 * 86400000).toISOString(),
                    usageCount: 450,
                    costType: 'daily',
                    status: 'using',
                    category: '💻',
                    icon: '💻'
                },
                {
                    id: '2',
                    name: 'Sony A7C',
                    price: 10200,
                    purchaseDate: new Date(Date.now() - 120 * 86400000).toISOString(),
                    usageCount: 120,
                    costType: 'per_use',
                    status: 'using',
                    category: '📸',
                    icon: '📸'
                }
            ];
            setItems(mock);
            localStorage.setItem('myown_items', JSON.stringify(mock));
        }
    }, []);

    const addItem = (item: Omit<Item, 'id'>) => {
        const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
        const newItems = [newItem, ...items];
        setItems(newItems);
        localStorage.setItem('myown_items', JSON.stringify(newItems));
    };

    const updateItem = (updatedItem: Item) => {
        const newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
        setItems(newItems);
        localStorage.setItem('myown_items', JSON.stringify(newItems));
    };

    const deleteItem = (id: string) => {
        const newItems = items.filter(i => i.id !== id);
        setItems(newItems);
        localStorage.setItem('myown_items', JSON.stringify(newItems));
    };

    const summary: SummaryData = items.reduce((acc, item) => {
        acc.totalValue += item.price;

        const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / 86400000));

        if (item.costType === 'daily') {
            acc.dailyCost += item.price / days;
        }

        return acc;
    }, { totalValue: 0, dailyCost: 0 });

    return { items, addItem, updateItem, deleteItem, summary };
}
