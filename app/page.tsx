import Link from 'next/link';

/**
 * Capa. Provisória — existe para o esqueleto ter uma raiz navegável enquanto
 * as telas 5a–5e não estão construídas.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col gap-3 px-4 py-10">
      <p className="t-rotulo text-ink-3">Tesouraria estudantil</p>
      <h1 className="t-hero">Quórum</h1>
      <p className="t-desc text-ink-2">
        Cofre com duas assinaturas de três e livro-caixa aberto aos associados.
      </p>

      <nav className="mt-6 flex flex-col gap-2">
        <Link
          href="/estilo"
          className="rounded-btn border border-line bg-surface px-4 py-3 t-item-sm"
        >
          Folha de estilo
        </Link>
        <Link
          href="/e/aaaeng/livro"
          className="rounded-btn border border-line bg-surface px-4 py-3 t-item-sm"
        >
          Livro-caixa público
        </Link>
      </nav>
    </main>
  );
}
