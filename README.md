# MyOwn

**真实物品成本追踪** — 记录每件物品的真实使用成本，买得清楚，用得明白。

基于 Next.js + Capacitor 的移动端应用，可打包为 Android APK。数据全部保存在本机，不联网。

## 功能

- **成本计算** — 按天均摊（价格 ÷ 持有天数）或按次使用（价格 ÷ 使用次数），零次使用时显示「待记录」，不显示虚假单价
- **三个视图** — 总览（日均成本 + 30 天预测 + 洞察）、物品（搜索 / 分类筛选 / 三种排序）、分析（价值分布 + 高效能与高消耗排行）
- **物品管理** — 添加、编辑、置顶、标记售出、删除（带确认）
- **关联图标** — 切换分类时自动换成该分类下的图标，选择器带搜索与键盘导航
- **外观** — 浅色 / 深色 / 跟随系统
- **导出备份** — 一键导出 JSON
- **数据保护** — 检测到本地数据损坏时暂停保存并禁用新增入口，避免覆盖

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 + React 19 |
| 样式 | Tailwind CSS 4 |
| 主题 | next-themes |
| 数据 | localStorage |
| 打包 | Capacitor 7 (Android) |

图标为内联 SVG（`components/apple/design-data.json`），弹层为原生 `<dialog>`，无第三方 UI / 动画 / 图标库。

## 开发

```bash
npm install
npm run dev          # 开发模式
npm run build        # 静态导出到 out/
npm run apk:build    # 构建 + 同步 + 打包 Android APK
```

> 构建使用 `next build --webpack`。若项目位于 git worktree，`node_modules` 常为符号链接，Turbopack 无法加载，必须走 webpack。

## 项目结构

```
src/
├── app/
│   ├── globals.css                 # 设计系统（两级背景色、圆角、动效曲线）
│   ├── layout.tsx                  # 根布局
│   └── page.tsx                    # 入口，仅渲染 MyOwn
├── components/
│   ├── apple/
│   │   ├── MyOwn.tsx               # 主界面：三个视图 + 详情 + 设置
│   │   ├── Editor.tsx              # 新增 / 编辑表单
│   │   ├── controls.tsx            # Modal / 选择器 / 日历 / 分段控件 / 图标
│   │   └── design-data.json        # 图标库 + 分类 + 标签
│   └── ThemeProvider.tsx
└── lib/
    ├── domain.ts                   # 纯业务逻辑：持有天数、均摊成本、校验、数据读取校验
    ├── apple-items.ts              # 数据 hook（含损坏数据保护）
    └── types.ts                    # 类型定义
```

## 设计原则

- 层次来自**两级背景色**（页面底 / 卡片），不靠加边框
- 橙色只用于重点数据与可交互元素
- 动效只走 `transform` / `opacity`，支持 `prefers-reduced-motion`
- 正文对比度 ≥ 4.5:1，触控目标 ≥ 44px

## 版本

当前 **2.1.0**
