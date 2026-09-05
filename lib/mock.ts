/**
 * Dados de mentira, cenário verdadeiro.
 *
 * Fonte única enquanto o banco não existe (prompt B2). Quando o Supabase
 * entrar no B4, este arquivo sai inteiro — por isso nenhuma tela importa nada
 * daqui diretamente sem passar pelas funções do fim do arquivo.
 *
 * Todo valor é integer em CENTAVOS. As contas fecham: as entradas somam
 * R$ 13.500,00 e as saídas R$ 5.312,40 — há uma verificação no fim que estoura
 * no boot se alguém editar um número e quebrar o extrato.
 */

import type { Rubrica } from '@/components/acentos';

export type Papel = 'presidente' | 'tesoureiro' | 'conselho' | 'socio';

export type Membro = {
  id: string;
  nome: string;
  papel: Papel;
  email?: string;
  desde?: string;
};

export type Lancamento = {
  id: string;
  /** ISO. O fuso é o de São Paulo, onde a atlética existe. */
  data: string;
  tipo: 'entrada' | 'saida';
  valorCentavos: number;
  rubrica: Rubrica;
  descricao: string;
  /**
   * Nome curto para a lista compacta do cofre, onde a coluna é estreita e o
   * nome cheio truncaria. O livro-caixa, que é o documento oficial, sempre usa
   * `descricao` inteira.
   */
  curta?: string;
};

export type Proposta = {
  id: string;
  destino: string;
  chave: string;
  valorCentavos: number;
  rubrica: Rubrica;
  criadoPorId: string;
  criadoEm: string;
  /** Quem já assinou, na ordem em que assinou. */
  assinaturas: { membroId: string; em: string }[];
  necessarias: number;
};

export type Lote = {
  nome: string;
  precoCentavos: number;
  /** null quando esgotado. */
  restam: number | null;
  total: number;
};

/**
 * O "agora" do cenário: 03 de setembro de 2026, 21:34.
 *
 * Fixo de propósito. As pranchas dizem "hoje 18:12" e "atualizado 03/09 às
 * 21:34"; se o relógio real mandasse, a demo mudaria de texto a cada dia e o
 * vídeo deixaria de bater com o desenho.
 */
export const AGORA = new Date('2026-09-03T21:34:00-03:00');

export const MEMBROS: Membro[] = [
  { id: 'lm', nome: 'Letícia Marchetti', papel: 'presidente' },
  {
    id: 'ms',
    nome: 'Marina Salgado',
    papel: 'tesoureiro',
    email: 'marina.salgado@grad.ufsc.br',
    desde: '2026-03-01',
  },
  { id: 'rt', nome: 'Rafael Tonetto', papel: 'conselho' },
];

/** A usuária logada é a Marina em todas as telas. */
export const USUARIA_LOGADA_ID = 'ms';

export const ENTIDADE = {
  nome: 'A.A.A. Engenharia',
  slug: 'aaaeng',
  tipo: 'Atlética' as const,
  universidade: 'UFSC',
  associados: 62,
  saldoCentavos: 4318025,
  retidoCentavos: 1240000,
  diretoria: 2026,
  /** Quantas assinaturas qualquer saída exige, de quantos signatários. */
  quorum: { de: 2, entre: 3 },
  periodo: '01 ago — 03 set 2026',
  atualizadoEm: '03/09 às 21:34',
};

export const LANCAMENTOS: Lancamento[] = [
  {
    id: 'l1',
    data: '2026-09-02T14:20:00-03:00',
    tipo: 'entrada',
    valorCentavos: 456000,
    rubrica: 'Eventos',
    descricao: 'Lote 1 · festa de aniversário',
    curta: 'Lote 1 · aniversário',
  },
  {
    id: 'l2',
    data: '2026-09-01T10:05:00-03:00',
    tipo: 'saida',
    valorCentavos: 320000,
    rubrica: 'Eventos',
    descricao: 'Som Beira-Mar · sinal',
    curta: 'Som Beira-Mar',
  },
  {
    id: 'l3',
    data: '2026-08-30T09:00:00-03:00',
    tipo: 'entrada',
    valorCentavos: 894000,
    rubrica: 'Associados',
    descricao: 'Mensalidades de agosto',
    curta: 'Mensalidades · agosto',
  },
  {
    id: 'l4',
    data: '2026-08-28T16:40:00-03:00',
    tipo: 'saida',
    valorCentavos: 89000,
    rubrica: 'Marketing',
    descricao: 'Gráfica Trindade · cartazes',
  },
  {
    id: 'l5',
    data: '2026-08-26T19:15:00-03:00',
    tipo: 'saida',
    valorCentavos: 62000,
    rubrica: 'Esporte',
    descricao: 'Arbitragem Intermed',
  },
  {
    id: 'l6',
    data: '2026-08-19T07:30:00-03:00',
    tipo: 'saida',
    valorCentavos: 60240,
    rubrica: 'Esporte',
    descricao: 'Ônibus Intermed · Joinville',
  },
];

export const PROPOSTAS: Proposta[] = [
  {
    id: 'p1',
    destino: 'Som Beira-Mar ME',
    chave: '24.881.402/0001-77',
    valorCentavos: 840000,
    rubrica: 'Eventos',
    criadoPorId: 'ms',
    criadoEm: '2026-09-03T18:12:00-03:00',
    assinaturas: [{ membroId: 'ms', em: '2026-09-03T18:12:00-03:00' }],
    necessarias: 2,
  },
  {
    id: 'p2',
    destino: 'Brindes Ilha Sul',
    chave: 'contato@ilhasul.com.br',
    valorCentavos: 248000,
    rubrica: 'Marketing',
    criadoPorId: 'rt',
    criadoEm: '2026-09-02T20:05:00-03:00',
    assinaturas: [],
    necessarias: 2,
  },
  {
    id: 'p3',
    destino: 'Gráfica Trindade',
    chave: '11.204.556/0001-30',
    valorCentavos: 152000,
    rubrica: 'Marketing',
    criadoPorId: 'rt',
    criadoEm: '2026-09-02T18:40:00-03:00',
    assinaturas: [],
    necessarias: 2,
  },
];

export const EVENTO = {
  nome: 'Baile de Aniversário 32 anos',
  slug: 'aaaeng-baile32',
  quando: 'Sáb, 26 set · 23h',
  local: 'Galpão Beira-Mar',
  lotes: [
    { nome: '1º lote · sócio', precoCentavos: 6000, restam: null, total: 300 },
    { nome: '2º lote · sócio', precoCentavos: 8000, restam: 48, total: 300 },
    {
      nome: '2º lote · não sócio',
      precoCentavos: 12000,
      restam: 212,
      total: 400,
    },
  ] satisfies Lote[],
  /** O lote em destaque na página, já selecionado. */
  loteSelecionado: 1,
};

/* ── Leitura ────────────────────────────────────────────────────────────── */

export function membro(id: string): Membro {
  const m = MEMBROS.find((x) => x.id === id);
  if (!m) throw new Error(`Membro desconhecido no mock: ${id}`);
  return m;
}

export const USUARIA = () => membro(USUARIA_LOGADA_ID);

/** Signatários do cofre — sócio não assina. */
export const SIGNATARIOS = MEMBROS.filter((m) => m.papel !== 'socio');

export const somaPor = (tipo: 'entrada' | 'saida') =>
  LANCAMENTOS.filter((l) => l.tipo === tipo).reduce(
    (t, l) => t + l.valorCentavos,
    0,
  );

export const TOTAL_ENTROU = somaPor('entrada');
export const TOTAL_SAIU = somaPor('saida');

/** Propostas que ainda esperam a assinatura de alguém. */
export const PENDENTES = PROPOSTAS.filter(
  (p) => p.assinaturas.length < p.necessarias,
);

/** Já assinada pela usuária logada, mas ainda sem quórum — a do vídeo. */
export const PROPOSTA_RETIDA = PROPOSTAS.find(
  (p) =>
    p.assinaturas.some((a) => a.membroId === USUARIA_LOGADA_ID) &&
    p.assinaturas.length < p.necessarias,
);

export const jaAssinou = (p: Proposta, membroId = USUARIA_LOGADA_ID) =>
  p.assinaturas.some((a) => a.membroId === membroId);

export const nomeDoPapel: Record<Papel, string> = {
  presidente: 'Presidente',
  tesoureiro: 'Tesoureira',
  conselho: 'Conselho fiscal',
  socio: 'Sócia',
};

/*
 * As contas do cenário precisam fechar — é um extrato, e um extrato que não
 * soma destrói a credibilidade da demo inteira. Estoura no import, não em
 * produção silenciosa.
 */
if (TOTAL_ENTROU !== 1350000 || TOTAL_SAIU !== 531240) {
  throw new Error(
    `Mock inconsistente: entradas ${TOTAL_ENTROU} (esperado 1350000), ` +
      `saídas ${TOTAL_SAIU} (esperado 531240).`,
  );
}

const RETIDO = PENDENTES.reduce((t, p) => t + p.valorCentavos, 0);
if (RETIDO !== ENTIDADE.retidoCentavos) {
  throw new Error(
    `Mock inconsistente: propostas pendentes somam ${RETIDO}, ` +
      `mas a entidade declara ${ENTIDADE.retidoCentavos} retidos.`,
  );
}
