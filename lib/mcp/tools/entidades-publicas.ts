import { defineTool, ToolError } from '@lovable.dev/mcp-js';

import { supabaseAnon } from '../supabase';

/** Só entidades com livro-caixa aberto: é o que a política deixa o anônimo ler. */
export default defineTool({
  name: 'entidades_publicas',
  title: 'Entidades com livro-caixa aberto',
  description:
    'Lista as entidades estudantis cujo livro-caixa é público, com nome, apelido de link (slug), tipo e universidade.',
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { data, error } = await supabaseAnon()
      .from('entidades')
      .select('nome, slug, tipo, universidade')
      .eq('publico', true)
      .order('nome');

    if (error) throw new ToolError('Não conseguimos ler as entidades agora.');

    const entidades = data ?? [];
    const texto = entidades.length
      ? entidades
          .map((e) => `${e.nome} (${e.slug}) — ${e.tipo}${e.universidade ? ` · ${e.universidade}` : ''}`)
          .join('\n')
      : 'Nenhuma entidade com livro-caixa aberto.';

    return {
      content: [{ type: 'text', text: texto }],
      structuredContent: { entidades },
    };
  },
});
