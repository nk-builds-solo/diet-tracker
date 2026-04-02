'use client';
import { useState } from 'react';
import type { Meal } from '@/lib/types';
import { MEAL_TYPE_LABELS } from '@/lib/types';

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
    lunch: meals.filter(m => m.meal_type === 'lunch').reduce((s, m) => s + m.calories, 0),
    dinner: meals.filter(m => m.meal_type === 'dinner').reduce((s, m) => s + m.calories, 0),
    snack: meals.filter(m => m.meal_type === 'snack').reduce((s, m) => s + m.calories, 0),
  };

  async function saveTarget() {
    const v = parseInt(inputVal, 10);
    if (!isNaN(v) && v > 0) {
      setTarget(v);
      await fetch('/api/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'target_calories', value: String(v) }),
      });
    }
    setEditing(false);
  }

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg shadow-green-200 p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-green-100">今日のカロリー</h2>
        {editing ? (
          <div className="flex items-center gap-2">
            <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
              className="border border-white/30 bg-white/20 rounded-lg px-2 py-1 w-20 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white" />
            <button onClick={saveTarget} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg font-medium">保存</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-xs text-green-100 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
            目標: {target.toLocaleString()} kcal
          </button>
        )}
      </div>

      <div className="flex items-center justify-center mb-5">
        <div className="[&_circle]:stroke-white/20 [&_.percent-badge]:hidden">
          <CalorieRingWhite consumed={consumed} target={target} />
        </div>
      </div>

      <div className="space-y-2 bg-white/10 rounded-2xl p-4">
        {(Object.entries(byType) as [string, number][]).map(([type, cal]) => (
          <div key={type} className="flex items-center gap-3">
            <span className="text-xs text-green-100 w-10 flex-shrink-0">{MEAL_TYPE_LABELS[type as keyof typeof MEAL_TYPE_LABELS]}</span>
            <div className="flex-1 bg-white/20 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-white"
                style={{ width: `${Math.min((cal / target) * 100, 100)}%`, transition: 'width 0.5s ease' }}
              />
            </div>
            <span className="text-xs text-green-100 w-16 text-right flex-shrink-0">{cal > 0 ? `${cal} kcal` : '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalorieRingWhite({ consumed, target }: { consumed: number; target: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(consumed / target, 1);
  const offset = circumference * (1 - ratio);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 148, height: 148 }}>
        <svg width="148" height="148" viewBox="0 0 148 148" className="rotate-[-90deg]">
          <circle cx="74" cy="74" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
          <circle cx="74" cy="74" r={radius} fill="none" stroke="white" strokeWidth="12"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-white leading-none">{consumed.toLocaleString()}</div>
          <div className="text-xs text-green-100 mt-1">/ {target.toLocaleString()} kcal</div>
          <div className="mt-1.5 text-xs font-bold text-white/80">{Math.round(ratio * 100)}%</div>
        </div>
      </div>
      <p className="text-sm text-green-100 mt-2">
        残り <span className="font-bold text-white">{Math.max(0, target - consumed).toLocaleString()} kcal</span>
      </p>
    </div>
  );
}
