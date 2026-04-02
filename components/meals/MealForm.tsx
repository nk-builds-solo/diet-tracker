'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MealType } from '@/lib/types';
import { MEAL_TYPE_LABELS } from '@/lib/types';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

interface Props {
  date: string;
  defaultType?: MealType;
}

export default function MealForm({ date, defaultType = 'breakfast' }: Props) {
  const router = useRouter();
  const [mealType, setMealType] = useState<MealType>(defaultType);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !calories) return;
    setLoading(true);
    await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, meal_type: mealType, name: name.trim(), calories: Number(calories), memo }),
    });
    router.push('/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">食事タイプ</label>
        <div className="flex gap-2 flex-wrap">
          {MEAL_TYPES.map(t => (
            <button type="button" key={t}
              onClick={() => setMealType(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                mealType === t ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {MEAL_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">食品名</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="例: ご飯 茶碗1杯"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">カロリー (kcal)</label>
        <input
          type="number"
          value={calories}
          onChange={e => setCalories(e.target.value)}
          placeholder="例: 252"
          inputMode="decimal"
          required
          min={0}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メモ（任意）</label>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim() || !calories}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {loading ? '保存中...' : '保存する'}
      </button>
    </form>
  );
}
