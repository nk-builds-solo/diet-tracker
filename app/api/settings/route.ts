import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSetting } from '@/lib/weight';

export async function GET() {
  const data = await getSettings();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key, value } = body;
  if (!key || value == null) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  await saveSetting(key, String(value));
  return NextResponse.json({ data: null });
}
