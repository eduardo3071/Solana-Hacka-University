/**
 * Substituto para `cloudflare:workers`.
 *
 * O pacote de MCP tem um adaptador para Cloudflare que lê segredos do binding
 * `env`. Este app roda em Node, e o webpack do Next não sabe resolver o esquema
 * `cloudflare:` — daí o alias em `next.config.ts` para este arquivo. Aqui não
 * existe binding nenhum, e o pacote cai no `process.env`, que é o certo.
 */
export const env: Record<string, string | undefined> = {};
