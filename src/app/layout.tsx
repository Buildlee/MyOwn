import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
export const metadata: Metadata = { title: 'MyOwn · 物品成本', description: '追踪每件物品的真实使用成本' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>){return <html lang="zh-CN" suppressHydrationWarning><body><ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider></body></html>;}
