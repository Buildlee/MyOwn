---
description: 同步代码至 Android 原生目录
---
1. 执行 Web 打包
// turbo
run_command: npm run build

2. 同步资产至 Capacitor
// turbo
run_command: npx cap sync
3. 转化品牌图标至原生资源
// turbo
run_command: npm run assets:generate
