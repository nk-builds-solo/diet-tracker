'use client';
import { useState } from 'react';
import CalorieRing from '@/components/ui/CalorieRing';
import type { Meal } from '@/lib/types';
import { MEAL_TYPE_LABELS, MEAL_TYPE_COLORS } from '@/lib/types';

interface Props {
  meals: Meal[];
  target: number;
}

export default function TodaySummaryCard({ meals, target: initialTarget }: Props) {
  const [target, setTarget] = useState(initialTarget);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(initialTarget));

  const consumed = meals.reduce((s, m) => s + m.calories, 0);

  const byType = {
    breakfast: meals.filter(m => m.meal_type === 'breakfast').reduce((s, m) => s + m.calories, 0),
    lunch:     meals.filter(m => m.meal_type === 'lunch').reduce((s, m) => s + m.calories, 0),
    dinner:    meals.filter(m => m.meal_type === 'dinner').reduce((s, m) => s + m.calories, 0),
    snack:     meals.filter(m => m.meal_type === 'snack').reduce((s, m) => s + m.calories, 0),
  };

  async function saveTarget() {
    const v = parseInt(inputVal, 10);
    if (!isNaN(v) && v > 0) {
      setTarget(v);
      await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'target_calories', value: String(v) }) });
    }
    setEditing(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-700">今日のカロリー</h2>
        {editing ? (
          <div className="flex items-center gap-1">
            <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
              className="border rounded px-2 py-0.5 w-24 text-sm" />
            <button onClick={saveTarget} className="text-xs text-green-600 font-medium">保存</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-gray-600">目標を変更</button>
        )}
      </div>

      <div className="flex justify-center">
        <CalorieRing consumed={consumed} target={target} />
      </div>

      <div className="mt-4 space-y-2">
        {(Object.entries(byType) as [keyof typeof byType, number][]).map(([type, cal]) => (
          <div key={type} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-10">{MEAL_TYPE_LABELS[type]}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${MEAL_TYPE_COLORS[type]}`}
                style={{ width: `${Math.min((cal / target) * 100, 100)}%`, transition: 'width 0.4s ease' }}
              />
            </div>
            <span className="text-xs text-gray-600 w-16 text-right">{cal} kcal</span>
          </div>
        ))}
      </div>
    </div>
  );
}
