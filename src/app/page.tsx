'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wallet, TrendingDown, Tag, Calendar, Banknote, Trash2 } from 'lucide-react';
import { useItems } from '@/lib/hooks';
import { Drawer } from '@/components/Drawer';
import { Item, CostType } from '@/lib/types';
import { cn, getGradient } from '@/lib/utils';

export default function Home() {
  const { items, addItem, deleteItem, summary } = useItems();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
    name: '',
    price: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    usageCount: 1,
    costType: 'daily',
    category: '其他',
    icon: '📦'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(newItem);
    setIsDrawerOpen(false);
    // Reset
    setNewItem({
      name: '',
      price: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      usageCount: 1,
      costType: 'daily',
      category: '其他',
      icon: '📦'
    });
  };

  return (
    <main className="flex flex-col items-center pb-24 sm:pb-12 max-w-5xl mx-auto w-full">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-between items-center p-6 sticky top-0 z-20 glass rounded-b-3xl sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-none"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            MyOwn
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">理性消费，感知价值</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-muted-foreground hover:text-foreground active:scale-90 transition-all">
            <Tag className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="hidden sm:flex p-3 bg-primary rounded-full shadow-lg shadow-primary/30 active-pulse"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </motion.header>

      <div className="w-full px-6 pt-4 space-y-8">
        {/* Dashboard Summary */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full grid grid-cols-2 gap-3 sm:gap-4"
        >
          <div className="glass p-5 rounded-2xl flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Wallet className="w-3 h-3 sm:w-4 h-4" />
              <span className="text-[10px] sm:text-xs text-balance">持有总价值</span>
            </div>
            <div className="text-xl sm:text-3xl font-bold truncate">¥{summary.totalValue.toLocaleString()}<span className="text-sm sm:text-lg text-muted-foreground">.00</span></div>
          </div>

          <div className="glass p-5 rounded-2xl flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <TrendingDown className="w-3 h-3 sm:w-4 h-4" />
              <span className="text-[10px] sm:text-xs">日均消耗</span>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-emerald-400 truncate">¥{summary.dailyCost.toFixed(2)}</div>
          </div>
        </motion.section>

        {/* Item List Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-muted-foreground">我的物品</h2>
        </div>

        {/* Item List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => {
            const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / 86400000));
            const cost = item.costType === 'daily'
              ? `¥${(item.price / days).toFixed(1)}/天`
              : `¥${(item.price / Math.max(1, item.usageCount)).toFixed(1)}/次`;
            const usageText = item.costType === 'daily' ? `已使用 ${days} 天` : `已使用 ${item.usageCount} 次`;

            return (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.name}
                usage={usageText}
                cost={cost}
                icon={item.icon || '📦'}
                delay={idx * 0.05}
                onDelete={() => deleteItem(item.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile Addition FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsDrawerOpen(true)}
        className="sm:hidden fixed bottom-8 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center z-30 active-pulse"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Add Item Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="记录新物品"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" /> 物品名称
            </label>
            <input
              required
              type="text"
              placeholder="例如：MacBook Pro"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Banknote className="w-4 h-4" /> 价格 (¥)
              </label>
              <input
                required
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={newItem.price || ''}
                onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 购买日期
              </label>
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 [color-scheme:dark]"
                value={newItem.purchaseDate}
                onChange={e => setNewItem({ ...newItem, purchaseDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">计算方式</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNewItem({ ...newItem, costType: 'daily' })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-sm",
                  newItem.costType === 'daily' ? "bg-primary border-primary text-white" : "border-white/10 text-muted-foreground"
                )}
              >
                按天计算 (日均价)
              </button>
              <button
                type="button"
                onClick={() => setNewItem({ ...newItem, costType: 'per_use' })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-sm",
                  newItem.costType === 'per_use' ? "bg-primary border-primary text-white" : "border-white/10 text-muted-foreground"
                )}
              >
                按次计算 (次均价)
              </button>
            </div>
          </div>

          {newItem.costType === 'per_use' && (
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">已使用次数</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={newItem.usageCount}
                onChange={e => setNewItem({ ...newItem, usageCount: Number(e.target.value) })}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary p-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/40 active-pulse mt-4"
          >
            确认添加
          </button>
        </form>
      </Drawer>
    </main>
  );
}

function ItemCard({ id, title, usage, cost, icon, delay, onDelete }: any) {
  const [isDeleting, setIsDeleting] = useState(false);
  const gradient = getGradient(title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass p-4 rounded-2xl flex flex-row sm:flex-col items-center sm:items-stretch space-x-4 sm:space-x-0 group active:bg-white/5 transition-colors relative overflow-hidden"
    >
      <div className="w-16 h-16 sm:w-full sm:aspect-square bg-slate-800/50 rounded-xl sm:mb-4 flex items-center justify-center relative overflow-hidden shrink-0">
        <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} opacity-40 sm:opacity-20 sm:group-hover:opacity-100 transition-opacity`} />
        <span className="text-3xl sm:text-4xl z-10">{icon}</span>
      </div>
      <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
        <h3 className="font-semibold text-base sm:text-lg leading-tight truncate">{title}</h3>
        <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground truncate">{usage}</span>
          <span className="text-primary font-bold mt-0.5 sm:mt-0">{cost}</span>
        </div>
      </div>

      {/* Delete Trigger - subtle on mobile, hover on desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isDeleting) onDelete();
          else setIsDeleting(true);
        }}
        onMouseLeave={() => setIsDeleting(false)}
        className={cn(
          "absolute top-2 right-2 p-2 rounded-full transition-all z-20",
          isDeleting ? "bg-destructive text-white scale-110" : "bg-white/5 text-muted-foreground opacity-0 group-hover:opacity-100 sm:opacity-0"
        )}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isDeleting && (
        <div className="absolute inset-0 bg-destructive/10 backdrop-blur-[2px] pointer-events-none" />
      )}
    </motion.div>
  );
}
