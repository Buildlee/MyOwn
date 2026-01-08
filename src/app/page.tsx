'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, motionValue, useTransform, useAnimation } from 'framer-motion';
import { Plus, Wallet, TrendingDown, Tag, Banknote, Trash2, Settings, AlertCircle, X, ChevronRight, Sparkles, Pin, ArrowUpDown, Clock, Sun, Moon, MoreVertical } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useItems } from '@/lib/hooks';
import { Drawer } from '@/components/Drawer';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { Item, CostType } from '@/lib/types';
import { cn, getGradient } from '@/lib/utils';

const iconCategories = {
  '科技': ['💻', '📱', '⌚', '🎧', '🖱️', '⌨️', '🎮', '📸', '📽️', '💡', '🔋', '🔌'],
  '居家': ['🏠', '🛋️', '🛏️', '🪑', '🛁', '🧹', '🧺', '🍳', '☕', '🍵', '🍶', '🍱'],
  '生活': ['📦', '🎁', '🎈', '📷', '🌂', '🛠️', '⚙️', '🧪', '🧬', '🩺', '💊', '🩹'],
  '时尚': ['🧥', '👕', '👗', '👟', '👠', '👜', '🎒', '🕶️', '💍', '💄', '🧴', '💈'],
  '运动': ['⚽', '🏀', '🏸', '🎾', '🎿', '🥊', '🎸', '🎹', '🎨', '📚', '🎫', '🎡'],
  '自然': ['🐱', '🐶', '🐹', '🐰', '🦊', '🐻', '🐼', '🌿', '🌵', '🌸', '🌻', '🌞']
};

export default function Home() {
  const { items, addItem, updateItem, deleteItem, togglePin, summary } = useItems();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

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
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-between items-center p-6 sm:p-8 pt-[calc(env(safe-area-inset-top)+1.5rem)] sticky top-0 z-30 sm:static"
      >
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-500 via-fuchsia-500 to-primary bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
            MyOwn
          </h1>
          <p className="text-muted-foreground/80 text-[10px] sm:text-xs font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            Value tracking · Just focus
          </p>
        </div>
        <div className="flex items-center space-x-1.5">
          {mounted && (
            <motion.button
              whileTap={{ scale: 0.9, rotate: 15 }}
              onClick={() => {
                const nextTheme = theme === 'dark' ? 'light' : 'dark';

                if (!(document as any).startViewTransition) {
                  setTheme(nextTheme);
                  return;
                }

                (document as any).startViewTransition(() => {
                  setTheme(nextTheme);
                });
              }}
              className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-white/5 border border-white/10"
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
      />

      <div className="w-full px-6 pt-2 space-y-8 sm:space-y-10">
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full grid grid-cols-2 gap-4 p-1.5 liquid-glass rounded-[1.8rem]"
        >
          <div className="bg-white/5 dark:bg-white/5 p-5 rounded-[1.6rem] flex flex-col justify-between min-h-[110px] shadow-sm border border-white/20 dark:border-white/5 transition-all">
            <div className="flex items-center space-x-2 text-muted-foreground/80">
              <Wallet className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-widest uppercase opacity-60">资产总览</span>
            </div>
            <div className="flex items-baseline space-x-0.5 mt-2">
              <span className="text-base font-bold opacity-30 italic">¥</span>
              <div className="text-3xl sm:text-4xl font-black tracking-tighter truncate">
                {summary.totalValue.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white/5 dark:bg-white/5 p-5 rounded-[1.6rem] flex flex-col justify-between min-h-[110px] shadow-sm border border-white/20 dark:border-white/5 transition-all">
            <div className="flex items-center space-x-2 text-muted-foreground/90">
              <TrendingDown className="w-4 h-4 text-emerald-500/80" />
              <span className="text-[10px] font-black tracking-widest uppercase opacity-60">日均开销</span>
            </div>
            <div className="flex items-baseline space-x-0.5 mt-2">
              <span className="text-base font-bold opacity-30 italic">¥</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-500/90 tracking-tighter truncate drop-shadow-sm">
                {summary.dailyCost.toFixed(1)}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="flex items-center justify-between px-2">
          <div className="relative flex items-center bg-white/5 dark:bg-black/20 p-1 rounded-2xl border border-white/10">
            <motion.div
              layoutId="sort-pill"
              className="absolute h-[calc(100%-8px)] bg-primary rounded-xl shadow-lg shadow-primary/20"
              initial={false}
              animate={{
                left: sortBy === 'date' ? '4px' : sortBy === 'value' ? '33.3%' : '66.6%',
                width: 'calc(33.3% - 4px)'
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
            {[
              { id: 'date', label: '时间', icon: Clock },
              { id: 'value', label: '总价', icon: Banknote },
              { id: 'cost', label: '均价', icon: TrendingDown },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleSortClick(s.id as any)}
                className={cn(
                  "relative z-10 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-black tracking-widest uppercase transition-colors sm:px-6",
                  sortBy === s.id ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <s.icon className="w-3 h-3 shrink-0" />
                <span className="hidden sm:inline">{s.label}</span>
                {sortBy === s.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-0.5"
                  >
                    {sortOrder === 'desc' ? (
                      <TrendingDown className="w-2.5 h-2.5 rotate-180" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                  </motion.div>
                )}
              </button>
            ))}
          </div>
          <ArrowUpDown className="w-4 h-4 text-muted-foreground/30" />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black tracking-tighter opacity-80 flex items-center gap-2">
              使用中 <span className="text-[10px] font-mono font-bold opacity-30">IN USE</span>
            </h2>
            <div className="h-[1px] flex-1 ml-4 bg-gradient-to-r from-border to-transparent opacity-20" />
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center px-2 opacity-40">
              <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
                已售出 <span className="text-[10px] font-mono font-bold opacity-50">SOLD</span>
              </h2>
              <div className="h-[1px] flex-1 ml-4 bg-gradient-to-r from-border to-transparent opacity-20" />
            </div>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        title={editingItem ? "编辑项目" : "新增记录"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1 opacity-60">物品名称</label>
            <input
              required
              type="text"
              placeholder="输入物品名称..."
              className="w-full bg-black/5 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-[1.4rem] p-4.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold transition-all placeholder:opacity-30"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1 opacity-60">入手价值 (¥)</label>
              <input
                required
                type="number"
                className="w-full bg-black/5 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-[1.4rem] p-4.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold transition-all"
                value={formData.price || ''}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1 opacity-60">购买日期</label>
              <CustomDatePicker
                value={formData.purchaseDate}
                onChange={(val: string) => setFormData({ ...formData, purchaseDate: val })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1 opacity-40">测算维度</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'daily', label: '每日消耗' },
                { id: 'per_use', label: '单次使用' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, costType: opt.id as any })}
                  className={cn(
                    "p-4 rounded-[1.6rem] border transition-all font-black text-xs tracking-tight",
                    formData.costType === opt.id
                      ? "bg-foreground border-foreground text-background shadow-lg scale-[1.02]"
                      : "bg-black/[0.03] dark:bg-white/5 border-transparent text-muted-foreground hover:bg-black/[0.06] dark:hover:bg-white/10"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1 opacity-40">物品状态</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'using', label: '使用中' },
                { id: 'sold', label: '已售出' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: opt.id as any })}
                  className={cn(
                    "p-4 rounded-[1.6rem] border transition-all font-black text-xs tracking-tight",
                    formData.status === opt.id
                      ? "bg-foreground border-foreground text-background shadow-lg scale-[1.02]"
                      : "bg-black/[0.03] dark:bg-white/5 border-transparent text-muted-foreground hover:bg-black/[0.06] dark:hover:bg-white/10"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col space-y-3">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1 opacity-40">类别图标</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                {['全部', '科技', '居家', '生活', '时尚', '运动', '自然'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={cn(
                      "text-[9px] px-5 py-2.5 rounded-full border transition-all shrink-0 font-black tracking-tighter uppercase",
                      formData.category === cat
                        ? "bg-foreground text-background border-transparent shadow-md scale-105"
                        : "bg-black/[0.03] dark:bg-white/5 border-transparent text-muted-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Grid with stable height lock */}
            <div className="w-full h-[165px] overflow-hidden liquid-glass rounded-[1.6rem] bg-black/[0.02] dark:bg-white/5 border border-white/10 relative">
              <div className="grid grid-cols-6 gap-2 content-start overflow-y-auto h-full p-3.5 custom-scrollbar scroll-smooth">
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
                        "text-xl p-1 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center aspect-square active:scale-90",
                        formData.icon === emoji ? "bg-foreground/10 ring-2 ring-foreground/40 scale-110" : "opacity-60 hover:opacity-100"
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
            className="w-full py-5 rounded-[1.8rem] font-black text-lg text-background bg-foreground shadow-2xl shadow-foreground/10 relative overflow-hidden group transition-all"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">{editingItem ? "确认修改" : "确认添加"}</span>
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
              className="relative w-full max-w-sm glass-modern p-8 rounded-[2.5rem] shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4 border border-destructive/10">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight">确认移除？</h3>
                <p className="text-muted-foreground/80 text-sm font-medium leading-relaxed px-4">
                  确定要删除此条记录吗？移除后数据库将无法恢复。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all border border-white/5 text-sm"
                >
                  放弃
                </button>
                <button
                  onClick={() => {
                    deleteItem(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="p-4 rounded-xl bg-destructive text-white font-bold shadow-lg shadow-destructive/20 active-pulse text-sm"
                >
                  立即移除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
            <span className="text-[10px] text-white font-black uppercase tracking-widest drop-shadow-md">
              {isPinned ? "取消置顶" : "置顶项目"}
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
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Trash2 className="text-white w-6 h-6 fill-white/10" />
            </div>
            <span className="text-[10px] text-white font-black uppercase tracking-widest drop-shadow-md">确认删除</span>
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
          "relative glass-modern p-6 h-full flex flex-col justify-between hover:bg-white/30 dark:hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer min-h-[160px] border-white/30 dark:border-white/5 rounded-[1.4rem]",
          isSold && "grayscale-[0.8] opacity-60",
          isPinned && "ring-2 ring-primary/20 bg-primary/5 shadow-lg shadow-primary/10"
        )}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center min-w-0">
            <div className="w-12 h-12 bg-white/40 dark:bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm border border-white/40 dark:border-white/10">
              <div className={cn(
                "absolute inset-0 bg-gradient-to-tr opacity-10 transition-opacity",
                gradient
              )} />
              <span className="text-2xl z-10 drop-shadow-sm">{item.icon || '📦'}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight truncate text-foreground/90 tracking-tight">{item.name}</h3>
                {isPinned && <Pin className="w-3 h-3 text-primary fill-primary opacity-60" />}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground/60 mt-0.5 flex items-center tracking-wide">
                入手 · <span className="text-foreground/70 font-bold ml-0.5">¥{item.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
          {isSold && (
            <div className="bg-black/5 text-[8px] px-2 py-1 rounded-md font-black tracking-widest uppercase border border-black/5 opacity-50">
              SOLD
            </div>
          )}
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="text-[10px] text-muted-foreground/60 font-bold bg-white/20 dark:bg-black/10 px-3 py-1.5 rounded-full border border-white/20 dark:border-white/5">
            {usageDetail}
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[8px] uppercase tracking-widest text-muted-foreground/40 font-black mb-0.5">
              感知价值
            </div>
            <div className={cn(
              "text-3xl font-black leading-none tracking-tighter",
              isSold ? "text-muted-foreground/40" : "text-primary dark:text-primary-foreground/80"
            )}>
              <span className="text-sm font-medium mr-0.5 opacity-40 italic">¥</span>
              {costValue.toFixed(1)}
              <span className="text-[10px] opacity-40 font-bold ml-0.5">/{item.costType === 'daily' ? 'd' : 'u'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

