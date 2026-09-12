'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useItems } from '@/lib/hooks';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { StatsDashboard } from '@/components/StatsDashboard';
import { Item } from '@/lib/types';
import { HomeHeader } from '@/components/home/HomeHeader';
import { StatsOverview } from '@/components/home/StatsOverview';
import { FilterBar } from '@/components/home/FilterBar';
import { ItemSection } from '@/components/home/ItemSection';
import { ItemEditDrawer } from '@/components/home/ItemEditDrawer';
import { DeleteConfirmation } from '@/components/home/DeleteConfirmation';
import { WelcomeGuide } from '@/components/home/WelcomeGuide';

const iconCategories = {
  '科技': ['💻', '📱', '⌚', '🎧', '🖱️', '⌨️', '🎮', '📸', '📹', '📡', '🎙️', '🔦', '🔋', '🔌', '🎛️'],
  '居家': ['🏠', '🛋️', '🛏️', '🪑', '🛁', '🧹', '🧺', '🍳', '☕', '🍱', '🧼', '🪴', '🧊', '🧴', '🕯️'],
  '出行': ['🚗', '🚲', '🛴', '🛹', '🚁', '⛴️', '🎫', '🗺️', '🕶️', '🎒', '🧳', '🧢', '🌂', '🔑', '🧭'],
  '个护': ['👕', '👗', '🧥', '👞', '👠', '👜', '💄', '💍', '✂️', '🧴', '🧼', '🦷', '🧺', '🧶', '🪮'],
  '运动/爱好': ['⚽', '🏀', '🏸', '🎾', '🥊', '🛹', '🎸', '🎹', '🎨', '📚', '🏊', '🚴', '🧘', '🐱', '🐶', '🌿']
};

export default function Home() {
  const { items, addItem, updateItem, deleteItem, togglePin, summary } = useItems();
  const [mounted, setMounted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [statsConfig, setStatsConfig] = useState<{ isOpen: boolean; status: 'using' | 'sold' }>({ isOpen: false, status: 'using' });
  const [enableStatsClick, setEnableStatsClick] = useState(true);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    setMounted(true);
    const hasVisited = localStorage.getItem('myown_visited_v1');
    if (!hasVisited) setShowGuide(true);
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
    document.body.style.overflow = (showGuide || statsConfig.isOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showGuide, statsConfig.isOpen]);

  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    name: '', price: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    usageCount: 1, costType: 'daily',
    status: 'using', category: '全部', icon: '📦'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', price: 0, purchaseDate: new Date().toISOString().split('T')[0], usageCount: 1, costType: 'daily', status: 'using', category: '全部', icon: '📦' });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({ name: item.name, price: item.price, purchaseDate: item.purchaseDate, usageCount: item.usageCount, costType: item.costType, status: item.status, category: item.category || '全部', icon: item.icon || '📦' });
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) updateItem({ ...formData, id: editingItem.id });
    else addItem(formData);
    setIsDrawerOpen(false);
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      let comparison = 0;
      if (sortBy === 'value') comparison = (b.price || 0) - (a.price || 0);
      else if (sortBy === 'cost') {
        const getCost = (item: Item) => {
          const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate || Date.now()).getTime()) / 86400000));
          const val = item.costType === 'daily' ? (item.price / days) : (item.price / Math.max(1, item.usageCount));
          return isFinite(val) ? val : 0;
        };
        comparison = getCost(b) - getCost(a);
      } else {
        comparison = (new Date(a.purchaseDate || 0).getTime()) - (new Date(b.purchaseDate || 0).getTime());
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });
  }, [items, sortBy, sortOrder]);

  const usingItems = sortedItems.filter(i => i.status === 'using');
  const soldItems = sortedItems.filter(i => i.status === 'sold');

  return (
    <main className="flex flex-col items-center pb-28 sm:pb-16 max-w-5xl mx-auto w-full min-h-screen px-6 pt-2">
      <HomeHeader
        isScrolled={isScrolled}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdd={handleOpenAdd}
        mounted={mounted}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShowGuide={() => setShowGuide(true)}
        enableStatsClick={enableStatsClick}
        onToggleStatsClick={handleToggleStatsClick}
      />

      <div className="w-full space-y-6 mt-6 sm:mt-8">
        <StatsOverview summary={summary} />

        <FilterBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          onToggleOrder={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
        />

        <ItemSection
          title="使用中"
          status="using"
          items={usingItems}
          enableStats={enableStatsClick}
          onStatsClick={() => enableStatsClick && setStatsConfig({ isOpen: true, status: 'using' })}
          onItemClick={handleOpenEdit}
          onDelete={setConfirmDeleteId}
          onPin={togglePin}
        />

        <ItemSection
          title="已售出"
          status="sold"
          items={soldItems}
          enableStats={enableStatsClick}
          onStatsClick={() => enableStatsClick && setStatsConfig({ isOpen: true, status: 'sold' })}
          onItemClick={handleOpenEdit}
          onDelete={setConfirmDeleteId}
          onPin={togglePin}
        />
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenAdd}
        className="sm:hidden fixed bottom-8 right-6 h-14 px-6 bg-text text-bg rounded-full shadow-lg flex items-center gap-2 justify-center z-[50] press"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      <ItemEditDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? "编辑物品" : "新增物品"}
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

      <StatsDashboard
        isOpen={statsConfig.isOpen}
        status={statsConfig.status}
        items={items}
        onClose={() => setStatsConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
}
