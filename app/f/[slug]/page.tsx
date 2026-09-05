import { Calendar, MapPin, QrCode } from 'lucide-react';

import { Tela } from '@/components/Tela';
import { TileIcone } from '@/components/TileIcone';
import { ENTIDADE, EVENTO } from '@/lib/mock';
import { formatBRL } from '@/lib/format';

export const metadata = {
  title: 'Baile de Aniversário 32 anos · A.A.A. Engenharia',
  description:
    'Sáb, 26 set · 23h no Galpão Beira-Mar. O valor cai direto no cofre da atlética.',
};

/**
 * 5d · Página da festa — pública, sem barra de abas, a mais vistosa.
 *
 * A única tela onde uma imagem grande é permitida. O cartão verde do Pix é a
 * proposta de valor inteira do produto; é ele que justifica a tela existir.
 */
export default async function PaginaDaFesta({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  const selecionado = EVENTO.lotes[EVENTO.loteSelecionado];

  return (
    <Tela>
      {/*
        Placeholder da foto do evento, 390 × 240. O gradiente escuro na base é
        o que faz o texto assentar sobre a imagem real quando ela chegar.
      */}
      <div className="relative h-60 flex-none overflow-hidden bg-[repeating-linear-gradient(135deg,#1F2D41_0_8px,#192434_8px_16px)]">
        <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/75 to-transparent" />
        <div className="absolute inset-x-4 bottom-4">
          <div className="t-rotulo text-blue">
            {ENTIDADE.nome} apresenta
          </div>
          <h1 className="mt-2.5 text-[26px] leading-[1.1] font-extrabold tracking-[-0.035em] text-white">
            Baile de Aniversário
            <br />
            32 anos
          </h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[11px] px-4 pt-3.5 pb-4">
        <div className="grid grid-cols-2 gap-2.5">
          <CartaoQuandoOnde
            icone={Calendar}
            acento="blue"
            rotulo="Quando"
            valor={EVENTO.quando}
          />
          <CartaoQuandoOnde
            icone={MapPin}
            acento="purple"
            rotulo="Onde"
            valor={EVENTO.local}
          />
        </div>

        <h2 className="t-secao mt-0.5 text-ink">Lotes</h2>

        <div className="flex flex-col gap-[9px]">
          {EVENTO.lotes.map((lote, i) => {
            const esgotado = lote.restam === null;
            const ativo = i === EVENTO.loteSelecionado;

            return (
              <div
                key={lote.nome}
                className={`flex items-start justify-between gap-3 rounded-[14px] px-[13px] py-3 ${
                  esgotado
                    ? 'border border-line bg-surface opacity-45'
                    : ativo
                      ? 'border-[1.5px] border-blue bg-blue-tint'
                      : 'border border-line bg-surface'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] leading-[1.2] font-bold text-ink">
                    {lote.nome}
                  </div>
                  <div
                    className={`num mt-[5px] text-[11.5px] leading-none whitespace-nowrap ${
                      ativo ? 'font-semibold text-amber' : 'text-ink-2'
                    }`}
                  >
                    {esgotado
                      ? 'esgotado'
                      : `restam ${lote.restam} de ${lote.total}`}
                  </div>
                </div>
                <div
                  className={`num flex-none leading-none font-extrabold tracking-[-0.03em] ${
                    esgotado
                      ? 'text-[15px] text-ink-2 line-through'
                      : ativo
                        ? 'text-[18px] text-ink'
                        : 'text-[15px] text-ink'
                  }`}
                >
                  {formatBRL(lote.precoCentavos)}
                </div>
              </div>
            );
          })}
        </div>

        {/* A proposta de valor inteira do produto. */}
        <div className="mt-0.5 flex items-center gap-[13px] rounded-card border border-green/30 bg-green-tint p-3.5">
          <div className="flex size-[76px] flex-none items-center justify-center rounded-tile border border-green/35 bg-[#0F2A20]">
            <QrCode size={34} strokeWidth={1.6} className="text-green" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="t-item text-ink">Pague com Pix e receba na hora</div>
            <p className="t-desc mt-1.5 text-pretty text-green-ink">
              O valor cai direto no cofre da atlética. Nada passa por conta
              pessoal.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-none border-t border-line bg-tabbar px-4 pt-3 pb-[18px]">
        <button
          type="button"
          className="num w-full rounded-btn bg-blue p-[15px] text-center text-[14px] leading-none font-bold text-ground"
        >
          Comprar · {formatBRL(selecionado.precoCentavos)}
        </button>
        <p className="mt-2.5 text-center text-[12.5px] leading-[1.4] text-ink-3">
          Livro-caixa da entidade aberto em{' '}
          <a href={`/e/${ENTIDADE.slug}/livro`} className="text-blue">
            quorum.app/{ENTIDADE.slug}
          </a>
        </p>
      </div>
    </Tela>
  );
}

function CartaoQuandoOnde({
  icone,
  acento,
  rotulo,
  valor,
}: {
  icone: typeof Calendar;
  acento: 'blue' | 'purple';
  rotulo: string;
  valor: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-card border border-line bg-surface p-[13px]">
      <TileIcone icone={icone} acento={acento} tamanho="md" />
      <div className="min-w-0 flex-1">
        <div className="t-rotulo text-ink-2">{rotulo}</div>
        {/*
          O corpo é menor que na prancha para "Galpão Beira-Mar" caber em uma
          linha: a palavra composta quebrava em "Beira-" / "Mar".
        */}
        <div className="mt-1.5 text-[12px] leading-[1.2] font-bold whitespace-nowrap text-ink">
          {valor}
        </div>
      </div>
    </div>
  );
}
