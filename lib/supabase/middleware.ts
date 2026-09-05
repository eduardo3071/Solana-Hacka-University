import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

import { supabaseAnonKey, supabaseUrl } from '@/lib/env';

type CookiesParaGravar = {
  name: string;
  value: string;
  options: CookieOptions;
}[];

/**
 * Rotas abertas a quem não tem conta. O livro-caixa público e a página da
 * festa são a tese do produto — elas não podem ficar atrás de login.
 */
const ROTAS_PUBLICAS = [
  '/', // capa
  '/estilo', // folha de estilo viva
  '/entrar', // magic link
];

function ehPublica(pathname: string): boolean {
  if (ROTAS_PUBLICAS.includes(pathname)) return true;
  // /e/[slug]/livro — livro-caixa público. As demais rotas de /e/ são privadas.
  if (/^\/e\/[^/]+\/livro\/?$/.test(pathname)) return true;
  // /f/[slug] — página da festa.
  if (/^\/f\/[^/]+\/?$/.test(pathname)) return true;
  return false;
}

/**
 * Renova a sessão a cada request e barra as rotas privadas.
 *
 * Precisa rodar em toda navegação: o token do Supabase expira e só é renovado
 * aqui, onde ainda dá para reescrever o cookie na resposta.
 */
export async function atualizarSessao(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookiesParaGravar) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() revalida o token no servidor. getSession() só lê o cookie e
  // aceitaria um token forjado — não troque um pelo outro.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !ehPublica(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/entrar';
    url.searchParams.set('proxima', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
