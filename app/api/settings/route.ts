import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSetting } from '@/lib/weight';

export async function GET() {
  return NextResponse.json({ data: getSettings() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key, value } = body;
  if (!key || value == null) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  saveSetting(key, String(value));
  return NextResponse.json({ data: null });
}
