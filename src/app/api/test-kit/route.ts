import { NextRequest, NextResponse } from 'next/server';
import { addToKitList } from '@/lib/kit';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Kit test endpoint ready',
    api_key_available: !!process.env.KIT_API_KEY,
    api_key_length: process.env.KIT_API_KEY?.length || 0,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    console.log('=== KIT API TEST ===');
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('API Key available:', !!process.env.KIT_API_KEY);
    console.log('API Key length:', process.env.KIT_API_KEY?.length || 0);
    console.log('API Key starts with:', process.env.KIT_API_KEY?.substring(0, 10) || 'N/A');
    
    const result = await addToKitList({
      email: email || 'test@example.com',
      name: name || 'Test User',
      tags: ['test']
    });
    
    console.log('Kit result:', result);
    console.log('=== END KIT TEST ===');
    
    return NextResponse.json({
      success: true,
      kit_result: result,
      api_key_available: !!process.env.KIT_API_KEY,
      api_key_length: process.env.KIT_API_KEY?.length || 0
    });
  } catch (error) {
    console.error('Kit test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      api_key_available: !!process.env.KIT_API_KEY,
      api_key_length: process.env.KIT_API_KEY?.length || 0
    }, { status: 500 });
  }
}
