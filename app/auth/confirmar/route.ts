import { NextResponse } from 'next/server';

import { criarClienteServidor } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Volta do link enviado por e-mail.
 *
 * O Supabase manda um `token_hash` e o `type`; trocamos por sessão e mandamos a
 * pessoa para onde ela queria ir. Falha aqui é quase sempre link expirado ou já
 * usado — e o texto na tela diz isso, em vez de "otp_expired".
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get('token_hash');
  const tipo = url.searchParams.get('type');
  const proxima = url.searchParams.get('proxima') ?? '/';

  if (!tokenHash || !tipo) {
    return NextResponse.redirect(new URL('/entrar?erro=link', url.origin));
  }

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.verifyOtp({
    type: tipo as 'magiclink' | 'email',
    token_hash: tokenHash,
  });

  if (error) {
    console.error('[auth] link inválido ou expirado', error);
    return NextResponse.redirect(new URL('/entrar?erro=expirado', url.origin));
  }

  return NextResponse.redirect(new URL(proxima, url.origin));
}
