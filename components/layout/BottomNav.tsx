'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'ホーム', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
    </svg>
  )},
  { href: '/meals', label: '食事', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M7 7c0 2.5 2 4 5 4s5-1.5 5-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 3v4" />
    </svg>
  )},
  { href: '/weight', label: '体重', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a4 4 0 018 0v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v3M10.5 13.5l1.5-1.5 1.5 1.5" />
    </svg>
  )},
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                active ? 'text-green-600' : 'text-gray-400'
              }`}>
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
