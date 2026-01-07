# MyOwn - 理性消费与价值感知

> 每一件物品都有其真实成本。MyOwn 帮助你从感性消费转向理性决策。

MyOwn 是一款轻量级的现代 Web 应用，旨在追踪物品的 **日均使用成本** 或 **次均使用成本**。通过直观的视觉反馈和优雅的交互体验，让你清晰感知每一笔投入的实际价值。

![MyOwn Preview](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png) *(占位符：此处可替换为项目实际截图)*

---

## ✨ 核心特性

- **💰 真实成本计算**
  - **日均成本**：基于购买天数自动折算，感知长期支出的微观消耗。
  - **次均成本**：按实际使用频率更新，让每一件昂贵器材的"性价比"清晰可见。
- **📱 移动端优先设计**
  - 响应式毛玻璃（Glassmorphism）布局。
  - 针对手机端优化的抽屉式交互（Drawer）与悬浮按钮。
- **🌈 AI 智能配色**
  - 根据物品名称自动生成和谐的渐变色背景，让每张卡片都独一无二。
- **⚡ 优雅动效**
  - 基于 Framer Motion 的顺滑过渡与触觉反馈（Active Scale）。
- **💾 数据持久化**
  - 使用 LocalStorage 存储，无需登录，数据即开即用（后续计划支持 IndexedDB）。

## 🛠️ 技术栈

- **框架**: [Next.js 15 (App Router)](https://nextjs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/)
- **工具**: [clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)

## 🚀 快速开始

### 1. 环境准备
确保你的环境中安装了 [Node.js](https://nodejs.org/) (推荐 v18+)。

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

## 📍 开发计划 (Roadmap)

- [x] 核心成本计算逻辑
- [x] 响应式移动端 UI
- [ ] 3D 图标库集成 (6000+ 资源)
- [ ] 物品详情页与折旧曲线图
- [ ] 分类管理与标签筛选
- [ ] 多货币支持与汇率换算
- [ ] PWA 支持 (可安装到桌面/手机)

## 📄 许可证

基于 MIT License 开源。

---

**MyOwn** - *让每一分钱都花在刀刃上。*
