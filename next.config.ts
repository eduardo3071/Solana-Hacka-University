import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /*
   * A raiz é esta pasta, sempre.
   *
   * Sem isto, o Next procura lockfiles pelos diretórios acima e, se achar um
   * órfão — um `npm install` rodado sem querer na pasta do usuário, por
   * exemplo —, elege aquele diretório como raiz. O `dev` sobrevive, mas o
   * rastreamento de arquivos do `build` passa a olhar a árvore errada, e o
   * sintoma aparece só no deploy.
   */
  outputFileTracingRoot: process.cwd(),
  // O selo de desenvolvimento do Next fica sobre o canto inferior esquerdo e
  // cobre conteúdo em telas de 390px — atrapalha a conferência contra as
  // pranchas.
  devIndicators: false,
};

export default nextConfig;
