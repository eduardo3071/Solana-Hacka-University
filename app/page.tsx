import Link from 'next/link';

import { ENTIDADE, EVENTO } from '@/lib/mock';

export const metadata = { title: 'Quórum' };

/**
 * Índice da demo.
 *
 * Não é tela do produto — é o mapa das onze pranchas implementadas, para
 * navegar a história inteira no celular sem decorar URL. Sai quando o app
 * tiver login e uma raiz de verdade.
 */
const TELAS = [
  {
    grupo: 'Ligado à devnet · funcional',
    itens: [
      {
        id: '5b',
        nome: 'Aprovações ao vivo',
        href: `/e/${ENTIDADE.slug}/aprovacoes?estado=vivo`,
        acesso: 'cofre real',
      },
    ],
  },
  {
    grupo: 'As cinco telas',
    itens: [
      { id: '5a', nome: 'Cofre', href: `/e/${ENTIDADE.slug}`, acesso: 'privada' },
      {
        id: '5b',
        nome: 'Aprovações · o bloqueio',
        href: `/e/${ENTIDADE.slug}/aprovacoes`,
        acesso: 'privada',
      },
      {
        id: '5c',
        nome: 'Livro-caixa público',
        href: `/e/${ENTIDADE.slug}/livro`,
        acesso: 'pública',
      },
      { id: '5d', nome: 'Página da festa', href: `/f/${EVENTO.slug}`, acesso: 'pública' },
      { id: '5e', nome: 'Perfil e carteirinha', href: '/perfil', acesso: 'privada' },
    ],
  },
  {
    grupo: 'Os seis estados',
    itens: [
      {
        id: '6a',
        nome: 'Cofre vazio',
        href: `/e/${ENTIDADE.slug}?estado=vazio`,
        acesso: 'setup',
      },
      {
        id: '6b',
        nome: 'Proposta recusada',
        href: `/e/${ENTIDADE.slug}/aprovacoes?estado=recusada`,
        acesso: 'vermelho',
      },
      {
        id: '6c',
        nome: 'Saída executada',
        href: `/e/${ENTIDADE.slug}/aprovacoes?estado=executada`,
        acesso: 'verde',
      },
      {
        id: '6d',
        nome: 'Executando',
        href: `/e/${ENTIDADE.slug}/aprovacoes?estado=executando`,
        acesso: 'âmbar',
      },
      {
        id: '6e',
        nome: 'Erro de rede',
        href: `/e/${ENTIDADE.slug}/aprovacoes?estado=offline`,
        acesso: 'vermelho',
      },
      {
        id: '6f',
        nome: 'Troca de diretoria',
        href: '/perfil?estado=troca',
        acesso: 'roxo',
      },
    ],
  },
  {
    grupo: 'Referência',
    itens: [
      { id: '4a', nome: 'Folha de estilo', href: '/estilo', acesso: 'sistema' },
    ],
  },
];

export default function Indice() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-5 px-4 py-8">
      <header>
        <p className="t-rotulo text-ink-3">Tesouraria estudantil</p>
        <h1 className="t-hero mt-2 text-ink">Quórum</h1>
        <p className="t-desc mt-1.5 text-pretty text-ink-2">
          Cofre com {ENTIDADE.quorum.de} assinaturas de {ENTIDADE.quorum.entre} e
          livro-caixa aberto aos associados.
        </p>
        <p className="t-meta mt-2 text-pretty text-ink-3">
          A primeira tela fala com o cofre de verdade na devnet e os botões
          funcionam. As demais são as pranchas com dados de mock — servem para
          conferir o desenho, e nelas nada é clicável.
        </p>
      </header>

      {TELAS.map(({ grupo, itens }) => (
        <section key={grupo}>
          <h2 className="t-rotulo mb-2.5 text-ink-3">{grupo}</h2>
          <div className="flex flex-col gap-2">
            {itens.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className="flex min-h-[52px] items-center gap-3 rounded-[14px] border border-line bg-surface px-[13px] py-3"
              >
                <span className="num flex-none rounded-chip bg-blue-tint px-[7px] py-[5px] text-[10.5px] leading-none font-semibold text-blue">
                  {t.id}
                </span>
                <span className="t-item-sm min-w-0 flex-1 truncate text-ink">
                  {t.nome}
                </span>
                <span className="t-chip flex-none text-ink-3">{t.acesso}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
