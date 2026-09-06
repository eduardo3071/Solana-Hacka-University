// O Next injeta os tipos de asset via next-env.d.ts, mas o import de efeito
// colateral de CSS só é reconhecido depois do primeiro build — no typecheck
// limpo ele estoura como TS2882. Esta declaração fecha essa lacuna.
declare module '*.css';

// `src/integrations/` é gerado por ferramenta e usa `import.meta.env`, do Vite.
// O Next não declara esse formato; a declaração abaixo evita o erro de tipo sem
// tocar no arquivo gerado.
interface ImportMeta {
  readonly env: Record<string, string>;
}
