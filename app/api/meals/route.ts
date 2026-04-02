import { NextRequest, NextResponse } from 'next/server';
import { getMealsByDate, addMeal } from '@/lib/meals';
import type { MealType } from '@/lib/types';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return NextResponse.json({ error: 'date is required' }, { status: 400 });
  const data = await getMealsByDate(date);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, meal_type, name, calories, protein_g, fat_g, carbs_g, image_url, memo } = body;
  if (!date || !meal_type || !name || calories == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const meal = await addMeal({
    date, meal_type: meal_type as MealType, name, calories: Number(calories),
    protein_g: Number(protein_g ?? 0),
    fat_g: Number(fat_g ?? 0),
    carbs_g: Number(carbs_g ?? 0),
    image_url: image_url ?? '',
    memo,
  });
  return NextResponse.json({ data: meal }, { status: 201 });
}
