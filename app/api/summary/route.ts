import { NextRequest, NextResponse } from 'next/server';
import { getDailySummaries } from '@/lib/meals';

export async function GET(req: NextRequest) {
  const days = Number(req.nextUrl.searchParams.get('days') ?? '30');
  return NextResponse.json({ data: getDailySummaries(days) });
}
