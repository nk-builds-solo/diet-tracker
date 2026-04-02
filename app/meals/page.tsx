export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getMealsByDate } from '@/lib/meals';
import MealList from '@/components/dashboard/MealList';
import DateNav from '@/components/ui/DateNav';

interface Props {
  searchParams: { date?: string };
}

function todayStr() {
  return new Date().toLocaleDateString('sv-SE');
}

export default async function MealsPage({ searchParams }: Props) {
  const date = searchParams.date ?? todayStr();
  const meals = await getMealsByDate(date);
  const totalCal = meals.reduce((s, m) => s + m.calories, 0);

  return (
    <div className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">食事記録</h1>
        <Link href={`/meals/new?date=${date}`}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          + 追加
        </Link>
      </div>

      <DateNav date={date} basePath="/meals" />

      {totalCal > 0 && (
        <div className="bg-green-50 rounded-xl px-4 py-3 text-center">
          <span className="text-sm text-green-700">合計 <strong>{totalCal} kcal</strong></span>
        </div>
      )}

      <MealList meals={meals} date={date} />
    </div>
  );
}
