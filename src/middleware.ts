import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar si la ruta comienza con /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // No aplicar el middleware a la página de login
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Verificar si existe la cookie de autenticación
    const adminAuth = request.cookies.get('adminAuth');
    
    if (!adminAuth || adminAuth.value !== 'true') {
      // Redirigir al login si no está autenticado
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 