# MyOwn

**真实物品成本追踪** — 记录你每件物品的真实使用成本，买得清楚，用得明白。

一款基于 Next.js + Capacitor 构建的移动端 web 应用，可打包为 Android APK。

## 功能

- 📦 **物品管理** — 添加、编辑、删除、置顶你的物品
- 💰 **成本计算** — 按天或按次均摊物品价格，感知真实花费
- 📊 **资产看板** — 总资产、日均成本、类别分布、高效能分析
- 📷 **OCR 识别** — 拍照扫描小票，自动填入物品名称和价格（支持 Gemini AI 增强）
- 🌙 **深色模式** — 支持系统主题跟随
- 👆 **手势交互** — 左滑置顶、右滑删除

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 + React 19 |
| 样式 | Tailwind CSS 4 |
| 动画 | Framer Motion |
| 图标 | Lucide React |
| 数据 | localStorage |
| 打包 | Capacitor 7 (Android) |

## 开始使用

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 打包 Android APK
npm run apk:build
```

## 设计原则

- 纯单色设计，靠排版建立视觉层级
- 克制动画，交互反馈清晰但不喧宾夺主
- 遵循 Apple HIG，注重手势交互和原生感
- 无障碍优先，支持 `prefers-reduced-motion`

## 项目结构

```
src/
├── app/              # Next.js App Router
│   ├── globals.css   # 设计系统
│   ├── layout.tsx    # 根布局
│   └── page.tsx      # 首页
├── components/       # 组件
│   ├── home/         # 首页子组件
│   ├── Background.tsx
│   ├── CustomDatePicker.tsx
│   ├── Drawer.tsx
│   ├── ItemCard.tsx
│   ├── SettingsDrawer.tsx
│   └── StatsDashboard.tsx
└── lib/              # 业务逻辑
    ├── hooks.ts      # 数据管理
    ├── types.ts      # 类型定义
    ├── gemini.ts     # AI 识别
    ├── ocr.ts        # OCR 引擎
    └── utils.ts      # 工具函数
```

## 版本

当前版本 **1.66.0** — 设计重构版
