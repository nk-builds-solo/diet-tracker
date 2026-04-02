import Link from 'next/link';
import WeightForm from '@/components/weight/WeightForm';

function todayStr() {
  return new Date().toLocaleDateString('sv-SE');
}

export default function NewWeightPage() {
  const today = todayStr();

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/weight" className="text-gray-400 hover:text-gray-600">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-gray-900">体重を記録</h1>
      </div>
      <WeightForm date={today} />
    </div>
  );
}
