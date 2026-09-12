'use client';

import { useState, useMemo, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useItems } from '@/lib/hooks';
import { costOf } from '@/lib/stats';
import { Item } from '@/lib/types';
import { HomeHeader } from '@/components/home/HomeHeader';
import { StatsOverview } from '@/components/home/StatsOverview';
import { CategoryBar } from '@/components/home/CategoryBar';
import { FilterBar } from '@/components/home/FilterBar';
import { ItemSection } from '@/components/home/ItemSection';
import { ItemEditDrawer } from '@/components/home/ItemEditDrawer';
import { DeleteConfirmation } from '@/components/home/DeleteConfirmation';
import { WelcomeGuide } from '@/components/home/WelcomeGuide';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { StatsDashboard } from '@/components/StatsDashboard';
import { TabBar, TabKey } from '@/components/TabBar';

const iconCategories = {
  '科技': ['💻', '📱', '⌚', '🎧', '🖱️', '⌨️', '🎮', '📸', '📹', '📡', '🎙️', '🔦', '🔋', '🔌', '🎛️'],
  '居家': ['🏠', '🛋️', '🛏️', '🪑', '🛁', '🧹', '🧺', '🍳', '☕', '🍱', '🧼', '🪴', '🧊', '🧴', '🕯️'],
  '出行': ['🚗', '🚲', '🛴', '🛹', '🚁', '⛴️', '🎫', '🗺️', '🕶️', '🎒', '🧳', '🧢', '🌂', '🔑', '🧭'],
  '个护': ['👕', '👗', '🧥', '👞', '👠', '👜', '💄', '💍', '✂️', '🧴', '🧼', '🦷', '🧺', '🧶', '🪮'],
  '运动/爱好': ['⚽', '🏀', '🏸', '🎾', '🥊', '🛹', '🎸', '🎹', '🎨', '📚', '🏊', '🚴', '🧘', '🐱', '🐶', '🌿'],
};

const emptyForm = (): Omit<Item, 'id'> => ({
  name: '',
  price: 0,
  purchaseDate: new Date().toISOString().split('T')[0],
  usageCount: 1,
  costType: 'daily',
  status: 'using',
  category: '全部',
  icon: '📦',
});

export default function Home() {
  const { items, addItem, updateItem, deleteItem, togglePin, summary } = useItems();

  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<TabKey>('items');
  const [showGuide, setShowGuide] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [enableStatsClick, setEnableStatsClick] = useState(true);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Item, 'id'>>(emptyForm);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', v => setIsScrolled(v > 6));

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem('myown_visited_v1')) setShowGuide(true);
    const saved = localStorage.getItem('myown_enable_stats_click');
    if (saved !== null) setEnableStatsClick(saved === 'true');
  }, []);

  const handleToggleStatsClick = (enabled: boolean) => {
    setEnableStatsClick(enabled);
    localStorage.setItem('myown_enable_stats_click', String(enabled));
  };

  const completeGuide = () => {
    localStorage.setItem('myown_visited_v1', 'true');
    setShowGuide(false);
  };

  useEffect(() => {
    document.body.style.overflow = showGuide ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showGuide]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm());
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name, price: item.price, purchaseDate: item.purchaseDate,
      usageCount: item.usageCount, costType: item.costType, status: item.status,
      category: item.category || '全部', icon: item.icon || '📦',
    });
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) updateItem({ ...formData, id: editingItem.id });
    else addItem(formData);
    setIsDrawerOpen(false);
  };

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      let cmp = 0;
      if (sortBy === 'value') cmp = (b.price || 0) - (a.price || 0);
      else if (sortBy === 'cost') cmp = costOf(b) - costOf(a);
      else cmp = new Date(a.purchaseDate || 0).getTime() - new Date(b.purchaseDate || 0).getTime();
      return sortOrder === 'desc' ? cmp : -cmp;
    });
  }, [items, sortBy, sortOrder]);

  const usingItems = sorted.filter(i => i.status === 'using');
  const soldItems = sorted.filter(i => i.status === 'sold');

  const categories = useMemo(() => {
    const total = usingItems.reduce((a, c) => a + c.price, 0);
    if (total <= 0) return [];
    const acc: Record<string, number> = {};
    usingItems.forEach(i => { acc[i.category] = (acc[i.category] || 0) + i.price; });
    return Object.entries(acc)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value, pct: (value / total) * 100 }));
  }, [usingItems]);

  return (
    <main className="flex min-h-[100dvh] flex-col max-w-5xl mx-auto w-full">
      <HomeHeader
        isScrolled={isScrolled}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdd={handleOpenAdd}
        mounted={mounted}
        title={tab === 'items' ? '物品成本' : '统计'}
        subtitle={tab === 'items' ? '记录每一件物品的真实花费' : '资产结构与效率分析'}
      />

      <div className="flex-1 pb-6">
        {tab === 'items' ? (
          <>
            <section>
              <h2 className="sechead">概览</h2>
              <div className="mx-4">
                <StatsOverview
                  summary={summary}
                  usingCount={usingItems.length}
                  soldCount={soldItems.length}
                />
              </div>
            </section>

            {categories.length > 0 && (
              <section>
                <h2 className="sechead">类别占比</h2>
                <div className="mx-4">
                  <CategoryBar categories={categories} />
                </div>
              </section>
            )}

            <ItemSection
              title="使用中"
              items={usingItems}
              header={
                <FilterBar
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  onToggleOrder={() => setSortOrder(p => (p === 'desc' ? 'asc' : 'desc'))}
                />
              }
              onItemClick={handleOpenEdit}
              onDelete={setConfirmDeleteId}
              onPin={togglePin}
            />

            <ItemSection
              title="已售出"
              items={soldItems}
              onItemClick={handleOpenEdit}
              onDelete={setConfirmDeleteId}
              onPin={togglePin}
            />
          </>
        ) : (
          <StatsDashboard items={items} status={enableStatsClick ? 'using' : 'using'} />
        )}
      </div>

      <TabBar active={tab} onChange={setTab} />

      <ItemEditDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? '编辑物品' : '添加物品'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        iconCategories={iconCategories}
      />

      <DeleteConfirmation
        isOpen={!!confirmDeleteId}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) { deleteItem(confirmDeleteId); setConfirmDeleteId(null); }
        }}
      />

      <WelcomeGuide showGuide={showGuide} onComplete={completeGuide} />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShowGuide={() => setShowGuide(true)}
        enableStatsClick={enableStatsClick}
        onToggleStatsClick={handleToggleStatsClick}
      />
    </main>
  );
}
