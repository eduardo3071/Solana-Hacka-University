/**
 * Servidor MCP do Quórum — as ferramentas que um assistente pode chamar.
 *
 * É PÚBLICO, sem login, e por isso só expõe o que já é aberto por desenho: o
 * livro-caixa das entidades públicas, as festas e os lotes. Toda leitura passa
 * pela chave anônima e pelo RLS (ver `lib/mcp/supabase.ts`).
 *
 * Nada de escrita no cofre aqui: proposta, assinatura e execução dependem de
 * chave privada no servidor e de quórum, e não têm por que ficar ao alcance de
 * quem não se identificou.
 *
 * Este módulo é avaliado sem ambiente configurado quando o manifesto é
 * extraído — nenhuma leitura de variável, I/O ou erro no topo do arquivo.
 */
import { defineMcp } from '@lovable.dev/mcp-js';

import entidadesPublicas from './tools/entidades-publicas';
import festas from './tools/festas';
import livroCaixa from './tools/livro-caixa';

export default defineMcp({
  name: 'quorum-solana-hacka',
  title: 'Quorum - Solana Hacka',
  version: '0.1.0',
  instructions:
    'Ferramentas de leitura do Quórum, tesouraria com quórum para entidades estudantis. Use entidades_publicas para descobrir o apelido de link (slug) de uma entidade, livro_caixa para ver entradas, saídas e saldo, e festas para ver eventos e lotes de ingresso. Todo valor vem em centavos: 8000 são R$ 80,00.',
  tools: [entidadesPublicas, livroCaixa, festas],
});
