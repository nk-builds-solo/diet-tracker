import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { image_url } = await req.json();
  if (!image_url) {
    return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
  }

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'url', url: image_url },
          },
          {
            type: 'text',
            text: `この食事の写真を見て、カロリーと栄養素を推定してください。
以下のJSON形式で回答してください（日本語の説明なし、JSONのみ）:
{
  "name": "料理名（日本語）",
  "calories": 推定カロリー(整数),
  "protein_g": タンパク質グラム数(小数点1位),
  "fat_g": 脂質グラム数(小数点1位),
  "carbs_g": 炭水化物グラム数(小数点1位)
}`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
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
