import { NextRequest, NextResponse } from 'next/server';
import { deleteMeal } from '@/lib/meals';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await deleteMeal(Number(params.id));
  return NextResponse.json({ data: null });
}
