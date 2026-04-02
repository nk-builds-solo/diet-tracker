'use client';
import { useRouter } from 'next/navigation';

interface Props {
  date: string;
  basePath: string;
}

export default function DateNav({ date, basePath }: Props) {
  const router = useRouter();
  const today = new Date().toLocaleDateString('sv-SE');

  function shift(days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    router.push(`${basePath}?date=${d.toLocaleDateString('sv-SE')}`);
  }

  const label = new Date(date).toLocaleDateString('ja-JP', {
    month: 'long', day: 'numeric', weekday: 'short',
  });

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-4 py-2.5">
      <button onClick={() => shift(-1)} className="text-gray-400 hover:text-gray-700 p-1">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {date !== today && (
          <button onClick={() => router.push(`${basePath}?date=${today}`)}
            className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">今日</button>
        )}
      </div>
      <button onClick={() => shift(1)} disabled={date >= today}
        className="text-gray-400 hover:text-gray-700 disabled:opacity-30 p-1">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
