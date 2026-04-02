import type { Meal } from '@/lib/types';

interface Props {
  meals: Meal[];
}

export default function NutritionSummary({ meals }: Props) {
  const protein = meals.reduce((s, m) => s + m.protein_g, 0);
  const fat = meals.reduce((s, m) => s + m.fat_g, 0);
  const carbs = meals.reduce((s, m) => s + m.carbs_g, 0);

  if (protein === 0 && fat === 0 && carbs === 0) return null;

  const total = protein * 4 + fat * 9 + carbs * 4;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="font-semibold text-gray-700 mb-4">今日の栄養素</h2>
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'タンパク質', value: protein, unit: 'g', color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: '脂質', value: fat, unit: 'g', color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: '炭水化物', value: carbs, unit: 'g', color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map(({ label, value, unit, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl py-3 px-2`}>
            <p className={`text-xl font-bold ${color}`}>{value.toFixed(1)}<span className="text-sm font-normal">{unit}</span></p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            {total > 0 && <p className="text-xs text-gray-400">{Math.round((value * (label === '脂質' ? 9 : 4) / total) * 100)}%</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
