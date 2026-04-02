import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'ダイエットメモ',
  description: '食事・体重記録アプリ',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <div className="min-h-screen pb-20">
          <main className="max-w-lg mx-auto px-4">
            {children}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
