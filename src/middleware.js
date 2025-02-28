import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// 管理者権限が必要なパス
const ADMIN_PATHS = [
  '/admin',
  '/admin/users',
  '/admin/products',
  '/admin/orders',
  '/admin/settings',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 一時的にミドルウェアの認証チェックを無効化
  return NextResponse.next();
  
  // 以下のコードは一時的にコメントアウト
  /*
  // 管理者ページへのアクセスをチェック
  if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      // トークンがない場合はログインページにリダイレクト
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
    }
    
    try {
      // トークンを検証
      const decoded = verifyToken(token);
      
      if (!decoded || decoded.role !== 'admin') {
        // 管理者でない場合はホームページにリダイレクト
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // トークンが無効な場合はログインページにリダイレクト
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
    }
  }
  
  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 