'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { criarClienteServidor } from '@/lib/supabase/server';

/**
 * Server Actions. Toda escrita passa por aqui — leitura fica em `lib/dados.ts`.
 */

export type EstadoEntrada = { erro?: string; enviado?: string };

/**
 * Para onde o link do e-mail deve voltar.
 *
 * É a falha número um de quem publica: o link chega e devolve a pessoa para
 * `localhost`. Acontece quando a origem é montada só a partir do cabeçalho
 * `host`, que num proxy vem sem protocolo — e `http://` num domínio https
 * quebra a sessão.
 *
 * A ordem é da mais confiável para a menos: a variável que você define, depois
 * o domínio que a Vercel injeta, e só então o cabeçalho da requisição — este
 * respeitando `x-forwarded-proto`, porque atrás de proxy é ele que diz se a
 * conexão original era segura.
 *
 * Definir `NEXT_PUBLIC_SITE_URL` continua sendo o certo em produção: o
 * cabeçalho `host` vem do cliente, e endereço de redirecionamento não é coisa
 * que se deixe o cliente escolher. O Supabase também recusa qualquer URL que
 * não esteja na lista de redirect do painel — é a segunda tranca.
 */
async function enderecoDoSite(): Promise<string> {
  const definido = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (definido) return definido.replace(/\/+$/, '');

  const daVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (daVercel) return `https://${daVercel}`;

  const cabecalhos = await headers();
  const host = cabecalhos.get('host') ?? 'localhost:3000';
  const protocolo =
    cabecalhos.get('x-forwarded-proto')?.split(',')[0].trim() ??
    (/^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? 'http' : 'https');

  return `${protocolo}://${host}`;
}

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
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${await enderecoDoSite()}/auth/confirmar` },
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
