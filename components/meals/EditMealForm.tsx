'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import type { Meal, MealType } from '@/lib/types';
import { MEAL_TYPE_LABELS } from '@/lib/types';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function EditMealForm({ meal }: { meal: Meal }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mealType, setMealType] = useState<MealType>(meal.meal_type);
  const [name, setName] = useState(meal.name);
  const [calories, setCalories] = useState(String(meal.calories));
  const [protein, setProtein] = useState(String(meal.protein_g || ''));
  const [fat, setFat] = useState(String(meal.fat_g || ''));
  const [carbs, setCarbs] = useState(String(meal.carbs_g || ''));
  const [memo, setMemo] = useState(meal.memo || '');
  const [imageUrl, setImageUrl] = useState(meal.image_url || '');
  const [imagePreview, setImagePreview] = useState(meal.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const json = await res.json();
        setImageUrl(json.url ?? '');
      }
    } catch {
      // continue without image
    } finally {
      setUploading(false);
    }
  }

  async function analyzeImage() {
    if (!imageUrl) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl }),
      });
      const json = await res.json();
      if (json.data) {
        setName(json.data.name ?? '');
        setCalories(String(json.data.calories ?? ''));
        setProtein(String(json.data.protein_g ?? ''));
        setFat(String(json.data.fat_g ?? ''));
        setCarbs(String(json.data.carbs_g ?? ''));
      }
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !calories) return;
    setLoading(true);
    const res = await fetch(`/api/meals/${meal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meal_type: mealType, name: name.trim(),
        calories: Number(calories),
        protein_g: Number(protein || 0),
        fat_g: Number(fat || 0),
        carbs_g: Number(carbs || 0),
        image_url: imageUrl,
        memo,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert('保存失敗: ' + (err.error ?? res.status));
      setLoading(false);
      return;
    }
    window.location.href = '/';
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">食事タイプ</label>
        <div className="flex gap-2 flex-wrap">
          {MEAL_TYPES.map(t => (
            <button type="button" key={t} onClick={() => setMealType(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mealType === t ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {MEAL_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">写真</label>
        <div onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-green-400 transition-colors">
          {imagePreview ? (
            <div className="relative w-full h-48">
              <Image src={imagePreview} alt="preview" fill className="object-cover" />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-sm">アップロード中...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span className="text-sm">タップして写真を変更</span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
      </div>

      {imageUrl && !uploading && (
        <button type="button" onClick={analyzeImage} disabled={analyzing}
          className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
          {analyzing ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>AI解析中...</>
          ) : <>✨ AIでカロリーを再解析</>}
        </button>
      )}

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">食品名</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">カロリー (kcal)</label>
        <input type="number" value={calories} onChange={e => setCalories(e.target.value)}
          inputMode="decimal" required min={0}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">栄養素（任意）</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'タンパク質 (g)', val: protein, set: setProtein },
            { label: '脂質 (g)', val: fat, set: setFat },
            { label: '炭水化物 (g)', val: carbs, set: setCarbs },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <input type="number" value={val} onChange={e => set(e.target.value)}
                placeholder="0" inputMode="decimal" min={0} step="0.1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メモ（任意）</label>
        <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
      </div>

      <button type="submit" disabled={loading || uploading || !name.trim() || !calories}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {loading ? '保存中...' : '更新する'}
      </button>
    </form>
  );
}
