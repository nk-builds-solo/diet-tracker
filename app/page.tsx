import { getMealsByDate } from '@/lib/meals';
import { getWeightLogs, getSettings } from '@/lib/weight';
import TodaySummaryCard from '@/components/dashboard/TodaySummaryCard';
import MealList from '@/components/dashboard/MealList';
import WeightMiniCard from '@/components/dashboard/WeightMiniCard';

function todayStr() {
  return new Date().toLocaleDateString('sv-SE');
}

export default function DashboardPage() {
  const today = todayStr();
  const meals = getMealsByDate(today);
  const weightLogs = getWeightLogs(7);
  const settings = getSettings();

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
      <MealList meals={meals} date={today} />
      <WeightMiniCard logs={weightLogs} />
    </div>
  );
}
