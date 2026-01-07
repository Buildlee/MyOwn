'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wallet, TrendingDown, Tag, Calendar, Banknote, Trash2, Settings } from 'lucide-react';
import { useItems } from '@/lib/hooks';
import { Drawer } from '@/components/Drawer';
import { SettingsDrawer } from '@/components/SettingsDrawer';
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
  const { items, addItem, updateItem, deleteItem, summary } = useItems();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    name: '',
    price: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    usageCount: 1,
    costType: 'daily',
    status: 'using',
    category: '其他',
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
      category: '其他',
      icon: '📦'
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      purchaseDate: item.purchaseDate.split('T')[0],
      usageCount: item.usageCount,
      costType: item.costType,
      status: item.status,
      category: item.category,
      icon: item.icon
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
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground active:scale-90 transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="hidden sm:flex p-3 bg-foreground text-background rounded-full shadow-xl shadow-foreground/20 active-pulse"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

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
          <h2 className="text-lg font-semibold text-muted-foreground">持有中</h2>
        </div>

        {/* Using Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.filter(i => i.status === 'using').map((item, idx) => {
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
                price={item.price}
                icon={item.icon || '📦'}
                status={item.status}
                delay={idx * 0.05}
                onClick={() => handleOpenEdit(item)}
                onDelete={() => deleteItem(item.id)}
              />
            );
          })}
        </div>

        {/* Sold Items Header */}
        {items.some(i => i.status === 'sold') && (
          <>
            <div className="flex justify-between items-center pt-8 border-t border-white/5">
              <h2 className="text-lg font-semibold text-muted-foreground opacity-60">已售出 / 历史</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
              {items.filter(i => i.status === 'sold').map((item, idx) => {
                const days = Math.max(1, Math.floor((Date.now() - new Date(item.purchaseDate).getTime()) / 86400000));
                const cost = item.costType === 'daily'
                  ? `¥${(item.price / days).toFixed(1)}/天`
                  : `¥${(item.price / Math.max(1, item.usageCount)).toFixed(1)}/次`;
                const usageText = item.costType === 'daily' ? `共使用 ${days} 天` : `共使用 ${item.usageCount} 次`;

                return (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    title={item.name}
                    usage={usageText}
                    cost={cost}
                    price={item.price}
                    icon={item.icon || '📦'}
                    status={item.status}
                    delay={idx * 0.05}
                    onClick={() => handleOpenEdit(item)}
                    onDelete={() => deleteItem(item.id)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Mobile Addition FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpenAdd}
        className="sm:hidden fixed bottom-8 right-6 w-14 h-14 bg-foreground text-background rounded-full shadow-2xl shadow-foreground/30 flex items-center justify-center z-30 active-pulse"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Add/Edit Item Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? "编辑物品信息" : "记录新物品"}
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
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.price || ''}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 购买日期
              </label>
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 [color-scheme:dark]"
                value={formData.purchaseDate}
                onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">计算方式</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, costType: 'daily' })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-sm",
                  formData.costType === 'daily' ? "bg-primary border-primary text-white" : "border-white/10 text-muted-foreground"
                )}
              >
                按天计算 (日均价)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, costType: 'per_use' })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-sm",
                  formData.costType === 'per_use' ? "bg-primary border-primary text-white" : "border-white/10 text-muted-foreground"
                )}
              >
                按次计算 (次均价)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">物品状态</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'using' })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-sm",
                  formData.status === 'using' ? "bg-primary border-primary text-white" : "border-white/10 text-muted-foreground"
                )}
              >
                使用中
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'sold' })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-sm",
                  formData.status === 'sold' ? "bg-destructive border-destructive text-white" : "border-white/10 text-muted-foreground"
                )}
              >
                已售出
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-muted-foreground">选择图标</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 max-w-[200px] sm:max-w-none">
                {['全部', '科技', '居家', '生活', '时尚', '运动', '自然'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-full border transition-all shrink-0",
                      formData.category === cat ? "bg-primary/20 border-primary/50 text-primary" : "border-white/5 text-muted-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 glass rounded-xl custom-scrollbar border border-white/5">
              {(formData.category === '全部' ?
                Object.values(iconCategories).flat() :
                (iconCategories[formData.category as keyof typeof iconCategories] || [])
              ).map((emoji: string) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className={cn(
                    "text-2xl p-2 rounded-lg transition-all hover:bg-white/10 flex items-center justify-center aspect-square",
                    formData.icon === emoji ? "bg-primary/20 ring-1 ring-primary" : ""
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary p-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/40 active-pulse mt-4"
          >
            {editingItem ? "确认修改" : "确认添加"}
          </button>
        </form>
      </Drawer>
    </main>
  );
}

function ItemCard({ id, title, usage, cost, price, icon, status, delay, onClick, onDelete }: any) {
  const [isDeleting, setIsDeleting] = useState(false);
  const gradient = getGradient(title);
  const isSold = status === 'sold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onClick={onClick}
      className={cn(
        "glass p-5 rounded-2xl flex flex-col justify-between group hover:bg-white/10 active:scale-[0.98] transition-all relative overflow-hidden cursor-pointer min-h-[160px]",
        isSold && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center min-w-0">
          <div className="w-12 h-12 bg-white/10 dark:bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 border border-white/5 shadow-inner">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-tr opacity-20 transition-opacity",
              gradient
            )} />
            <span className="text-2xl z-10">{icon}</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg leading-tight truncate text-foreground/90">{title}</h3>
            <div className="text-xs text-muted-foreground mt-0.5">
              价值 <span className="font-medium">¥{price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 opacity-70">
          感知价值
        </div>
        <div className="text-2xl sm:text-3xl font-black text-primary drop-shadow-sm leading-none tracking-tight">
          {cost}
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
          {usage}
        </div>
      </div>

      {isSold && (
        <div className="absolute top-2 left-2 bg-destructive text-[10px] text-white px-2 py-0.5 rounded-full font-bold z-20 shadow-sm">
          已售出
        </div>
      )}

      {/* Delete Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isDeleting) onDelete();
          else setIsDeleting(true);
        }}
        onMouseLeave={() => setIsDeleting(false)}
        className={cn(
          "absolute top-2 right-2 p-2 rounded-full transition-all z-20",
          isDeleting ? "bg-destructive text-white scale-110" : "bg-white/5 text-muted-foreground opacity-0 group-hover:opacity-100"
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
