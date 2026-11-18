import { NextResponse } from 'next/server';

// No public form uses this legacy endpoint. In particular, it must not return
// an artificial success for subscriptions that were never saved.
export async function POST() {
  return NextResponse.json(
    { error: 'This subscription route has retired. Please use the Founding Table form.' },
    { status: 410 }
  );
}

