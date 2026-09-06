// O Next injeta os tipos de asset via next-env.d.ts, mas o import de efeito
// colateral de CSS só é reconhecido depois do primeiro build — no typecheck
// limpo ele estoura como TS2882. Esta declaração fecha essa lacuna.
declare module '*.css';
