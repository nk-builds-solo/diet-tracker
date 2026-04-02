'use client';

interface Props {
  consumed: number;
  target: number;
}

export default function CalorieRing({ consumed, target }: Props) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(consumed / target, 1);
  const offset = circumference * (1 - ratio);

  const color = ratio >= 1 ? '#ef4444' : ratio >= 0.8 ? '#f59e0b' : '#22c55e';
  const bgColor = ratio >= 1 ? '#fef2f2' : ratio >= 0.8 ? '#fffbeb' : '#f0fdf4';
  const percent = Math.round(ratio * 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" className="rotate-[-90deg]">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900 leading-none">{consumed.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">/ {target.toLocaleString()} kcal</div>
          <div className="mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: bgColor, color }}>
            {percent}%
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        残り <span className="font-bold text-gray-800">{Math.max(0, target - consumed).toLocaleString()} kcal</span>
      </p>
    </div>
  );
}
