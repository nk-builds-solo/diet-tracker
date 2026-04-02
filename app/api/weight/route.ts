import { NextRequest, NextResponse } from 'next/server';
import { getWeightLogs, upsertWeight } from '@/lib/weight';

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get('limit') ?? '30');
  return NextResponse.json({ data: getWeightLogs(limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, weight_kg } = body;
  if (!date || weight_kg == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const log = upsertWeight(date, Number(weight_kg));
  return NextResponse.json({ data: log }, { status: 201 });
}
