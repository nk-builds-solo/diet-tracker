import { NextRequest, NextResponse } from 'next/server';
import { deleteWeight } from '@/lib/weight';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await deleteWeight(Number(params.id));
  return NextResponse.json({ data: null });
}
