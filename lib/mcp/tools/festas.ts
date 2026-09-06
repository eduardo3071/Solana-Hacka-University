import { defineTool, ToolError } from '@lovable.dev/mcp-js';
import { z } from 'zod';

import { emReais, supabaseAnon } from '../supabase';

/** As festas de uma entidade e os lotes de ingresso, com preço e disponibilidade. */
export default defineTool({
  name: 'festas',
  title: 'Festas e lotes de ingresso',
  description:
    'Lista as festas de uma entidade com data, local, capacidade e os lotes de ingresso (preço, vendidos e restantes).',
  inputSchema: {
    slug: z.string().trim().min(1).describe('Apelido de link da entidade, ex.: aaaeng.'),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = supabaseAnon();

    const { data: entidade, error: erroEntidade } = await supabase
      .from('entidades')
      .select('id, nome')
      .eq('slug', slug)
      .maybeSingle();

    if (erroEntidade) throw new ToolError('Não conseguimos ler a entidade agora.');
    if (!entidade) throw new ToolError(`Nenhuma entidade com o apelido "${slug}".`);

    const { data: eventos, error } = await supabase
      .from('eventos')
      .select('id, nome, slug, data, local, capacidade')
      .eq('entidade_id', entidade.id)
      .order('data', { ascending: false });

    if (error) throw new ToolError('Não conseguimos ler as festas agora.');

    const lista = eventos ?? [];
    const ids = lista.map((e) => e.id);

    const { data: lotes } = ids.length
      ? await supabase
          .from('lotes')
          .select('evento_id, nome, preco_centavos, total, vendidos')
          .in('evento_id', ids)
          .order('ordem')
      : { data: [] as never[] };

    const porEvento = lista.map((e) => ({
      nome: e.nome,
      slug: e.slug,
      data: e.data,
      local: e.local,
      capacidade: e.capacidade,
      lotes: (lotes ?? [])
        .filter((l) => l.evento_id === e.id)
        .map((l) => ({
          nome: l.nome,
          preco_centavos: l.preco_centavos,
          vendidos: l.vendidos,
          total: l.total,
          restantes: Math.max(0, l.total - l.vendidos),
        })),
    }));

    const texto = porEvento.length
      ? porEvento
          .map((e) => {
            const quando = new Date(e.data).toLocaleDateString('pt-BR');
            const linhas = e.lotes.length
              ? e.lotes
                  .map(
                    (l) =>
                      `   · ${l.nome} — ${emReais(l.preco_centavos)} · ${l.restantes === 0 ? 'esgotado' : `${l.restantes} de ${l.total} disponíveis`}`,
                  )
                  .join('\n')
              : '   · sem lotes cadastrados';
            return `${e.nome} — ${quando}${e.local ? ` · ${e.local}` : ''}\n${linhas}`;
          })
          .join('\n\n')
      : 'Nenhuma festa cadastrada.';

    return {
      content: [{ type: 'text', text: `${entidade.nome}\n\n${texto}` }],
      structuredContent: { entidade: entidade.nome, festas: porEvento },
    };
  },
});
