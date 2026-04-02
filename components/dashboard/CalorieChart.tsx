'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { DailySummary } from '@/lib/types';

interface Props {
  summaries: DailySummary[];
  target: number;
}

export default function CalorieChart({ summaries, target }: Props) {
  const data = [...summaries].reverse().map(s => ({
    date: s.date.slice(5),
    calories: s.total_calories,
  }));

  if (data.length === 0) {
    return <div className="h-36 flex items-center justify-center text-gray-400 text-sm">データなし</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={32} />
        <Tooltip formatter={(v) => [`${v} kcal`, 'カロリー']} labelStyle={{ fontSize: 11 }} />
        <ReferenceLine y={target} stroke="#22c55e" strokeDasharray="4 2" />
        <Bar dataKey="calories" fill="#86efac" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
