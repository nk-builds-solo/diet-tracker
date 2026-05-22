import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getWeightLogs, upsertWeight } from '@/lib/weight';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = Number(req.nextUrl.searchParams.get('limit') ?? '30');
  const data = await getWeightLogs(userId, limit);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { date, weight_kg } = body;
  if (!date || weight_kg == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const log = await upsertWeight(userId, date, Number(weight_kg));
  return NextResponse.json({ data: log }, { status: 201 });
}
