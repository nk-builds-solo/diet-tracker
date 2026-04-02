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
    <Link href="/weight" className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-700">体重</h2>
        <span className="text-xs text-gray-400">詳細 →</span>
      </div>
      {latest ? (
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900">{latest.weight_kg}</span>
          <span className="text-gray-500 mb-1">kg</span>
          {diff !== null && (
            <span className={`text-sm mb-1 font-medium ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-500' : 'text-gray-400'}`}>
              {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mt-3">未記録</p>
      )}
      <p className="text-xs text-gray-400 mt-1">{latest?.date ?? ''}</p>
    </Link>
  );
}
