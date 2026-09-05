import type { NextRequest } from 'next/server';

import { atualizarSessao } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return atualizarSessao(request);
}

export const config = {
  matcher: [
    /*
     * Tudo, menos assets estáticos e imagens — eles não têm sessão a renovar
     * e passar por aqui só custa latência.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)',
  ],
};
