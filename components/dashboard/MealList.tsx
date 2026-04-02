'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Meal, MealType } from '@/lib/types';
import { MEAL_TYPE_LABELS, MEAL_TYPE_COLORS } from '@/lib/types';

interface Props {
  meals: Meal[];
  date: string;
}

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function MealList({ meals: initialMeals, date }: Props) {
  const [meals, setMeals] = useState(initialMeals);

  async function handleDelete(id: number) {
    await fetch(`/api/meals/${id}`, { method: 'DELETE' });
    setMeals(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div className="space-y-3">
      {MEAL_ORDER.map(type => {
        const group = meals.filter(m => m.meal_type === type);
        const total = group.reduce((s, m) => s + m.calories, 0);
        return (
          <div key={type} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${MEAL_TYPE_COLORS[type]}`} />
                <span className="font-medium text-sm text-gray-700">{MEAL_TYPE_LABELS[type]}</span>
              </div>
              <span className="text-xs text-gray-500">{total > 0 ? `${total} kcal` : ''}</span>
            </div>
            <div>
              {group.length === 0 ? (
                <p className="text-xs text-gray-400 px-4 py-3">未記録</p>
              ) : (
                group.map(meal => (
                  <div key={meal.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
                    <div>
                      <p className="text-sm text-gray-800">{meal.name}</p>
                      {meal.memo && <p className="text-xs text-gray-400">{meal.memo}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">{meal.calories} kcal</span>
                      <button onClick={() => handleDelete(meal.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
              <Link href={`/meals/new?date=${date}&type=${type}`}
                className="flex items-center gap-1 px-4 py-2.5 text-green-600 hover:bg-green-50 text-sm font-medium transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                追加
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
