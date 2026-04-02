import Link from 'next/link';

export default function MealsPage() {
  return (
    <div className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">食事記録</h1>
        <Link href="/meals/new"
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          + 追加
        </Link>
      </div>
      <p className="text-sm text-gray-500 text-center py-8">
        ホーム画面の各食事タイプから追加できます
      </p>
    </div>
  );
}
