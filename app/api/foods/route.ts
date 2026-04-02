import { NextRequest, NextResponse } from 'next/server';
import { searchFoods, saveFoodItem, getAllFoods } from '@/lib/foods';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');
  const data = query ? await searchFoods(query) : await getAllFoods();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, calories, protein_g, fat_g, carbs_g } = body;
  if (!name || calories == null) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const item = await saveFoodItem({ name, calories: Number(calories), protein_g: Number(protein_g ?? 0), fat_g: Number(fat_g ?? 0), carbs_g: Number(carbs_g ?? 0) });
  return NextResponse.json({ data: item }, { status: 201 });
}
