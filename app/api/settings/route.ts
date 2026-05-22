import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSettings, saveSetting } from '@/lib/weight';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await getSettings(userId);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { key, value } = body;
  if (!key || value == null) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  await saveSetting(userId, key, String(value));
  return NextResponse.json({ data: null });
}
