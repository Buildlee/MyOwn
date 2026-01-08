'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, motionValue, useTransform, useAnimation, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Tag,
  Banknote,
  Trash2,
  Settings,
  AlertCircle,
  X,
  ChevronRight,
  Sparkles,
  Pin,
  ArrowUpDown,
  Clock,
  Sun,
  Moon,
  MoreVertical,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  HelpCircle,
  BookOpen,
  MousePointer2,
  Palette,
  Layers,
  ChevronDown,
  ArrowRight,
  BarChart3,
  History
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useItems } from '@/lib/hooks';
import { Drawer } from '@/components/Drawer';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { StatsDashboard } from '@/components/StatsDashboard';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { Item, CostType } from '@/lib/types';
import { cn, getGradient } from '@/lib/utils';

const iconCategories = {
  '科技': ['💻', '📱', '⌚', '🎧', '🖱️', '⌨️', '🎮', '📸', '📹', '📡', '🎙️', '🔦', '🔋', '🔌', '🎛️'],
  '居家': ['🏠', '🛋️', '🛏️', '🪑', '🛁', '🧹', '🧺', '🍳', '☕', '🍱', '🧼', '🪴', '🧊', '🧴', '🕯️'],
  '出行': ['🚗', '🚲', '🛴', '🛹', '🚁', '⛴️', '🎫', '🗺️', '🕶️', '🎒', '🧳', '🧢', '🌂', '🔑', '🧭'],
  '个护': ['👕', '👗', '🧥', '👞', '👠', '👜', '💄', '💍', '✂️', '🧴', '🧼', '🦷', '🧺', '🧶', '🪮'],
  '运动/爱好': ['⚽', '🏀', '🏸', '🎾', '🥊', '🛹', '🎸', '🎹', '🎨', '📚', '🏊', '🚴', '🧘', '🐱', '🐶', '🌿']
};

export default function Home() {
  const { items, addItem, updateItem, deleteItem, togglePin, summary } = useItems();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const hasVisited = localStorage.getItem('myown_visited_v1');
    if (!hasVisited) {
      setShowGuide(true);
    }

    const savedStatsSetting = localStorage.getItem('myown_enable_stats_click');
    if (savedStatsSetting !== null) {
      setEnableStatsClick(savedStatsSetting === 'true');
    }
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
    if (showGuide || statsConfig.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showGuide, statsConfig.isOpen]);

  const handleSortClick = (id: 'date' | 'value' | 'cost') => {
    if (sortBy === id) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(id);
      setSortOrder('desc');
    }
  };

  // Form State
  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    name: '',
    price: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    usageCount: 1,
    costType: 'daily',
    status: 'using',
    category: '全部',
    icon: '📦'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      usageCount: 1,
      costType: 'daily',
      status: 'using',
      category: '全部',
      icon: '📦'
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      purchaseDate: item.purchaseDate,
      usageCount: item.usageCount,
      costType: item.costType,
      status: item.status,
      category: item.category || '全部',
      icon: item.icon || '📦'
    });
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItem({ ...formData, id: editingItem.id });
    } else {
      addItem(formData);
    }
    setIsDrawerOpen(false);
  };

  const sortedItems = useMemo(() => {
    const list = [...items].sort((a, b) => {
      // 1. Pinned items first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // 2. Secondary sort by sortBy state
      let comparison = 0;
      if (sortBy === 'value') {
        comparison = (b.price || 0) - (a.price || 0);
      } else if (sortBy === 'cost') {
        const getCost = (item: Item) => {
          const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate || Date.now()).getTime()) / 86400000));
          const val = item.costType === 'daily' ? (item.price / days) : (item.price / Math.max(1, item.usageCount));
          return isFinite(val) ? val : 0;
        };
        comparison = getCost(b) - getCost(a);
      } else {
        const dateA = new Date(a.purchaseDate || 0).getTime();
        const dateB = new Date(b.purchaseDate || 0).getTime();
        comparison = (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      }

      // 如果比较结果为 0，保持原有顺序
      return sortOrder === 'desc' ? comparison : -comparison;
    });
    return list;
  }, [items, sortBy, sortOrder]);

  const usingItems = sortedItems.filter(i => i.status === 'using');
  const soldItems = sortedItems.filter(i => i.status === 'sold');

  return (
    <main className="flex flex-col items-center pb-24 sm:pb-12 max-w-5xl mx-auto w-full min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          backgroundColor: isScrolled ? (theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)') : 'rgba(0,0,0,0)',
          backdropFilter: isScrolled ? 'blur(24px) saturate(180%)' : 'blur(0px) saturate(100%)',
          boxShadow: isScrolled ? '0 12px 40px -10px rgba(0, 0, 0, 0.15)' : '0 0 0 0 rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="w-full flex justify-between items-center p-6 sm:p-8 pt-[calc(env(safe-area-inset-top)+1.5rem)] sticky top-0 z-[210] border-b border-transparent transform-gpu will-change-[background-color,backdrop-filter,box-shadow,border-bottom-color] transition-all duration-[250ms]"
      >
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-500 via-fuchsia-500 to-primary bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
            MyOwn
          </h1>
          <p className="text-muted-foreground/40 text-[9px] sm:text-[10px] font-medium mt-2 uppercase tracking-[0.35em] flex items-center gap-2 font-mono">
            Value tracking
            <span className="w-1 h-1 rounded-full bg-primary/30" />
            Just focus
          </p>
        </div>
        <div className="flex items-center space-x-1.5">
          {mounted && (
            <motion.button
              whileTap={{ scale: 0.9, rotate: 15 }}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (isTransitioning) return;

                setIsTransitioning(true);
                const nextTheme = theme === 'dark' ? 'light' : 'dark';

                // Set the clip-path origin coordinates
                const x = e.clientX;
                const y = e.clientY;
                document.documentElement.style.setProperty('--x', `${x}px`);
                document.documentElement.style.setProperty('--y', `${y}px`);

                const toggleTheme = () => {
                  setTheme(nextTheme);
                  // Cooldown period matching the CSS duration (1s) plus a small buffer
                  setTimeout(() => setIsTransitioning(false), 1000);
                };

                if (!(document as any).startViewTransition) {
                  toggleTheme();
                  return;
                }

                (document as any).startViewTransition(() => {
                  setTheme(nextTheme);
                });

                // If using ViewTransition, we still need to unlock after the animation
                setTimeout(() => setIsTransitioning(false), 1000);
              }}
              className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-white/5 border border-white/10 relative transform-gpu"
            >
              {theme === 'dark' ? (
                <motion.div initial={{ scale: 0.5, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                  <Sun className="w-5 h-5 text-amber-400" />
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.5, rotate: 45 }} animate={{ scale: 1, rotate: 0 }}>
                  <Moon className="w-5 h-5 text-indigo-400" />
                </motion.div>
              )}
            </motion.button>
          )}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-white/5 border border-white/10"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="hidden sm:flex p-2.5 bg-foreground text-background rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-foreground/5"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShowGuide={() => setShowGuide(true)}
        enableStatsClick={enableStatsClick}
        onToggleStatsClick={handleToggleStatsClick}
      />

      <div className="w-full px-6 pt-1 space-y-8 sm:space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 35, delay: 0.1 }}
          className="w-full grid grid-cols-2 gap-px liquid-glass rounded-[2rem] overflow-hidden transform-gpu shadow-lg hover:shadow-2xl transition-all duration-500 group"
        >
          <div className="bg-transparent p-5 sm:p-7 flex flex-col justify-center min-h-[100px] sm:min-h-[120px] transition-all border-r border-black/[0.03] dark:border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center space-x-2 text-muted-foreground/60">
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black tracking-[0.2em] uppercase">资产总览</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-sm font-bold opacity-20 italic">¥</span>
                <div className="text-3xl sm:text-4xl font-black tracking-tightest">
                  {summary.totalValue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-transparent p-5 sm:p-7 flex flex-col justify-center min-h-[100px] sm:min-h-[120px] transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center space-x-2 text-muted-foreground/60">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-500/60" />
                <span className="text-[9px] font-black tracking-[0.2em] uppercase">日均成本</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-sm font-bold opacity-20 italic">¥</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-500/90 tracking-tightest">
                  {summary.dailyCost.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="space-y-4">
          <div className="px-4 flex items-center gap-2.5 mb-2">
            <div className="p-1 rounded-md bg-primary/10">
              <Layers className="w-3 h-3 text-primary/70" />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">浏览视角 / 排序维度</span>
          </div>

          <div className="flex items-center justify-between px-2 gap-3 h-[52px] liquid-glass p-1.5 rounded-[1.4rem] mx-1.5 shadow-xl border-white/40 dark:border-white/10">
            {/* Left: Sort Dimension */}
            <div className="relative flex-1 flex items-center h-full">
              <motion.div
                layoutId="sort-pill"
                className="absolute h-full bg-foreground rounded-[0.9rem] shadow-lg shadow-foreground/10 transform-gpu will-change-[left,width]"
                initial={false}
                animate={{
                  left: sortBy === 'date' ? '0%' : sortBy === 'value' ? '33.3%' : '66.6%',
                  width: 'calc(33.3%)'
                }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
              />
              {[
                { id: 'date', label: '使用时间' },
                { id: 'value', label: '总价值' },
                { id: 'cost', label: '感知价值' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (sortBy !== s.id) {
                      setSortBy(s.id as any);
                    }
                  }}
                  className={cn(
                    "relative z-10 flex-1 flex items-center justify-center px-1 text-[10px] font-black tracking-widest uppercase transition-colors whitespace-nowrap h-full",
                    sortBy === s.id ? "text-background" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Elegant Divider */}
            <div className="w-[1px] h-4 bg-foreground/10 mx-1 shrink-0" />

            {/* Right: Order Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 px-4 h-full rounded-[0.9rem] text-muted-foreground hover:text-foreground transition-all active:bg-black/[0.1] dark:active:bg-white/10 group bg-transparent border-none shrink-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={sortOrder}
                  initial={{ opacity: 0, rotate: sortOrder === 'desc' ? -90 : 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: sortOrder === 'desc' ? 90 : -90, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {sortOrder === 'desc' ? (
                    <ArrowDownWideNarrow className="w-4 h-4 text-primary" />
                  ) : (
                    <ArrowUpNarrowWide className="w-4 h-4 text-primary" />
                  )}
                </motion.div>
              </AnimatePresence>
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
                {sortOrder === 'desc' ? '从大到小' : '从小到大'}
              </span>
            </motion.button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <motion.button
              whileHover={enableStatsClick ? { scale: 1.02 } : {}}
              whileTap={enableStatsClick ? { scale: 0.98 } : {}}
              onClick={() => enableStatsClick && setStatsConfig({ isOpen: true, status: 'using' })}
              className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 rounded-full liquid-glass border-white/20 shadow-sm group transition-all",
                enableStatsClick ? "hover:bg-emerald-500/5 cursor-pointer" : "cursor-default"
              )}
            >
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-[10px] font-black tracking-[0.2em] opacity-80 uppercase flex items-center gap-2">
                使用中
                {enableStatsClick && (
                  <span className="text-[8px] font-bold opacity-0 group-hover:opacity-40 transition-opacity flex items-center gap-1">
                    <ArrowRight className="w-2.5 h-2.5" /> 资产看板
                  </span>
                )}
              </h2>
            </motion.button>
            <div className="h-px flex-1 bg-gradient-to-r from-foreground/10 to-transparent" />
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {usingItems.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  delay={idx * 0.05}
                  onClick={() => handleOpenEdit(item)}
                  onDelete={() => setConfirmDeleteId(item.id)}
                  onPin={() => togglePin(item.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {soldItems.length > 0 && (
          <div className="space-y-6">
            <div className={cn(
              "flex items-center gap-4 px-2 opacity-50 transition-all",
              enableStatsClick && "hover:opacity-100"
            )}>
              <motion.button
                whileHover={enableStatsClick ? { scale: 1.02 } : {}}
                whileTap={enableStatsClick ? { scale: 0.98 } : {}}
                onClick={() => enableStatsClick && setStatsConfig({ isOpen: true, status: 'sold' })}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-full liquid-glass border-white/10 group transition-all",
                  enableStatsClick ? "hover:bg-primary/5 cursor-pointer" : "cursor-default"
                )}
              >
                <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <h2 className="text-[10px] font-black tracking-[0.2em] opacity-80 uppercase flex items-center gap-2">
                  已售出
                  {enableStatsClick && (
                    <span className="text-[8px] font-bold opacity-0 group-hover:opacity-40 transition-opacity flex items-center gap-1">
                      <ArrowRight className="w-2.5 h-2.5" /> 售出回顾
                    </span>
                  )}
                </h2>
              </motion.button>
              <div className="h-px flex-1 bg-gradient-to-r from-foreground/5 to-transparent" />
            </div>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {soldItems.map((item, idx) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    delay={idx * 0.05}
                    onClick={() => handleOpenEdit(item)}
                    onDelete={() => setConfirmDeleteId(item.id)}
                    onPin={() => togglePin(item.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenAdd}
        className="sm:hidden fixed bottom-10 right-6 w-14 h-14 bg-foreground text-background rounded-full shadow-2xl flex items-center justify-center z-40 active-pulse border border-white/10"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? "编辑物品" : "新增物品"}
      >
        <form onSubmit={handleSubmit} className="space-y-3 pb-4">
          {/* Main Grid: Info & Strategy mixed for density */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-4">物品名称</label>
              <input
                type="text"
                placeholder="如：MacBook Pro M3"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/[0.015] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/10 rounded-[0.9rem] px-4 py-2.5 outline-none focus:ring-2 ring-primary/20 transition-all font-bold text-base placeholder:text-muted-foreground/30 text-foreground shadow-inner"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between ml-4 mr-1">
                  <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase">入手价格</label>
                  <AnimatePresence>
                    {formData.price >= 1000 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 10 }}
                        className="text-[9px] font-black text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10"
                      >
                        ≈ {(() => {
                          const p = formData.price;
                          if (p >= 100000000) return (p / 100000000).toFixed(2) + '亿';
                          if (p >= 10000000) return (p / 10000000).toFixed(2) + '千万';
                          if (p >= 1000000) return (p / 1000000).toFixed(2) + '百万';
                          if (p >= 100000) return (p / 100000).toFixed(2) + '十万';
                          if (p >= 10000) return (p / 10000).toFixed(2) + '万';
                          return (p / 1000).toFixed(1) + '千';
                        })()}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <input
                  required
                  type="number"
                  className="w-full bg-black/[0.015] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/10 rounded-[0.9rem] px-4 py-2.5 outline-none focus:ring-2 ring-primary/20 transition-all font-bold text-sm placeholder:text-muted-foreground/30 text-foreground shadow-inner"
                  value={formData.price || ''}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-4">入手日期</label>
                <CustomDatePicker
                  value={formData.purchaseDate}
                  onChange={(val: string) => setFormData({ ...formData, purchaseDate: val })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-4">计费模式</label>
                <div className="relative grid grid-cols-2 gap-px liquid-glass p-0.5 rounded-[0.8rem] overflow-hidden border-none bg-black/[0.02] dark:bg-white/[0.06] shadow-sm">
                  <motion.div
                    layoutId="costType-pill"
                    className="absolute inset-y-0.5 bg-foreground rounded-[0.6rem] shadow-md z-0"
                    initial={false}
                    animate={{
                      left: formData.costType === 'daily' ? '2px' : '50%',
                      width: 'calc(50% - 2px)'
                    }}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
                  />
                  {['daily', 'per_use'].map(id => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, costType: id as any })}
                      className={cn(
                        "relative z-10 py-2 transition-colors font-black text-[10px] tracking-tighter rounded-[0.7rem]",
                        formData.costType === id ? "text-background" : "text-muted-foreground"
                      )}
                    >
                      {id === 'daily' ? '每日' : '单次'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-4">物品状态</label>
                <div className="relative grid grid-cols-2 gap-px liquid-glass p-0.5 rounded-[0.8rem] overflow-hidden border-none bg-black/[0.02] dark:bg-white/[0.06] shadow-sm">
                  <motion.div
                    layoutId="status-pill"
                    className="absolute inset-y-0.5 bg-foreground rounded-[0.6rem] shadow-md z-0"
                    initial={false}
                    animate={{
                      left: formData.status === 'using' ? '2px' : '50%',
                      width: 'calc(50% - 2px)'
                    }}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
                  />
                  {['using', 'sold'].map(id => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: id as any })}
                      className={cn(
                        "relative z-10 py-2 transition-colors font-black text-[10px] tracking-tighter rounded-[0.7rem]",
                        formData.status === id ? "text-background" : "text-muted-foreground"
                      )}
                    >
                      {id === 'using' ? '使用中' : '已售出'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {formData.costType === 'per_use' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden bg-primary/5 rounded-[0.9rem] border border-primary/10"
                >
                  <div className="flex items-center justify-between px-4 py-2">
                    <label className="text-[9px] font-black tracking-[0.15em] text-primary uppercase">累计使用次数</label>
                    <input
                      type="number"
                      min="1"
                      className="w-16 bg-transparent text-right outline-none font-black text-sm text-primary"
                      value={formData.usageCount || ''}
                      onChange={e => setFormData({ ...formData, usageCount: Math.max(1, Number(e.target.value)) })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent mx-auto opacity-50" />

          {/* Classification: Compact Horizontal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase ml-3">分类与标识</label>
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide max-w-[200px]">
                {['全部', '科技', '居家', '出行', '个护', '运动'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={cn(
                      "text-[8px] font-black px-2 py-1 rounded-full transition-all whitespace-nowrap",
                      formData.category === cat ? "bg-foreground text-background shadow-md" : "bg-black/[0.03] dark:bg-white/[0.03] text-muted-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-[105px] overflow-hidden liquid-glass rounded-[1rem] bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 relative shadow-inner">
              <div className="grid grid-cols-8 gap-1.5 content-start overflow-y-auto h-full p-2.5 custom-scrollbar scroll-smooth">
                {(() => {
                  const currentCat = formData.category || '全部';
                  const icons = currentCat === '全部'
                    ? Object.values(iconCategories).flat()
                    : (iconCategories[currentCat as keyof typeof iconCategories] || Object.values(iconCategories).flat());

                  return icons.map((emoji: string, idx: number) => (
                    <button
                      key={`${emoji}-${idx}`}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={cn(
                        "text-base p-1 rounded-lg transition-all flex items-center justify-center aspect-square",
                        formData.icon === emoji
                          ? "bg-foreground/10 ring-1 ring-foreground/40 scale-105"
                          : "opacity-30 hover:opacity-100"
                      )}
                    >
                      {emoji}
                    </button>
                  ));
                })()}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 rounded-[1rem] font-black text-sm text-background bg-foreground shadow-lg shadow-foreground/10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{editingItem ? "保存修改" : "确认添加物品"}</span>
            </div>
          </motion.button>
        </form>
      </Drawer>

      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm liquid-glass p-8 rounded-[2.5rem] shadow-2xl text-center border-none"
            >
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-5 border border-destructive/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black tracking-tight text-foreground">确认移除项目？</h3>
                <div className="bg-black/[0.03] dark:bg-white/[0.05] p-4 rounded-2xl">
                  <p className="text-muted-foreground/80 text-xs font-bold leading-relaxed">
                    此操作将永久删除该物品记录，<br />数据一经移除将无法恢复。
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="p-4 rounded-2xl bg-black/[0.05] dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-black transition-all text-xs tracking-widest uppercase"
                >
                  放弃
                </button>
                <button
                  onClick={() => {
                    deleteItem(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="p-4 rounded-2xl bg-foreground text-background font-black shadow-lg shadow-foreground/20 active:scale-95 transition-all text-xs tracking-widest uppercase"
                >
                  立即移除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-2xl transform-gpu"
              onClick={completeGuide}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-sm liquid-glass p-5 sm:p-7 rounded-[2.2rem] shadow-2xl border-none overflow-hidden transform-gpu"
            >
              {/* Decorative elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-primary/10 rounded-[1.4rem] flex items-center justify-center mx-auto shadow-inner border border-primary/20">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl font-black tracking-tight text-foreground">欢迎开启 MyOwn</h2>
                  <p className="text-muted-foreground/80 text-[11px] font-bold leading-relaxed">
                    在这里，我们重新定义物品的价值。<br />
                    不再只是冷冰冰的支出，而是真实的感知。
                  </p>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
                  }}
                  className="space-y-3 max-h-[45vh] overflow-y-auto pr-1 no-scrollbar scroll-smooth transform-gpu"
                >
                  <div className="space-y-4">
                    {/* Core Logic */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-primary/20 transition-all">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black">感知价值核心</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">重定义物品成本：长线物品按天分摊价格，高频单品按次数折算，让每一笔消费都有迹可循。</p>
                      </div>
                    </div>

                    {/* Gestures */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-violet-500/20 transition-all">
                      <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black">极速手势交互</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">👉 右滑【置顶】或【取消置顶】核心资产；👈 左滑轻松【移除】冗余记录。</p>
                      </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-emerald-500/20 transition-all">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black">资产洞察看板</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">点击列表分类标题可触发全屏看板，不仅有总值汇总，更有基于日均成本的资产效能深度分析。</p>
                      </div>
                    </div>

                    {/* Status Flow */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-amber-500/20 transition-all">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <History className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black">完整生命周期</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">编辑物品状态即可将其流转至“已售出”分类，记录一段物品陪伴的终点，实现资产闭环管理。</p>
                      </div>
                    </div>

                    {/* Form efficiency */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 group border border-transparent hover:border-cyan-500/20 transition-all">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <MousePointer2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black">极致录入体验</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">全新的零滚动高密度表单，在移动端无需滑动即可一屏完成所有资产信息的精准录入。</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-2" />
                </motion.div>

                <button
                  onClick={completeGuide}
                  className="w-full py-4 rounded-[1.6rem] bg-foreground text-background font-black text-base shadow-xl shadow-foreground/10 active:scale-95 transition-all"
                >
                  开始探索
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <StatsDashboard
        isOpen={statsConfig.isOpen}
        status={statsConfig.status}
        items={items}
        onClose={() => setStatsConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
}

function ItemCard({ item, delay, onClick, onDelete, onPin }: any) {
  const gradient = getGradient(item.name);
  const isSold = item.status === 'sold';
  const isPinned = item.isPinned;
  const controls = useAnimation();

  const x = motionValue(0);

  // Right Overlay (Delete) - Rose Color
  const deleteOpacity = useTransform(x, [-80, -20, 0], [1, 0.4, 0]);
  const deleteScale = useTransform(x, [-80, -20], [1, 0.8]);
  const deleteWidth = useTransform(x, [-140, 0], [140, 0]);

  // Left Overlay (Pin) - Soft Violet/Indigo
  const pinOpacity = useTransform(x, [0, 20, 80], [0, 0.4, 1]);
  const pinScale = useTransform(x, [20, 80], [0.8, 1]);
  const pinWidth = useTransform(x, [0, 140], [0, 140]);

  const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / 86400000));
  const costValue = item.costType === 'daily' ? (item.price / days) : (item.price / Math.max(1, item.usageCount));
  const usageDetail = item.costType === 'daily'
    ? (isSold ? `曾使用 ${days} 天` : `已使用 ${days} 天`)
    : (isSold ? `共使用 ${item.usageCount} 次` : `已使用 ${item.usageCount} 次`);

  const resetPosition = () => controls.start({ x: 0 });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay,
        layout: { type: "spring", stiffness: 500, damping: 50 }
      }}
      className="relative overflow-hidden rounded-[1.6rem] group"
    >
      {/* Left Overlay - Pin Action */}
      <div className="absolute inset-y-0 left-0 flex items-stretch justify-start z-0">
        <motion.div
          style={{ width: pinWidth, opacity: pinOpacity }}
          className="bg-violet-500 rounded-l-[1.6rem] rounded-r-[1.6rem] flex items-center justify-center overflow-hidden"
          onClick={() => {
            onPin();
            resetPosition();
          }}
        >
          <motion.div
            style={{ scale: pinScale }}
            className="flex flex-col items-center gap-1.5 px-8"
          >
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Pin className={cn("w-6 h-6 text-white", isPinned && "fill-white")} />
            </div>
            <span className="text-[10px] text-white font-black uppercase tracking-widest drop-shadow-md whitespace-nowrap">
              {isPinned ? "取消" : "置顶"}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Overlay - Softened Delete Action */}
      <div className="absolute inset-y-0 right-0 flex items-stretch justify-end z-0">
        <motion.div
          style={{ width: deleteWidth, opacity: deleteOpacity }}
          className="bg-rose-400 rounded-l-[1.6rem] rounded-r-[1.6rem] flex items-center justify-center overflow-hidden"
          onClick={() => {
            onDelete();
            resetPosition();
          }}
        >
          <motion.div
            style={{ scale: deleteScale }}
            className="flex flex-col items-center gap-1.5 px-8"
          >
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] shrink-0">
              <Trash2 className="text-white w-6 h-6 fill-white/10" />
            </div>
            <span className="text-[10px] text-white font-black uppercase tracking-widest drop-shadow-md whitespace-nowrap">删除</span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={controls}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -140, right: 140 }}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
        onDragEnd={() => {
          const currentX = x.get();
          if (currentX < -40) {
            controls.start({ x: -100 });
          } else if (currentX > 40) {
            controls.start({ x: 100 });
          } else {
            resetPosition();
          }
        }}
        onClick={(e) => {
          if (Math.abs(x.get()) > 5) {
            resetPosition();
          } else {
            onClick(e);
          }
        }}
        className={cn(
          "relative glass-modern px-4 py-3.5 h-full flex flex-col justify-center hover:bg-white/30 dark:hover:bg-white/[0.07] active:scale-[0.98] transition-all cursor-pointer min-h-[85px] border-white/30 dark:border-white/5 rounded-[1.4rem] shadow-sm hover:shadow-xl duration-500",
          "dark:border-t-white/10 dark:border-l-white/10", // Rim Light
          isSold && "grayscale-[0.8] opacity-60",
          isPinned && "ring-2 ring-primary/30 bg-primary/5 shadow-lg shadow-primary/10"
        )}
      >
        {/* Main Horizontal Row: Icon | Name | Usage | Value */}
        <div className="flex items-center gap-3 w-full">
          {/* Icon */}
          <div className="w-10 h-10 bg-white/40 dark:bg-white/5 rounded-[1.2rem] flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm border border-white/40 dark:border-white/10">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-tr opacity-10 transition-opacity",
              gradient
            )} />
            <span className="text-lg z-10 drop-shadow-sm">{item.icon || '📦'}</span>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            {/* Top Line: Name + Usage + Value */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-bold text-[15px] leading-none truncate text-foreground/90 tracking-tight">{item.name}</h3>
                {isPinned && <Pin className="w-3 h-3 text-primary fill-primary opacity-60 shrink-0" />}
                {/* Usage Badge Inline */}
                <span className="px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[9px] font-bold text-muted-foreground whitespace-nowrap hidden sm:inline-block">
                  {usageDetail}
                </span>
              </div>

              {/* Value - Highlighted & Big */}
              <div className={cn(
                "text-xl font-black leading-none tracking-tighter flex items-center shrink-0",
                isSold ? "text-muted-foreground/50" : "text-primary dark:text-primary-foreground"
              )}>
                <span className="text-[10px] font-bold mr-0.5 opacity-50">¥</span>
                {costValue.toFixed(1)}
                <span className="text-[9px] font-bold ml-0.5 opacity-60">/{item.costType === 'daily' ? '天' : '次'}</span>
              </div>
            </div>

            {/* Sub Line: Price + Usage(Mobile) + Label */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 font-medium tracking-wide">
              <div className="flex items-center gap-2">
                <span>¥{item.price.toLocaleString()}</span>
                <span className="sm:hidden">• {usageDetail}</span>
              </div>
              <div className="scale-90 origin-right opacity-70">
                感知价值
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

