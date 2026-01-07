import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

import { ThemeProvider } from '@/components/ThemeProvider';
import { Background } from '@/components/Background';

// const inter = Inter({ subsets: ['latin'] });
const inter_className = ""; // Fallback to default sans-serif

export const metadata: Metadata = {
  title: 'MyOwn - 真实物品成本',
  description: '追踪你物品的真实使用成本',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn(inter_className, "antialiased min-h-screen bg-background text-foreground selection:bg-primary/20 transition-colors duration-300")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
