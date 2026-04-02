import Link from 'next/link';
import type { WeightLog } from '@/lib/types';

interface Props {
  logs: WeightLog[];
}

export default function WeightMiniCard({ logs }: Props) {
  const latest = logs[0];
  const prev = logs[1];
  const diff = latest && prev ? (latest.weight_kg - prev.weight_kg) : null;

  return (
    <Link href="/weight" className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h2 className="font-semibold text-gray-700">体重</h2>
        </div>
        <span className="text-xs text-gray-400 flex items-center gap-1">詳細 <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" clipRule="evenodd" /></svg></span>
      </div>
      {latest ? (
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-bold text-gray-900">{latest.weight_kg}</span>
          <span className="text-gray-400 mb-1 text-sm">kg</span>
          {diff !== null && (
            <span className={`text-sm mb-1 font-semibold px-2 py-0.5 rounded-full ${
              diff > 0 ? 'text-red-500 bg-red-50' :
              diff < 0 ? 'text-green-600 bg-green-50' :
              'text-gray-400 bg-gray-50'
            }`}>
              {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mt-3">未記録 — タップして記録</p>
      )}
      {latest && <p className="text-xs text-gray-400 mt-1">{latest.date}</p>}
    </Link>
  );
}
