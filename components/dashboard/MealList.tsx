'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Meal, MealType } from '@/lib/types';
import { MEAL_TYPE_LABELS } from '@/lib/types';

interface Props {
  meals: Meal[];
  date: string;
}

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const MEAL_STYLES: Record<MealType, { dot: string; badge: string; icon: string }> = {
  breakfast: { dot: 'bg-orange-400', badge: 'bg-orange-50 text-orange-600', icon: '🌅' },
  lunch:     { dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-600', icon: '☀️' },
  dinner:    { dot: 'bg-indigo-400', badge: 'bg-indigo-50 text-indigo-600', icon: '🌙' },
  snack:     { dot: 'bg-pink-400',   badge: 'bg-pink-50 text-pink-600',     icon: '🍪' },
};

export default function MealList({ meals: initialMeals, date }: Props) {
  const [meals, setMeals] = useState(initialMeals);
  const router = useRouter();

  async function handleDelete(id: number) {
    await fetch(`/api/meals/${id}`, { method: 'DELETE' });
    setMeals(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div className="space-y-3">
      {MEAL_ORDER.map(type => {
        const group = meals.filter(m => m.meal_type === type);
        const total = group.reduce((s, m) => s + m.calories, 0);
        const style = MEAL_STYLES[type];

        return (
          <div key={type} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-base">{style.icon}</span>
                <span className="font-semibold text-sm text-gray-800">{MEAL_TYPE_LABELS[type]}</span>
              </div>
              {total > 0 && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                  {total} kcal
                </span>
              )}
            </div>

            {group.length > 0 && <div className="border-t border-gray-50" />}

            <div>
              {group.map(meal => (
                <div key={meal.id} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <div className="flex items-start gap-3">
                    {meal.image_url && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <Image src={meal.image_url} alt={meal.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{meal.name}</p>
                      {(meal.protein_g > 0 || meal.fat_g > 0 || meal.carbs_g > 0) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          P {meal.protein_g}g · F {meal.fat_g}g · C {meal.carbs_g}g
                        </p>
                      )}
                      {meal.memo && <p className="text-xs text-gray-400 mt-0.5">{meal.memo}</p>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-700">{meal.calories}<span className="text-xs font-normal text-gray-400 ml-0.5">kcal</span></span>
                      <button onClick={() => router.push(`/meals/${meal.id}/edit`)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-blue-400 hover:bg-blue-50 transition-colors">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(meal.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Link href={`/meals/new?date=${date}&type=${type}`}
                className="flex items-center gap-2 px-4 py-3 text-green-600 hover:bg-green-50 text-sm font-medium transition-colors">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                追加する
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
