import { defineTool, ToolError } from '@lovable.dev/mcp-js';
import { z } from 'zod';

import { emReais, supabaseAnon } from '../supabase';

const RUBRICAS = ['Eventos', 'Marketing', 'Esporte', 'Associados'] as const;

/**
 * O livro-caixa aberto de uma entidade pública — a mesma coisa que a página
 * `/e/[slug]/livro` mostra sem login.
 *
 * Saída usa `−` (U+2212), entrada usa `+`. Valores em centavos no dado
 * estruturado e em reais no texto.
 */
export default defineTool({
  name: 'livro_caixa',
  title: 'Livro-caixa de uma entidade',
  description:
    'Entradas e saídas do livro-caixa aberto de uma entidade, com saldo e total por rubrica. Aceita filtro por rubrica e por tipo.',
  inputSchema: {
    slug: z.string().trim().min(1).describe('Apelido de link da entidade, ex.: aaaeng.'),
    rubrica: z.enum(RUBRICAS).optional().describe('Categoria contábil, se quiser filtrar.'),
    tipo: z.enum(['entrada', 'saida']).optional(),
    limite: z.number().int().min(1).max(200).default(50),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug, rubrica, tipo, limite }) => {
    const supabase = supabaseAnon();

    const { data: entidade, error: erroEntidade } = await supabase
      .from('entidades')
      .select('id, nome, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (erroEntidade) throw new ToolError('Não conseguimos ler a entidade agora.');
    if (!entidade)
      throw new ToolError(
        `Nenhuma entidade de livro-caixa aberto com o apelido "${slug}". Use entidades_publicas para ver as disponíveis.`,
      );

    let consulta = supabase
      .from('lancamentos')
      .select('tipo, valor_centavos, rubrica, descricao, criado_em')
      .eq('entidade_id', entidade.id)
      .order('criado_em', { ascending: false })
      .limit(limite);

    if (rubrica) consulta = consulta.eq('rubrica', rubrica);
    if (tipo) consulta = consulta.eq('tipo', tipo);

    const { data, error } = await consulta;
    if (error) throw new ToolError('Não conseguimos ler o livro-caixa agora.');

    const lancamentos = data ?? [];
    const entradas = lancamentos
      .filter((l) => l.tipo === 'entrada')
      .reduce((s, l) => s + l.valor_centavos, 0);
    const saidas = lancamentos
      .filter((l) => l.tipo === 'saida')
      .reduce((s, l) => s + l.valor_centavos, 0);

    const linhas = lancamentos.map((l) => {
      const data = new Date(l.criado_em).toLocaleDateString('pt-BR');
      const sinal = l.tipo === 'entrada' ? '+' : '\u2212';
      return `${data} · ${sinal} ${emReais(l.valor_centavos)} · ${l.rubrica} · ${l.descricao}`;
    });

    const cabecalho =
      `${entidade.nome} — livro-caixa aberto\n` +
      `Entradas ${emReais(entradas)} · Saídas ${emReais(saidas)} · Saldo do período ${emReais(entradas - saidas)}`;

    return {
      content: [
        {
          type: 'text',
          text: linhas.length ? `${cabecalho}\n\n${linhas.join('\n')}` : `${cabecalho}\n\nNenhum lançamento.`,
        },
      ],
      structuredContent: {
        entidade: entidade.nome,
        slug: entidade.slug,
        entradas_centavos: entradas,
        saidas_centavos: saidas,
        saldo_centavos: entradas - saidas,
        lancamentos,
      },
    };
  },
});
