# 同步 Web 修改到原生 Android 目录

当你修改了 `src` 下的 Next.js 代码后，需要遵循以下步骤将这些更改同步到 `android` 文件夹，以便导出 APK。

### 1. 构建 Web 静态资源
首先，你需要将 React 代码编译成原生应用能识别的 HTML/JS/CSS 文件：
```bash
npm run build
```
这会更新根目录下的 `out` 文件夹。

### 2. 同步到 Capacitor
运行以下命令，将 `out` 目录的内容同步到 `android` 工程的资产目录中：
```bash
npx cap sync
```

### 3. 在 Android Studio 中打包
同步完成后，你可以在 Android Studio 中直接：
- 点击 **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**。
- 或者点击 **Run** 按钮直接在真机/模拟器上预览。

---
**提示：** 你也可以直接使用我之前配置的复合命令（如果环境支持）：
```bash
npm run apk:build
```
这个命令会自动执行上述所有步骤。
