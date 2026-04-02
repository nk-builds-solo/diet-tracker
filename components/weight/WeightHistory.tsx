'use client';
import { useState } from 'react';
import type { WeightLog } from '@/lib/types';

interface Props {
  logs: WeightLog[];
}

export default function WeightHistory({ logs: initialLogs }: Props) {
  const [logs, setLogs] = useState(initialLogs);

  async function handleDelete(id: number) {
    await fetch(`/api/weight/${id}`, { method: 'DELETE' });
    setLogs(prev => prev.filter(l => l.id !== id));
  }

  if (logs.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">まだ記録がありません</p>;
  }

  return (
    <div className="space-y-2">
      {logs.map(log => (
        <div key={log.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
          <span className="text-sm text-gray-500">{log.date}</span>
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-gray-800">{log.weight_kg} kg</span>
            <button onClick={() => handleDelete(log.id)}
              className="text-gray-300 hover:text-red-400 transition-colors">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
