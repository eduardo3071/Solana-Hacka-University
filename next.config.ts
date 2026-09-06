import path from 'node:path';

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
  /*
   * O pacote de MCP importa `cloudflare:workers` para ler segredos quando roda
   * em Worker. O webpack do Next não resolve esse esquema e o build quebra;
   * apontamos para um módulo vazio e o pacote usa `process.env`.
   */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'cloudflare:workers': path.resolve(
        process.cwd(),
        'lib/mcp/cloudflare-workers-stub.ts',
      ),
    };
    return config;
  },
};

export default nextConfig;
