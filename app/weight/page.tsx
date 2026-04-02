import Link from 'next/link';
import { getWeightLogs, getSettings } from '@/lib/weight';
import WeightChart from '@/components/weight/WeightChart';
import WeightHistory from '@/components/weight/WeightHistory';

export default async function WeightPage() {
  const [logs, settings] = await Promise.all([
    getWeightLogs(30),
    getSettings(),
  ]);

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">体重記録</h1>
        <Link href="/weight/new"
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          + 記録
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="text-sm font-medium text-gray-600 mb-3">推移グラフ（30日）</h2>
        <WeightChart logs={logs} targetWeight={settings.target_weight_kg} />
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-600 mb-2">記録一覧</h2>
        <WeightHistory logs={logs} />
      </div>
    </div>
  );
}
