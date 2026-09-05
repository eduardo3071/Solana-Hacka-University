import { Calendar, MapPin, QrCode } from 'lucide-react';

import { Erro, Vazio } from '@/components/Estados';
import { Tela } from '@/components/Tela';
import { TileIcone } from '@/components/TileIcone';
import { eventoPorSlug } from '@/lib/dados';
import { criarClienteServidor } from '@/lib/supabase/server';

/** Página pública: o cartaz muda quando a diretoria muda o evento. */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evento = await eventoPorSlug(slug).catch(() => null);
  return { title: evento?.nome ?? 'Festa · Quórum' };
}

/**
 * 5d · Página da festa — pública, sem barra de abas, a mais vistosa.
 *
 * A única tela onde uma imagem grande é permitida. O cartão verde do Pix é a
 * proposta de valor inteira do produto.
 */
export default async function PaginaDaFesta({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let evento, entidade;
  try {
    evento = await eventoPorSlug(slug);
    if (evento) {
      const supabase = await criarClienteServidor();
      const { data } = await supabase
        .from('entidades')
        .select('nome, slug')
        .eq('id', evento.entidade_id)
        .maybeSingle();
      entidade = data;
    }
  } catch (e) {
    console.error('[festa] falha ao ler', e);
    return (
      <Tela>
        <div className="flex flex-1 flex-col justify-center px-4 py-10">
          <Erro titulo="Não conseguimos abrir a festa agora">
            A página não carregou. Tente de novo em instantes — o link continua
            valendo.
          </Erro>
        </div>
      </Tela>
    );
  }

  if (!evento) {
    return (
      <Tela>
        <div className="flex flex-1 flex-col justify-center gap-4 px-4 py-10">
          <Vazio titulo="Evento não encontrado">
            Nenhuma festa com esse endereço. Confira o link que você recebeu.
          </Vazio>
        </div>
      </Tela>
    );
  }

  const quando = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(evento.data));

  return (
    <Tela>
      <div className="relative h-60 flex-none overflow-hidden bg-[repeating-linear-gradient(135deg,#1F2D41_0_8px,#192434_8px_16px)]">
        <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/75 to-transparent" />
        <div className="absolute inset-x-4 bottom-4">
          <div className="t-rotulo text-blue">{entidade?.nome} apresenta</div>
          <h1 className="mt-2.5 text-[26px] leading-[1.1] font-extrabold tracking-[-0.035em] text-white">
            {evento.nome}
          </h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[11px] px-4 pt-3.5 pb-4">
        <div className="grid grid-cols-2 gap-2.5">
          <CartaoQuandoOnde
            icone={Calendar}
            acento="blue"
            rotulo="Quando"
            valor={quando}
          />
          <CartaoQuandoOnde
            icone={MapPin}
            acento="purple"
            rotulo="Onde"
            valor={evento.local ?? 'a definir'}
          />
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
        <p className="text-center text-[12.5px] leading-[1.4] text-ink-3">
          Livro-caixa da entidade aberto em{' '}
          <a href={`/e/${entidade?.slug}/livro`} className="text-blue">
            quorum.app/{entidade?.slug}
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
        <div className="mt-1.5 truncate text-[12px] leading-[1.2] font-bold text-ink">
          {valor}
        </div>
      </div>
    </div>
  );
}
