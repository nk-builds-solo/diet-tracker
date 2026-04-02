export const dynamic = 'force-dynamic';

import { getMealsByDate, getDailySummaries } from '@/lib/meals';
import { getWeightLogs, getSettings } from '@/lib/weight';
import TodaySummaryCard from '@/components/dashboard/TodaySummaryCard';
import MealList from '@/components/dashboard/MealList';
import WeightMiniCard from '@/components/dashboard/WeightMiniCard';
import NutritionSummary from '@/components/dashboard/NutritionSummary';
import CalorieChart from '@/components/dashboard/CalorieChart';

function todayStr() {
  return new Date().toLocaleDateString('sv-SE');
}

export default async function DashboardPage() {
  const today = todayStr();
  const [meals, weightLogs, settings, summaries] = await Promise.all([
    getMealsByDate(today),
    getWeightLogs(7),
    getSettings(),
    getDailySummaries(14),
  ]);

  const dateLabel = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">ダイエットメモ</h1>
        <span className="text-sm text-gray-500">{dateLabel}</span>
      </div>

      <TodaySummaryCard meals={meals} target={settings.target_calories} />
      <NutritionSummary meals={meals} />

      {summaries.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3">カロリー推移（14日）</h2>
          <CalorieChart summaries={summaries} target={settings.target_calories} />
        </div>
      )}

      <MealList meals={meals} date={today} />
      <WeightMiniCard logs={weightLogs} />
    </div>
  );
}
