import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(request: Request) {
  try {
    const { content, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: '请在设置中配置 API Key' },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      baseURL: 'https://api.siliconflow.cn/v1',
      apiKey: apiKey,
    });

    const response = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        {
          role: "system",
          content: "你是一个专业的内容分析师，善于总结文章要点。请用简洁的语言总结文章的主要内容，并提取关键信息。"
        },
        {
          role: "user",
          content
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ 
      summary: response.choices[0].message.content 
    });
  } catch (error) {
    console.error('LLM处理失败:', error);
    return NextResponse.json(
      { error: 'LLM处理失败' },
      { status: 500 }
    );
  }
} 