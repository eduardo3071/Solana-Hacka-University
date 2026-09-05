/**
 * Formatação de dinheiro, data e nome — tudo em pt-BR.
 *
 * Dinheiro é sempre integer em CENTAVOS. Nenhuma string de valor é escrita à
 * mão no produto: todo valor passa por aqui. É o que mantém as colunas
 * alinhadas entre telas e o que impede um `toFixed(2)` de aparecer no meio de
 * um extrato.
 */

/** Menos matemático, U+2212. Nunca hífen — o hífen quebra a linha. */
export const MENOS = '−';

export type TipoLancamento = 'entrada' | 'saida';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const brlCompacto = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

/**
 * Valor completo, para livro-caixa e comprovante.
 *
 * `4318025` → `"R$ 43.180,25"`
 *
 * O separador que o Intl põe entre `R$` e o número é espaço estreito
 * inquebrável (U+202F), então o valor nunca parte em duas linhas sozinho.
 */
export function formatBRL(centavos: number): string {
  return brl.format(centavos / 100);
}

/**
 * Valor abreviado, sem centavos, para cartão compacto.
 *
 * `4318025` → `"R$ 43.180"`
 */
export function formatCompacto(centavos: number): string {
  return brlCompacto.format(centavos / 100);
}

/**
 * Valor com sinal, para linha de lançamento.
 *
 * `formatComSinal(456000, 'entrada')` → `"+ R$ 4.560,00"`
 * `formatComSinal(840000, 'saida')`   → `"− R$ 8.400,00"`
 *
 * Recebe o valor sempre positivo — o sinal vem do tipo, não do número. Um
 * valor negativo no banco seria ambíguo com estorno.
 */
export function formatComSinal(
  centavos: number,
  tipo: TipoLancamento,
  opcoes: { compacto?: boolean } = {},
): string {
  const sinal = tipo === 'entrada' ? '+' : MENOS;
  const valor = opcoes.compacto
    ? formatCompacto(Math.abs(centavos))
    : formatBRL(Math.abs(centavos));
  return `${sinal} ${valor}`;
}

const HORA = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

const DIA_MES = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

const DIA_MES_CURTO = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  timeZone: 'America/Sao_Paulo',
});

function mesmoDia(a: Date, b: Date): boolean {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' });
  return f.format(a) === f.format(b);
}

/**
 * Quando aconteceu, do jeito que o estudante lê.
 *
 * Hoje  → `"hoje, 18:12"`
 * Antes → `"02/09"`
 *
 * `agora` é injetável porque "hoje" depende de quando se pergunta: sem isso o
 * servidor e o browser podem discordar na virada da meia-noite e o React
 * reclama de hidratação.
 */
export function formatQuando(iso: string | Date, agora: Date = new Date()): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '';
  return mesmoDia(d, agora) ? `hoje, ${HORA.format(d)}` : DIA_MES.format(d);
}

/** `"2026-09-02"` → `"02 set"`. Formato das linhas de movimentação. */
export function formatDataCurta(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '';
  // O Intl devolve "02 de set."; a prancha usa "02 set".
  return DIA_MES_CURTO.format(d).replace(/\s*de\s*/, ' ').replace('.', '');
}

/** `"2026-09-02"` → `"02/09"`. */
export function formatData(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '';
  return DIA_MES.format(d);
}

/** `"18:12"`. */
export function formatHora(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '';
  return HORA.format(d);
}

// "de", "da", "dos"… não viram inicial: "Ana da Silva" é AS, não ADS.
const PARTICULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

/**
 * Iniciais para o avatar quadrado.
 *
 * `"Marina Salgado"` → `"MS"` · `"Letícia Marchetti"` → `"LM"`
 *
 * Primeiro e último nome, ignorando partículas. Nome único devolve uma letra.
 */
export function iniciais(nome: string): string {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter((p) => p && !PARTICULAS.has(p.toLowerCase()));

  if (partes.length === 0) return '';
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();

  const primeiro = partes[0].charAt(0);
  const ultimo = partes[partes.length - 1].charAt(0);
  return (primeiro + ultimo).toUpperCase();
}

/** `"Marina Salgado"` → `"Marina"`. Para linhas onde o nome cheio não cabe. */
export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? '';
}
