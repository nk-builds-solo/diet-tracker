'use client';

interface Props {
  consumed: number;
  target: number;
}

export default function CalorieRing({ consumed, target }: Props) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(consumed / target, 1);
  const offset = circumference * (1 - ratio);

  const color =
    ratio >= 1 ? '#ef4444' :
    ratio >= 0.8 ? '#f59e0b' :
    '#22c55e';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="14" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="70" y="65" textAnchor="middle" className="text-2xl font-bold" fill="#111827" fontSize="22" fontWeight="700">
          {consumed.toLocaleString()}
        </text>
        <text x="70" y="83" textAnchor="middle" fill="#6b7280" fontSize="12">
          / {target.toLocaleString()} kcal
        </text>
      </svg>
      <p className="text-sm text-gray-500">
        残り <span className="font-semibold text-gray-800">{Math.max(0, target - consumed).toLocaleString()} kcal</span>
      </p>
    </div>
  );
}
