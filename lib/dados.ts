/**
 * Leitura do banco, sempre no servidor.
 *
 * Única fonte de dados do produto — não existe mais mock. Tudo roda em Server
 * Component ou Server
 * Action, com o cliente de sessão — ou seja, sob RLS. Se uma consulta devolve
 * vazio, é porque a política decidiu assim, e é isso que queremos: a segurança
 * não depende deste arquivo estar certo.
 *
 * Dinheiro continua sendo integer em centavos, do banco até a tela.
 */
import 'server-only';

import { cache } from 'react';

import type { Rubrica } from '@/components/acentos';
import { criarClienteServidor } from '@/lib/supabase/server';

export type Papel = 'presidente' | 'tesoureiro' | 'conselho' | 'socio';

export type Entidade = {
  id: string;
  nome: string;
  slug: string;
  tipo: 'atletica' | 'formatura' | 'ej' | 'ca';
  universidade: string | null;
  publico: boolean;
  multisig_pda: string | null;
};

export type Membro = {
  id: string;
  nome: string;
  papel: Papel;
  email: string | null;
  ativo: boolean;
};

export type Lancamento = {
  id: string;
  tipo: 'entrada' | 'saida';
  valor_centavos: number;
  rubrica: Rubrica;
  descricao: string;
  criado_em: string;
  tx_signature: string | null;
};

export type Proposta = {
  id: string;
  destino: string;
  chave_pix: string;
  valor_centavos: number;
  rubrica: Rubrica;
  status: 'pendente' | 'aprovada' | 'executada' | 'rejeitada';
  criado_em: string;
  criado_por: string;
  tx_index: number | null;
  assinaturas: { membro_id: string; assinado_em: string }[];
};

export const nomeDoPapel: Record<Papel, string> = {
  presidente: 'Presidente',
  tesoureiro: 'Tesoureira',
  conselho: 'Conselho fiscal',
  socio: 'Sócia',
};

/**
 * Quantas assinaturas qualquer saída exige, de quantos signatários.
 *
 * Fixo em 2 de 3 enquanto o cofre é criado assim pelos Route Handlers. Quando a
 * entidade puder escolher o quórum, isto vira coluna em `entidades`.
 */
export const QUORUM = { de: 2, entre: 3 } as const;

/* ── Sessão ─────────────────────────────────────────────────────────────── */

/**
 * Quem está logado, e qual o papel dele.
 *
 * `cache` do React deduplica dentro de uma mesma renderização: a barra de abas,
 * o cabeçalho e o corpo da página pedem a mesma coisa e o banco responde uma
 * vez só.
 *
 * Na primeira visita chama `vincular_membro`, que casa o e-mail do magic link
 * com a linha da diretoria. Sem isso, quem entra fica sem papel nenhum.
 */
export const usuarioAtual = cache(async () => {
  const supabase = await criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  await supabase.schema('privado').rpc('vincular_membro');

  const { data } = await supabase
    .from('membros')
    .select('id, nome, papel, email, ativo, entidade_id')
    .eq('user_id', user.id)
    .eq('ativo', true)
    .maybeSingle();

  if (!data) return { user, membro: null as Membro | null, entidadeId: null };

  const { entidade_id, ...membro } = data;
  return { user, membro: membro as Membro, entidadeId: entidade_id as string };
});

/* ── Entidade ───────────────────────────────────────────────────────────── */

export const entidadePorSlug = cache(async (slug: string) => {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from('entidades')
    .select('id, nome, slug, tipo, universidade, publico, multisig_pda')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as Entidade | null;
});

export const associados = cache(async (entidadeId: string) => {
  const supabase = await criarClienteServidor();
  const { count } = await supabase
    .from('membros')
    .select('id', { count: 'exact', head: true })
    .eq('entidade_id', entidadeId)
    .eq('ativo', true);
  return count ?? 0;
});

export const signatarios = cache(async (entidadeId: string) => {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from('membros')
    .select('id, nome, papel, email, ativo')
    .eq('entidade_id', entidadeId)
    .eq('ativo', true)
    .neq('papel', 'socio')
    .order('papel');
  return (data ?? []) as Membro[];
});

/* ── Livro-caixa ────────────────────────────────────────────────────────── */

export const lancamentos = cache(async (entidadeId: string, limite?: number) => {
  const supabase = await criarClienteServidor();
  let q = supabase
    .from('lancamentos')
    .select('id, tipo, valor_centavos, rubrica, descricao, criado_em, tx_signature')
    .eq('entidade_id', entidadeId)
    .order('criado_em', { ascending: false });

  if (limite) q = q.limit(limite);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Lancamento[];
});

export type Totais = { entrou: number; saiu: number; saldo: number };

/**
 * Soma entradas e saídas.
 *
 * Feito em JavaScript sobre as linhas que a política deixou passar, e não por
 * `sum()` no banco: assim o total sempre corresponde ao extrato exibido logo
 * abaixo. Um resumo que não bate com a lista é o pior erro possível num
 * livro-caixa.
 */
export async function totais(entidadeId: string): Promise<Totais> {
  const linhas = await lancamentos(entidadeId);
  const entrou = linhas
    .filter((l) => l.tipo === 'entrada')
    .reduce((t, l) => t + l.valor_centavos, 0);
  const saiu = linhas
    .filter((l) => l.tipo === 'saida')
    .reduce((t, l) => t + l.valor_centavos, 0);
  return { entrou, saiu, saldo: entrou - saiu };
}

/* ── Propostas ──────────────────────────────────────────────────────────── */

export const propostas = cache(async (entidadeId: string) => {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from('propostas')
    .select(
      'id, destino, chave_pix, valor_centavos, rubrica, status, criado_em, criado_por, tx_index, assinaturas(membro_id, assinado_em)',
    )
    .eq('entidade_id', entidadeId)
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Proposta[];
});

export const pendentes = cache(async (entidadeId: string) =>
  (await propostas(entidadeId)).filter((p) => p.status === 'pendente'),
);

export async function retido(entidadeId: string) {
  return (await pendentes(entidadeId)).reduce((t, p) => t + p.valor_centavos, 0);
}

/** Já assinada por quem está logado, mas ainda sem quórum — a do vídeo. */
export async function propostaRetida(entidadeId: string, membroId: string | null) {
  const lista = await pendentes(entidadeId);
  return (
    lista.find(
      (p) =>
        p.assinaturas.length > 0 &&
        p.assinaturas.length < QUORUM.de &&
        (!membroId || p.assinaturas.some((a) => a.membro_id === membroId)),
    ) ??
    lista[0] ??
    null
  );
}

/* ── Eventos ────────────────────────────────────────────────────────────── */

export const eventoPorSlug = cache(async (slug: string) => {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from('eventos')
    .select('id, nome, slug, data, local, capacidade, entidade_id')
    .eq('slug', slug)
    .maybeSingle();

  // Erro estoura; ausência devolve null. São coisas diferentes e a tela diz
  // coisas diferentes — "essa festa não existe" não pode ser o que o
  // estudante lê quando o que houve foi o banco fora do ar.
  if (error) throw error;
  return data;
});
