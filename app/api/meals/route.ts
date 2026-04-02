import { NextRequest, NextResponse } from 'next/server';
import { getMealsByDate, addMeal } from '@/lib/meals';
import type { MealType } from '@/lib/types';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return NextResponse.json({ error: 'date is required' }, { status: 400 });
  return NextResponse.json({ data: getMealsByDate(date) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, meal_type, name, calories, memo } = body;
  if (!date || !meal_type || !name || calories == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const meal = addMeal({ date, meal_type: meal_type as MealType, name, calories: Number(calories), memo });
  return NextResponse.json({ data: meal }, { status: 201 });
}
