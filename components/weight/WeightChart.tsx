'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { WeightLog } from '@/lib/types';

interface Props {
  logs: WeightLog[];
  targetWeight?: number | null;
}

export default function WeightChart({ logs, targetWeight }: Props) {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const data = sorted.map(l => ({
    date: l.date.slice(5),
    weight: l.weight_kg,
  }));

  if (data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">データなし</div>;
  }

  const weights = data.map(d => d.weight);
  const minW = Math.floor(Math.min(...weights) - 1);
  const maxW = Math.ceil(Math.max(...weights) + 1);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
        <YAxis domain={[minW, maxW]} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={36} />
        <Tooltip formatter={(v) => [`${v} kg`, '体重']} labelStyle={{ fontSize: 12 }} />
        {targetWeight && (
          <ReferenceLine y={targetWeight} stroke="#22c55e" strokeDasharray="4 2" label={{ value: '目標', fill: '#22c55e', fontSize: 11 }} />
        )}
        <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
