'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  date: string;
}

export default function WeightForm({ date }: Props) {
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!weight) return;
    setLoading(true);
    await fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, weight_kg: Number(weight) }),
    });
    router.push('/weight');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="例: 65.5"
          inputMode="decimal"
          step="0.1"
          required
          min={1}
          max={500}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <p className="text-xs text-gray-400">記録日: {date}</p>
      <button
        type="submit"
        disabled={loading || !weight}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {loading ? '保存中...' : '保存する'}
      </button>
    </form>
  );
}
