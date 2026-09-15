# MyOwn

记录物品的购入价格、日期和使用次数，查看每件物品的日均或单次使用成本。

当前版本 **2.4.2**，Android `versionCode` 为 **8**。详细变更见 [更新日志](CHANGELOG.md)。

## 功能

- **总览**：使用中物品的购入总额、日均成本、常用物品和最近入手记录；切换 30 / 90 天预测，拖动查看具体日期的成本与降幅。
- **物品**：搜索、分类筛选、使用中 / 已售出切换；支持八种升降序排序，置顶优先可单独开启。
- **分析**：按购入金额查看分类占比、30 天成本预测和按天成本最低的物品。
- **管理**：新增、编辑、记录使用、置顶、标记售出和删除；右滑置顶，左滑删除，删除需要确认。
- **分类与图标**：分类按五组展示，图标随分类关联；自定义分类可记住默认图标。
- **外观与帮助**：浅色、深色、跟随系统；内置计算说明、更新日志和关于页面。
- **数据保护**：支持导出物品 JSON；读取到损坏数据时暂停保存，避免覆盖原记录。

日常记录和计算可离线使用，无需账号。点击关于页的 GitHub 链接会访问外部网站。当前版本不包含小票识别或云端同步。

## 成本与排序规则

| 项目 | 计算或排序方式 |
| --- | --- |
| 购入总价 | 一条物品记录的全部购入金额 |
| 购入单价 | 购入总价 ÷ 数量；数量默认 1，旧记录无需手动转换 |
| 日均成本 | 购入总价 ÷ 持有天数；购入当天按 1 天计算 |
| 单次成本 | 购入总价 ÷ 使用次数；零次显示“待记录” |
| 总览日均 | 仅合计使用中的按天均摊物品 |
| 成本预测 | 假设继续持有、不新增、不售出；不代表账单或实际省下的现金 |

八种排序维度为：购入日期、购入单价、购入总价、日均成本、单次成本、持有时长、使用次数和物品名称。日均成本只比较按天物品，单次成本和使用次数只比较按次物品；缺少单次成本的记录排在末尾。启用置顶优先后，在置顶组与普通组内分别排序。

已售出物品不计入总览；目前不记录售出日期和售价，因此详情里的成本仅供参考。

## 数据保存与备份

物品存储在当前浏览器或应用 WebView 的 `localStorage` 中。主题、排序和自定义分类图标使用独立偏好项保存。浏览器版与 APK 的数据不会自动互通。

在设置中选择“导出物品备份”可导出物品 JSON。当前没有内置导入入口，导出内容不包含主题、排序及独立的分类图标偏好。卸载或清除应用数据前，请确认备份文件已经保存。

## 本地开发

使用 Node.js 20.9 或更新版本、npm。以下命令以 Windows PowerShell 为例：

```powershell
npm ci
npm run dev
```

开发服务默认在 `http://localhost:3000`。生产构建：

```powershell
npm run build
```

项目使用 Next.js 静态导出，输出到 `out/`；构建脚本明确使用 webpack。无需配置 API 密钥。

## Android 打包

准备 JDK 21、Android SDK（Platform 35，及 Android Gradle Plugin 所需构建工具）。项目提供 Gradle 8.11.1 Wrapper，首次使用需要下载 Gradle 和依赖。

1. 配置 `JAVA_HOME` 指向 JDK 21。
2. 设置 `ANDROID_HOME`，或在 `android/local.properties` 填写本机 `sdk.dir`。该文件不提交到 Git。
3. 在项目根目录执行：

```powershell
npm run apk:build
```

该脚本依次构建网页、同步 Capacitor Android 资源并运行 `assembleDebug`。也可分步执行：

```powershell
npm run build
npx cap sync android
Set-Location android
.\gradlew.bat assembleDebug
```

输出：`android/app/build/outputs/apk/debug/app-debug.apk`。支持 Android 6.0（API 23）及以上，目标 API 为 35。

调试 APK 使用构建机器的调试签名。覆盖安装需要包名和签名都一致；换机器打包不保证能覆盖已安装版本。仓库不包含 APK、依赖目录、签名密钥和本机 SDK 配置，应用图标、启动图与 Gradle Wrapper 属于必要构建资源，会保留。

## 验证

```powershell
node scripts/test-domain.cjs
npx tsc --noEmit
npm run lint
npm run build
```

浏览器回归使用 Python、Playwright 和 Windows 上已安装的 Microsoft Edge：

```powershell
python -m pip install playwright
python -m http.server 8877 --bind 127.0.0.1 --directory out
```

保持服务器运行，在另一终端执行：

```powershell
python scripts/verify-app.py
python scripts/verify-v240.py
python scripts/verify-touch-motion.py
```

可用 `MYOWN_TEST_URL` 指定测试地址，用 `MYOWN_TEST_OUTPUT` 指定截图和结果目录；默认结果保存在 `work/verification/`，已排除提交。测试使用独立浏览器会话和示例数据。

2.4.2 已通过领域测试、类型检查、代码检查、静态构建、浏览器交互回归和 13 个触屏模拟切换场景。已构建并验证调试 APK 的版本和签名，但尚未完成实机安装、WebView 帧率及设备下载行为验证。

## 项目结构

| 位置 | 内容 |
| --- | --- |
| `src/components/apple/MyOwn.tsx` | 总览、物品、分析、详情与设置 |
| `src/components/apple/Editor.tsx` | 新增、编辑和数量输入 |
| `src/components/apple/CategoryPicker.tsx` | 分类分组与自定义入口 |
| `src/components/apple/Trend.tsx` | 可交互成本预测 |
| `src/components/apple/controls.tsx` | 弹层、分段控件、选择器和日历 |
| `src/components/apple/Information.tsx` | 应用内更新日志和关于页面 |
| `src/components/apple/design-data.json` | SVG 图标与分类映射 |
| `src/lib/domain.ts` | 成本计算、排序、兼容读取与校验 |
| `src/lib/apple-items.ts` | 物品保存与异常数据保护 |
| `src/app/globals.css` | 配色、布局和动效 |
| `android/` | Capacitor Android 工程 |
| `scripts/` | 业务与浏览器验证脚本 |

技术栈为 Next.js 16.1.1、React 19、Capacitor 7、next-themes；界面使用 CSS 和内联 SVG，不依赖第三方 UI 或动画库。支持系统减少动态效果偏好，切换时保持整页不透明。

## 已知限制

- 数据仅保存在当前设备，没有账号同步或备份导入。
- 已售出记录尚无售价与售出日期，不能计算最终净成本。
- 浅色主按钮的白字对比度仍有改进空间，见更新日志中的 2.3.0 说明。
- 触屏模拟通过不等于所有 Android 设备上的动画帧率和交互手感均已验证。

项目地址：[Buildlee/MyOwn](https://github.com/Buildlee/MyOwn)。
