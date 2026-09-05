'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { criarClienteServidor } from '@/lib/supabase/server';

/**
 * Server Actions. Toda escrita passa por aqui — leitura fica em `lib/dados.ts`.
 */

export type EstadoEntrada = { erro?: string; enviado?: string };

/**
 * Envia o link de acesso por e-mail.
 *
 * Sem senha: ninguém vai criar senha para entrar no app da atlética. E sem
 * revelar se o e-mail existe — responder "não encontrado" transformaria o
 * formulário num verificador de quem é da diretoria.
 */
export async function enviarLink(
  _anterior: EstadoEntrada,
  form: FormData,
): Promise<EstadoEntrada> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { erro: 'Confira o e-mail — parece incompleto.' };
  }

  const supabase = await criarClienteServidor();
  const cabecalhos = await headers();
  const origem =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `http://${cabecalhos.get('host') ?? 'localhost:3000'}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origem}/auth/confirmar` },
  });

  if (error) {
    console.error('[auth] falha ao enviar o link', error);
    return { erro: 'Não conseguimos enviar o link agora. Tente de novo.' };
  }

  return { enviado: email };
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect('/entrar');
}
