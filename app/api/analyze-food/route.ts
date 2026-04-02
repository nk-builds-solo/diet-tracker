import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { image_url } = await req.json();
  if (!image_url) {
    return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  // Fetch image and convert to base64
  const imgRes = await fetch(image_url);
  const imgBuffer = await imgRes.arrayBuffer();
  const base64 = Buffer.from(imgBuffer).toString('base64');
  const mimeType = imgRes.headers.get('content-type') ?? 'image/jpeg';

  const body = {
    contents: [{
      parts: [
        { inline_data: { mime_type: mimeType, data: base64 } },
        {
          text: `この食事の写真を見て、カロリーと栄養素を推定してください。
以下のJSON形式のみで回答してください（説明文なし）:
{"name":"料理名（日本語）","calories":推定カロリー整数,"protein_g":タンパク質小数,"fat_g":脂質小数,"carbs_g":炭水化物小数}`,
        },
      ],
    }],
  };

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );

  const geminiJson = await geminiRes.json();
  const text = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
  }

  try {
    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from AI' }, { status: 500 });
  }
}
