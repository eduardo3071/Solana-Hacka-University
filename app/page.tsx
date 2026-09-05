import Link from 'next/link';

import { usuarioAtual } from '@/lib/dados';
import { criarClienteServidor } from '@/lib/supabase/server';

export const metadata = { title: 'Quórum' };

/**
 * Capa.
 *
 * Quem já entrou vai direto para o cofre da própria entidade. Quem não entrou
 * vê a porta e os dois lugares que abrem sem conta — que são a tese do produto.
 */
export default async function Capa() {
  const sessao = await usuarioAtual();

  let slug: string | null = null;
  if (sessao?.entidadeId) {
    const supabase = await criarClienteServidor();
    const { data } = await supabase
      .from('entidades')
      .select('slug')
      .eq('id', sessao.entidadeId)
      .maybeSingle();
    slug = data?.slug ?? null;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col justify-center gap-6 px-4 py-10">
      <header>
        <p className="t-rotulo text-ink-3">Tesouraria estudantil</p>
        <h1 className="t-hero mt-2 text-ink">Quórum</h1>
        <p className="t-desc mt-1.5 text-pretty text-ink-2">
          O dinheiro da entidade fica num cofre que exige duas assinaturas de
          três para qualquer saída, e o livro-caixa é aberto aos associados.
        </p>
      </header>

      <nav className="flex flex-col gap-2">
        {slug ? (
          <>
            <Item href={`/e/${slug}`} titulo="Ir para o cofre" nota="sua entidade" />
            <Item
              href={`/e/${slug}/aprovacoes`}
              titulo="Aprovações"
              nota="assinar saídas"
            />
          </>
        ) : (
          <Item href="/entrar" titulo="Entrar" nota="link por e-mail" />
        )}
      </nav>

      <section>
        <h2 className="t-rotulo mb-2.5 text-ink-3">Aberto, sem conta</h2>
        <div className="flex flex-col gap-2">
          <Item
            href={`/e/${slug ?? 'aaaeng'}/livro`}
            titulo="Livro-caixa público"
            nota="sem login"
          />
          <Item href="/estilo" titulo="Folha de estilo" nota="referência" />
        </div>
      </section>
    </main>
  );
}

function Item({
  href,
  titulo,
  nota,
}: {
  href: string;
  titulo: string;
  nota: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[52px] items-center gap-3 rounded-[14px] border border-line bg-surface px-[13px] py-3"
    >
      <span className="t-item-sm min-w-0 flex-1 truncate text-ink">{titulo}</span>
      <span className="t-chip flex-none text-ink-3">{nota}</span>
    </Link>
  );
}
