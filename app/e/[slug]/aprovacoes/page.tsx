import { notFound } from 'next/navigation';
import { BookOpen, Check, Info, Lock, WifiOff } from 'lucide-react';

import { BarraAbas } from '@/components/BarraAbas';
import { BarraProgresso } from '@/components/BarraProgresso';
import { BlocoBloqueio } from '@/components/BlocoBloqueio';
import { Botao } from '@/components/Botao';
import { Chip } from '@/components/Chip';
import { COR_DA_RUBRICA } from '@/components/acentos';
import { Hero } from '@/components/Hero';
import { IndicadorAssinaturas } from '@/components/IndicadorAssinaturas';
import { LinhaDetalhe, ListaDetalhes } from '@/components/LinhaDetalhe';
import { CorpoTela, RotuloSecao, Tela } from '@/components/Tela';
import { PainelCofre } from '@/components/vivo/PainelCofre';
import { TileIcone } from '@/components/TileIcone';
import {
  AGORA,
  ENTIDADE,
  PENDENTES,
  PROPOSTA_RETIDA,
  membro,
} from '@/lib/mock';
import {
  formatBRL,
  formatCompacto,
  formatComSinal,
  formatHora,
  formatQuando,
} from '@/lib/format';

export const metadata = { title: 'Aprovações · Quórum' };

/**
 * 5b · Aprovações — a tela do vídeo — e os quatro estados que vivem nela:
 * recusada (6b), executada (6c), executando (6d) e offline (6e).
 *
 * O hero carrega o estado: vermelho no bloqueio e no erro, âmbar em curso,
 * verde no concluído.
 */
export default async function Aprovacoes({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ estado?: string }>;
}) {
  const { slug } = await params;
  const { estado } = await searchParams;

  switch (estado) {
    case undefined:
      return <ListaDeAprovacoes slug={slug} />;
    // O mesmo desenho, ligado ao cofre de verdade na devnet.
    case 'vivo':
      return <AprovacoesAoVivo slug={slug} />;
    case 'recusada':
      return <PropostaRecusada slug={slug} />;
    case 'executando':
      return <Executando slug={slug} />;
    case 'executada':
      return <Executada slug={slug} />;
    case 'offline':
      return <Offline slug={slug} />;
    default:
      notFound();
  }
}

/* ── 5b · a lista ───────────────────────────────────────────────────────── */

function ListaDeAprovacoes({ slug }: { slug: string }) {
  const emFoco = PROPOSTA_RETIDA;
  if (!emFoco) notFound();

  const autor = membro(emFoco.criadoPorId);
  const outras = PENDENTES.filter((p) => p.id !== emFoco.id);

  return (
    <Tela>
      <Hero
        variante="red"
        statusBar={{ hora: '21:34', direita: 'Wi-Fi · 82%' }}
        rotulo={ENTIDADE.nome}
        titulo="Aprovações"
        subtitulo={
          <span className="num">{formatBRL(ENTIDADE.retidoCentavos)} retidos</span>
        }
        pilula={`${PENDENTES.length} pendentes`}
      />

      <CorpoTela respiroAbas>
        <RotuloSecao>Aguardando a segunda assinatura</RotuloSecao>

        <article className="rounded-card border border-line bg-surface-2 p-[15px]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="t-item text-ink">{emFoco.destino}</h2>
              <div className="num mt-1.5 text-[12.5px] leading-[1.3] font-normal text-ink-3">
                chave {emFoco.chave}
              </div>
            </div>
            <div className="t-valor text-ink">
              {formatComSinal(emFoco.valorCentavos, 'saida', { compacto: true })}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-[7px]">
            <Chip acento={COR_DA_RUBRICA[emFoco.rubrica]}>{emFoco.rubrica}</Chip>
            <span className="t-meta text-ink-3">
              {autor.nome} · {formatQuando(emFoco.criadoEm, AGORA)}
            </span>
          </div>

          <div className="my-3.5 h-px bg-line" />

          <IndicadorAssinaturas
            assinaturas={emFoco.assinaturas.map((a) => ({
              nome: membro(a.membroId).nome,
              hora: formatHora(a.em),
            }))}
            necessarias={emFoco.necessarias}
          />

          <BlocoBloqueio className="mt-3.5">
            Falta a assinatura da presidente ou do conselho fiscal. Ao assinar,
            a saída é executada na hora.
          </BlocoBloqueio>

          {/*
            A Marina já assinou. O botão dela é cobrar quem falta — oferecer
            "Assinar" a quem já assinou seria mentir sobre o que o toque faz.
          */}
          <Botao className="mt-3" href={`/e/${slug}/aprovacoes?estado=executando`}>
            Cobrar a segunda assinatura
          </Botao>
        </article>

        <RotuloSecao>Sem sua assinatura ainda</RotuloSecao>

        <div className="flex flex-col gap-2.5">
          {outras.map((p) => (
            <a
              key={p.id}
              href={`/e/${slug}/aprovacoes/${p.id}`}
              className="flex min-h-[62px] items-center gap-[11px] rounded-card border border-line bg-surface px-[13px] py-3"
            >
              <TileIcone icone={Lock} acento="red" tamanho="lg" />
              <div className="min-w-0 flex-1">
                <div className="t-item-sm truncate text-ink">{p.destino}</div>
                <div className="mt-[5px] flex items-center gap-[7px]">
                  <Chip acento={COR_DA_RUBRICA[p.rubrica]}>{p.rubrica}</Chip>
                  <span className="num t-meta text-ink-3">
                    {p.assinaturas.length} de {p.necessarias}
                  </span>
                </div>
              </div>
              <span className="t-valor text-red">
                {formatCompacto(p.valorCentavos, { simbolo: false })}
              </span>
            </a>
          ))}
        </div>

        <p className="t-meta text-pretty text-ink-3">
          Enquanto o quórum não fecha, o valor permanece no cofre. Nenhuma
          cobrança é feita e nada é enviado ao banco.
        </p>
      </CorpoTela>

      <BarraAbas ativa="aprovar" slug={slug} pendencias={PENDENTES.length} />
    </Tela>
  );
}

/* ── 5b ao vivo · o bloqueio vindo da rede ──────────────────────────────── */

function AprovacoesAoVivo({ slug }: { slug: string }) {
  return (
    <Tela>
      <Hero
        variante="red"
        statusBar={{ hora: '21:34', direita: 'Wi-Fi · 82%' }}
        rotulo={ENTIDADE.nome}
        titulo="Aprovações"
        subtitulo="Cofre 2 de 3 na devnet"
        pilula="ao vivo"
      />

      <CorpoTela respiroAbas>
        <RotuloSecao>Aguardando a segunda assinatura</RotuloSecao>
        <PainelCofre />
      </CorpoTela>

      <BarraAbas ativa="aprovar" slug={slug} pendencias={PENDENTES.length} />
    </Tela>
  );
}

/* ── 6b · recusada ──────────────────────────────────────────────────────── */

function PropostaRecusada({ slug }: { slug: string }) {
  const p = PENDENTES[1];
  const quemRecusou = membro('lm');

  return (
    <Tela>
      <Hero
        variante="red"
        statusBar={{ hora: '09:41', direita: '4G · 61%' }}
        rotulo={ENTIDADE.nome}
        titulo="Proposta recusada"
        subtitulo="Nenhum valor saiu do cofre"
        pilula="Arquivável"
      />

      <CorpoTela respiroAbas>
        <article className="rounded-card border border-line bg-surface-2 p-[15px]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className="t-item text-ink-2">{p.destino}</h2>
              <div className="num text-[12.5px] leading-[17px] font-normal text-ink-3">
                chave {p.chave}
              </div>
            </div>
            <div className="t-valor text-ink-3 line-through">
              {formatCompacto(p.valorCentavos)}
            </div>
          </div>

          <div className="mt-[11px] flex items-center gap-[7px]">
            <Chip acento={COR_DA_RUBRICA[p.rubrica]}>{p.rubrica}</Chip>
            <Chip acento="red">Recusada</Chip>
            <span className="t-meta text-ink-3">Rafael · ontem 20:05</span>
          </div>

          <div className="my-3.5 h-px bg-line" />

          <div className="flex items-center gap-3">
            {/* Avatar neutro: vermelho não é pessoa. */}
            <div className="flex size-9 flex-none items-center justify-center rounded-avatar bg-surface-2 text-[12.5px] leading-none font-bold text-ink-2">
              LM
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
              <div className="t-item-sm text-ink">
                {quemRecusou.nome} recusou
              </div>
              <div className="text-[12px] leading-[17px] font-normal text-ink-3">
                Presidente · hoje, 09:41
              </div>
            </div>
          </div>

          <div className="mt-[13px] rounded-tile bg-red-tint p-3.5">
            <div className="t-rotulo text-red">Motivo da recusa</div>
            <p className="t-corpo mt-2 text-pretty text-red-ink">
              O orçamento de brindes é de {formatBRL(150000)} e já usamos{' '}
              {formatBRL(90000)} com as canecas. Refaça com o valor certo ou
              traga o aditivo aprovado em assembleia.
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Botao href={`/e/${slug}/propor`}>Refazer proposta</Botao>
            <Botao variante="secundario">Arquivar</Botao>
          </div>
        </article>

        <CartaoInfo
          titulo="A recusa fica no livro-caixa"
          detalhe="Registrada como evento, sem valor. ref 5b90-1f47"
        />
      </CorpoTela>

      <BarraAbas ativa="aprovar" slug={slug} pendencias={2} />
    </Tela>
  );
}

/* ── 6d · executando ────────────────────────────────────────────────────── */

function Executando({ slug }: { slug: string }) {
  const p = PROPOSTA_RETIDA!;

  return (
    <Tela>
      <Hero
        variante="amber"
        statusBar={{ hora: '21:36', direita: 'Wi-Fi · 82%' }}
        rotulo={`${p.destino} · ${p.rubrica}`}
        titulo="Executando a saída"
        subtitulo="Pode fechar o app · avisamos ao terminar"
        pilula="Em curso"
        className="pb-[26px]"
      />

      <CorpoTela respiroAbas className="gap-3.5">
        <div className="rounded-card border border-line bg-surface p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="t-rotulo text-ink-2">Valor da saída</div>
              <div className="t-ancora mt-[11px] text-ink">
                {formatComSinal(p.valorCentavos, 'saida')}
              </div>
            </div>
            <div className="text-right">
              <div className="num text-[20px] leading-none font-extrabold tracking-[-0.035em] text-amber">
                7s
              </div>
              <div className="mt-1.5 text-[10.5px] leading-none text-ink-3">
                decorridos
              </div>
            </div>
          </div>
          <BarraProgresso className="mt-3.5" valor={72} acento="amber" />
          <div className="mt-[9px] text-[11.5px] leading-none text-ink-3">
            Passo 3 de 4 · normalmente 3 a 12 segundos
          </div>
        </div>

        {/*
          Linha do tempo vertical de quatro passos, não spinner: o estudante
          precisa ver o que já aconteceu e o que falta. Cada passo tem duas
          linhas empilhadas com respiro real — nada se sobrepõe.
        */}
        <ol className="rounded-card border border-line bg-surface p-4">
          <Passo
            estado="feito"
            titulo="1ª assinatura registrada"
            detalhe="Marina Salgado · 18:12"
          />
          <Passo
            estado="feito"
            titulo="2ª assinatura registrada"
            detalhe="Letícia Marchetti · 21:36 · quórum atingido"
            conectorGradiente
          />
          <Passo estado="agora" titulo="Enviando ao banco" detalhe="Aguardando a confirmação da transação">
            <BarraProgresso className="mt-[11px]" valor={64} acento="amber" />
          </Passo>
          <Passo
            estado="futuro"
            titulo="Comprovante no livro-caixa"
            detalhe="Publicado automaticamente aos associados"
            ultimo
          />
        </ol>

        <CartaoInfo
          titulo="Não é mais possível cancelar"
          detalhe="As duas assinaturas já foram registradas no cofre"
        />

        <Botao variante="secundario" href={`/e/${slug}/aprovacoes?estado=executada`}>
          Ver o comprovante
        </Botao>
      </CorpoTela>

      <BarraAbas ativa="aprovar" slug={slug} pendencias={2} />
    </Tela>
  );
}

function Passo({
  estado,
  titulo,
  detalhe,
  children,
  ultimo = false,
  conectorGradiente = false,
}: {
  estado: 'feito' | 'agora' | 'futuro';
  titulo: string;
  detalhe: string;
  children?: React.ReactNode;
  ultimo?: boolean;
  conectorGradiente?: boolean;
}) {
  const marcador =
    estado === 'feito' ? (
      <div className="flex size-8 items-center justify-center rounded-tile-sm bg-green-tint">
        <Check size={16} strokeWidth={2.2} className="text-green" aria-hidden />
      </div>
    ) : estado === 'agora' ? (
      <div className="flex size-8 items-center justify-center rounded-tile-sm border-[1.5px] border-amber bg-amber-tint">
        <div className="size-[9px] rounded-full bg-amber" />
      </div>
    ) : (
      <div className="size-8 rounded-tile-sm border-[1.5px] border-dashed border-dash" />
    );

  const corTitulo =
    estado === 'agora' ? 'text-amber' : estado === 'futuro' ? 'text-ink-3' : 'text-ink';

  return (
    <li className="flex gap-[13px]">
      <div className="flex w-8 flex-none flex-col items-center">
        {marcador}
        {!ultimo && (
          <div
            className={`my-1 w-0.5 flex-1 ${
              conectorGradiente
                ? 'bg-gradient-to-b from-green to-amber'
                : estado === 'feito'
                  ? 'bg-green'
                  : 'bg-line'
            }`}
          />
        )}
      </div>
      <div className={`flex min-w-0 flex-1 flex-col gap-1 ${ultimo ? '' : 'pb-5'}`}>
        <div className={`t-item ${corTitulo}`}>{titulo}</div>
        <div className="text-[12.5px] leading-[18px] font-normal text-ink-2">
          {detalhe}
        </div>
        {children}
      </div>
    </li>
  );
}

/* ── 6c · executada ─────────────────────────────────────────────────────── */

function Executada({ slug }: { slug: string }) {
  const p = PROPOSTA_RETIDA!;
  const saldoDepois = ENTIDADE.saldoCentavos - p.valorCentavos;

  return (
    <Tela>
      <Hero
        variante="green"
        statusBar={{ hora: '21:36', direita: 'Wi-Fi · 82%' }}
      >
        <div className="mt-4 flex items-center gap-[11px]">
          <div className="flex size-[38px] flex-none items-center justify-center rounded-tile border border-white/30 bg-white/20">
            <Check size={20} strokeWidth={2.1} className="text-white" aria-hidden />
          </div>
          <div>
            <h1 className="t-hero text-white">Saída executada</h1>
            <div className="mt-1 text-[12.5px] leading-[1.4] font-medium text-white/90">
              Quórum de {ENTIDADE.quorum.de} de {ENTIDADE.quorum.entre} cumprido
            </div>
          </div>
        </div>
      </Hero>

      <CorpoTela respiroAbas>
        <article className="overflow-hidden rounded-card border border-line bg-surface">
          <div className="border-b border-line p-4">
            <div className="t-rotulo text-ink-2">Comprovante de saída</div>
            <div className="t-ancora mt-[11px] text-ink">
              {formatComSinal(p.valorCentavos, 'saida')}
            </div>
            <div className="mt-[11px] flex items-center gap-[7px]">
              <Chip acento={COR_DA_RUBRICA[p.rubrica]}>{p.rubrica}</Chip>
              <Chip acento="green">Executada</Chip>
              <span className="num t-meta text-ink-3">03 set · 21:36</span>
            </div>
          </div>

          <div className="border-b border-line px-4 py-3.5">
            <ListaDetalhes>
              <LinhaDetalhe rotulo="Destinatário">{p.destino}</LinhaDetalhe>
              <LinhaDetalhe rotulo="Chave" mono>
                {p.chave}
              </LinhaDetalhe>
              {/* Saldo em branco: azul é ação e link, não valor estático. */}
              <LinhaDetalhe rotulo="Saldo após" destaque>
                {formatBRL(saldoDepois)}
              </LinhaDetalhe>
            </ListaDetalhes>
          </div>

          <div className="border-b border-line px-4 py-3.5">
            <div className="t-rotulo mb-3 text-ink-2">Assinaturas</div>
            <IndicadorAssinaturas
              assinaturas={[
                { nome: 'Marina Salgado', hora: '18:12' },
                { nome: 'Letícia Marchetti', hora: '21:36' },
              ]}
              necessarias={2}
              legenda="Marina 18:12 · Letícia 21:36"
            />
          </div>

          <div className="px-4 py-3.5">
            <div className="t-rotulo text-ink-2">Referência da transação</div>
            <div className="mt-2 font-mono text-[12px] leading-[1.55] break-all text-ink">
              E60746948202609032136s8f3c2ad94471b0e6
            </div>
          </div>
        </article>

        <div className="grid grid-cols-2 gap-2">
          <Botao>Baixar comprovante</Botao>
          <Botao variante="secundario" href={`/e/${slug}/livro`}>
            Ver no livro-caixa
          </Botao>
        </div>

        {/* Esta linha é a tese do produto. */}
        <div className="flex items-center gap-[11px] rounded-card border border-green/30 bg-green-tint px-3.5 py-[13px]">
          <TileIcone icone={BookOpen} acento="green" tamanho="md" />
          <div className="min-w-0 flex-1">
            <div className="t-item-sm text-ink">Publicado no livro-caixa</div>
            <div className="t-meta mt-[5px] text-green-ink">
              Visível aos {ENTIDADE.associados} associados agora
            </div>
          </div>
        </div>
      </CorpoTela>

      <BarraAbas ativa="aprovar" slug={slug} pendencias={2} />
    </Tela>
  );
}

/* ── 6e · offline ───────────────────────────────────────────────────────── */

function Offline({ slug }: { slug: string }) {
  const p = PROPOSTA_RETIDA!;

  return (
    <Tela>
      <Hero
        variante="red"
        statusBar={{ hora: '21:38', direita: 'Sem rede' }}
        rotulo={ENTIDADE.nome}
        titulo="Aprovações"
        subtitulo="Offline desde 21:38"
        pilula="Offline"
      />

      <CorpoTela respiroAbas>
        <div className="rounded-card bg-red-tint p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-[34px] flex-none items-center justify-center rounded-tile-sm bg-ground/30">
              <WifiOff size={18} strokeWidth={1.8} className="text-red" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="t-item text-ink">O celular está sem internet</h2>
              <p className="t-desc mt-[7px] text-pretty text-red-ink">
                Não conseguimos falar com o cofre agora. Nada foi perdido: sua
                assinatura fica guardada aqui e é enviada sozinha quando a
                conexão voltar.
              </p>
            </div>
          </div>
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <Botao>Tentar de novo</Botao>
            <Botao variante="secundario">Ver offline</Botao>
          </div>
        </div>

        <RotuloSecao>Guardado no celular</RotuloSecao>

        <div className="rounded-card border border-line bg-surface p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="t-item-sm text-ink">{p.destino}</div>
              <div className="num mt-1.5 text-[12px] leading-[1.3] text-ink-3">
                chave {p.chave}
              </div>
            </div>
            <div className="t-valor text-ink">
              {formatComSinal(p.valorCentavos, 'saida', { compacto: true })}
            </div>
          </div>
          <div className="mt-[11px] flex items-center gap-[7px]">
            <Chip acento={COR_DA_RUBRICA[p.rubrica]}>{p.rubrica}</Chip>
            <Chip acento="amber">Na fila</Chip>
          </div>
          <BarraProgresso className="mt-[13px]" valor={50} acento="amber" />
          <p className="mt-[9px] text-[11.5px] leading-[1.4] text-ink-2">
            Sua assinatura será enviada assim que a internet voltar
          </p>
        </div>

        <div className="flex items-center gap-[11px] rounded-card border border-line bg-surface px-3.5 py-[13px]">
          <TileIcone icone={Lock} acento="blue" tamanho="md" />
          <div className="min-w-0 flex-1">
            <div className="t-item-sm text-ink">
              Nenhum valor sai do cofre offline
            </div>
            <div className="t-meta mt-[5px] text-ink-2">
              Última sincronização hoje, 21:34 · 3 propostas em cache
            </div>
          </div>
        </div>
      </CorpoTela>

      <BarraAbas ativa="aprovar" slug={slug} pendencias={PENDENTES.length} />
    </Tela>
  );
}

/* ── comum ──────────────────────────────────────────────────────────────── */

function CartaoInfo({ titulo, detalhe }: { titulo: string; detalhe: string }) {
  return (
    <div className="flex items-start gap-[11px] rounded-card border border-line bg-surface p-3.5">
      <TileIcone icone={Info} acento="blue" tamanho="md" />
      <div className="min-w-0 flex-1">
        <div className="t-item-sm text-ink">{titulo}</div>
        <div className="t-meta mt-[5px] text-ink-2">{detalhe}</div>
      </div>
    </div>
  );
}
