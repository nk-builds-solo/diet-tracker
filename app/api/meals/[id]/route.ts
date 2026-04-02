import { NextRequest, NextResponse } from 'next/server';
import { deleteMeal, updateMeal } from '@/lib/meals';
import type { MealType } from '@/lib/types';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { meal_type, name, calories, protein_g, fat_g, carbs_g, image_url, memo } = body;
  if (!meal_type || !name || calories == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const meal = await updateMeal(Number(params.id), {
    meal_type: meal_type as MealType, name, calories: Number(calories),
    protein_g: Number(protein_g ?? 0),
    fat_g: Number(fat_g ?? 0),
    carbs_g: Number(carbs_g ?? 0),
    image_url: image_url ?? '',
    memo,
  });
  return NextResponse.json({ data: meal });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await deleteMeal(Number(params.id));
  return NextResponse.json({ data: null });
}
