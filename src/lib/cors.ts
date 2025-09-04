import { NextRequest, NextResponse } from 'next/server';

export interface CorsOptions {
  origin: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
}

const defaultOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://winewithpete.me', 'https://www.winewithpete.me']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

export function cors(options: Partial<CorsOptions> = {}) {
  const config = { ...defaultOptions, ...options };
  
  return (request: NextRequest) => {
    const origin = request.headers.get('origin');
    const isAllowedOrigin = Array.isArray(config.origin) 
      ? config.origin.includes(origin || '')
      : config.origin === origin;

    const headers = new Headers();
    
    if (isAllowedOrigin) {
      headers.set('Access-Control-Allow-Origin', origin || '*');
    }
    
    headers.set('Access-Control-Allow-Methods', config.methods!.join(', '));
    headers.set('Access-Control-Allow-Headers', config.allowedHeaders!.join(', '));
    
    if (config.credentials) {
      headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200, 
        headers 
      });
    }
    
    return headers;
  };
}

// Predefined CORS configurations
export const apiCors = cors();
export const adminCors = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://winewithpete.me', 'https://www.winewithpete.me']
    : ['http://localhost:3000'],
  credentials: true,
});

export function addCorsHeaders(response: NextResponse, corsHeaders: Headers): NextResponse {
  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}
