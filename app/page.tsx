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
    month: 'long', day: 'numeric', weekday: 'short',
  });

  return (
    <div className="space-y-4 py-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-gray-400 font-medium">{dateLabel}</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">ダイエットメモ</h1>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-md shadow-green-200">
          <span className="text-white text-lg">🥗</span>
        </div>
      </div>

      <TodaySummaryCard meals={meals} target={settings.target_calories} />
      <NutritionSummary meals={meals} />

      {summaries.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-green-400 rounded-full inline-block" />
            カロリー推移（14日）
          </h2>
          <CalorieChart summaries={summaries} target={settings.target_calories} />
        </div>
      )}

      <div>
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-orange-400 rounded-full inline-block" />
          今日の食事
        </h2>
        <MealList meals={meals} date={today} />
      </div>

      <WeightMiniCard logs={weightLogs} />
    </div>
  );
}
