import { NextRequest, NextResponse } from 'next/server';
import { addToKitList } from '@/lib/kit';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    console.log('Testing Kit API with:', { email, name });
    console.log('Kit API Key available:', !!process.env.KIT_API_KEY);
    
    const result = await addToKitList({
      email: email || 'test@example.com',
      name: name || 'Test User',
      tags: ['test']
    });
    
    return NextResponse.json({
      success: true,
      kit_result: result,
      api_key_available: !!process.env.KIT_API_KEY
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      api_key_available: !!process.env.KIT_API_KEY
    }, { status: 500 });
  }
}
