import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDailySummaries } from '@/lib/meals';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const days = Number(req.nextUrl.searchParams.get('days') ?? '30');
  const data = await getDailySummaries(userId, days);
  return NextResponse.json({ data });
}
