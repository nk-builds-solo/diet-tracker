'use client';
import { useState } from 'react';

interface Props {
  initialTarget: number | null;
}

export default function TargetWeightForm({ initialTarget }: Props) {
  const [target, setTarget] = useState(initialTarget ? String(initialTarget) : '');
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'target_weight_kg', value: target }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">目標体重</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="例: 60.0"
          inputMode="decimal"
          step="0.1"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <span className="flex items-center text-gray-500 text-sm">kg</span>
        <button onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          {saved ? '保存済' : '設定'}
        </button>
      </div>
    </div>
  );
}
