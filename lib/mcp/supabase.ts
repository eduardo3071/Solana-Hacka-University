/**
 * Cliente do banco para as ferramentas do assistente (MCP).
 *
 * As ferramentas são PÚBLICAS: quem chama não tem identidade nenhuma. Então
 * aqui só existe a chave anônima, e quem decide o que pode ser lido é o RLS,
 * exatamente como na página pública do livro-caixa. A `service_role` nunca
 * aparece nesta pasta — ela ignora RLS, e atrás de um endpoint sem login isso
 * entregaria o banco inteiro a qualquer um.
 *
 * Nada é lido no topo do módulo: o extrator do manifesto avalia este arquivo
 * sem ambiente configurado, e uma leitura de variável aqui quebraria o build.
 */
import { createClient } from '@supabase/supabase-js';

function variavel(nomes: readonly string[]): string | undefined {
  for (const nome of nomes) {
    const valor = process.env[nome]?.trim();
    if (valor) return valor;
  }
  return undefined;
}

export function supabaseAnon() {
  const url = variavel(['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL']);
  const chave = variavel([
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_ANON_KEY',
    'SUPABASE_PUBLISHABLE_KEY',
  ]);

  if (!url || !chave) {
    throw new Error(
      'O banco não está configurado no servidor (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY).',
    );
  }

  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Dinheiro é integer em centavos, do banco até aqui. Nunca float. */
export function emReais(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100);
}
