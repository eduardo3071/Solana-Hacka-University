import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O selo de desenvolvimento do Next fica sobre o canto inferior esquerdo e
  // cobre conteúdo em telas de 390px — atrapalha a conferência contra as
  // pranchas.
  devIndicators: false,
};

export default nextConfig;
