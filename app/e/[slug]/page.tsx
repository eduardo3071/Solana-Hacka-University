import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  Lock,
  Plus,
  Users,
  Wallet,
} from 'lucide-react';

import { AcoesRapidas } from '@/components/AcoesRapidas';
import { BarraAbas } from '@/components/BarraAbas';
import { BarraProgresso } from '@/components/BarraProgresso';
import { CartaoBanner } from '@/components/CartaoBanner';
import { CartaoStat } from '@/components/CartaoStat';
import { Chip } from '@/components/Chip';
import { COR_DA_RUBRICA } from '@/components/acentos';
import { Hero } from '@/components/Hero';
import { LinhaLista } from '@/components/LinhaLista';
import { CorpoTela, Tela } from '@/components/Tela';
import { TileIcone } from '@/components/TileIcone';
import {
  ENTIDADE,
  LANCAMENTOS,
  PENDENTES,
  TOTAL_ENTROU,
  TOTAL_SAIU,
} from '@/lib/mock';
import {
  formatBRL,
  formatCompacto,
  formatComSinal,
  formatDataCurta,
} from '@/lib/format';

export const metadata = { title: 'Cofre · Quórum' };

/**
 * 5a · Cofre da entidade — e 6a, o cofre vazio de entidade recém-criada.
 *
 * Os três signatários NÃO aparecem aqui: foram para o perfil. Tirá-los é o que
 * dá respiro à tela.
 */
export default async function Cofre({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ estado?: string }>;
}) {
  const { slug } = await params;
  const { estado } = await searchParams;

  if (estado === 'vazio') return <CofreVazio slug={slug} />;

  return (
    <Tela>
      <Hero
        statusBar={{ hora: '21:34', direita: 'Wi-Fi · 82%' }}
        rotulo={`${ENTIDADE.tipo} · ${ENTIDADE.universidade}`}
        titulo={ENTIDADE.nome}
        subtitulo={`${ENTIDADE.associados} associados · diretoria ${ENTIDADE.diretoria}`}
        pilula={`${ENTIDADE.quorum.de} de ${ENTIDADE.quorum.entre}`}
      />

      <CorpoTela respiroAbas className="gap-[9px] pt-3">
        <CartaoBanner
          icone={Lock}
          acento="blue"
          titulo="Cofre com quórum"
          subtitulo={`Nenhuma saída sem ${ENTIDADE.quorum.de} assinaturas`}
        />

        <div className="grid grid-cols-2 gap-2.5">
          <CartaoStat
            rotulo="Saldo"
            valor={formatCompacto(ENTIDADE.saldoCentavos)}
            rodape="disponível"
            icone={Wallet}
            acento="blue"
          />
          <CartaoStat
            rotulo="Retido"
            valor={formatCompacto(ENTIDADE.retidoCentavos)}
            rodape={`${PENDENTES.length} propostas`}
            icone={Lock}
            acento="red"
            corDoNumero="red"
          />
          <CartaoStat
            rotulo="Entrou"
            valor={formatCompacto(TOTAL_ENTROU)}
            rodape="+8% este mês"
            icone={ArrowUp}
            acento="green"
            corDoNumero="green"
          />
          <CartaoStat
            rotulo="Saiu"
            valor={formatCompacto(TOTAL_SAIU)}
            rodape="este mês"
            icone={ArrowDown}
            acento="amber"
          />
        </div>

        <AcoesRapidas
          acoes={[
            {
              icone: Plus,
              rotulo: ['Propor', 'saída'],
              acento: 'blue',
              href: `/e/${slug}/propor`,
            },
            {
              icone: ArrowUp,
              rotulo: ['Cobrar', 'sócios'],
              acento: 'green',
              href: `/e/${slug}/cobrar`,
            },
            {
              icone: BookOpen,
              rotulo: ['Livro-', 'caixa'],
              acento: 'amber',
              href: `/e/${slug}/livro`,
            },
            {
              icone: Users,
              rotulo: ['Sócios', 'ativos'],
              acento: 'purple',
              href: `/e/${slug}/socios`,
            },
          ]}
        />

        <div className="mt-0.5 flex items-baseline justify-between">
          <h2 className="t-secao text-ink">Movimentações</h2>
          <a
            href={`/e/${slug}/livro`}
            className="t-chip whitespace-nowrap text-blue"
          >
            Ver todas ›
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          {LANCAMENTOS.slice(0, 3).map((l) => (
            <LinhaLista
              key={l.id}
              icone={l.tipo === 'entrada' ? ArrowUp : ArrowDown}
              acento={COR_DA_RUBRICA[l.rubrica]}
              titulo={l.curta ?? l.descricao}
              meta={
                <>
                  <Chip acento={COR_DA_RUBRICA[l.rubrica]}>{l.rubrica}</Chip>
                  <span className="t-meta text-ink-3">
                    {formatDataCurta(l.data)}
                  </span>
                </>
              }
              valor={formatComSinal(l.valorCentavos, l.tipo, {
                compacto: true,
                simbolo: false,
              })}
              corDoValor={l.tipo === 'entrada' ? 'green' : undefined}
            />
          ))}
        </div>
      </CorpoTela>

      <BarraAbas ativa="cofre" slug={slug} pendencias={PENDENTES.length} />
    </Tela>
  );
}

/**
 * 6a · Cofre vazio, entidade recém-criada.
 *
 * O vazio ensina o próximo passo, não apenas informa que está vazio: os três
 * passos do setup, com o atual em destaque azul e ação.
 */
function CofreVazio({ slug }: { slug: string }) {
  return (
    <Tela>
      <Hero
        statusBar={{ hora: '09:12', direita: '4G · 64%' }}
        rotulo={`${ENTIDADE.tipo} · ${ENTIDADE.universidade}`}
        titulo={ENTIDADE.nome}
        subtitulo="Criada hoje · 1 de 3 signatários"
        pilula="Em setup"
      />

      <CorpoTela respiroAbas>
        <div className="rounded-card border border-line bg-surface p-4">
          <div className="t-rotulo text-ink-2">Saldo em cofre</div>
          <div className="t-ancora mt-[11px] text-ink-3">{formatBRL(0)}</div>
          <p className="t-desc mt-[9px] text-pretty text-ink-2">
            Três passos e a atlética deixa de usar o Pix pessoal do tesoureiro.
          </p>
          <BarraProgresso className="mt-[13px]" valor={33} acento="blue" />
          <div className="t-rotulo mt-[9px] text-ink-3">1 de 3 concluído</div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-3 rounded-card border border-green/30 bg-green-tint p-3.5">
            <TileIcone icone={Check} acento="green" tamanho="md" />
            <div className="min-w-0 flex-1">
              <div className="t-item-sm text-ink">Entidade criada</div>
              <div className="t-desc mt-[5px] text-green-ink">
                {ENTIDADE.nome} · {ENTIDADE.tipo} · {ENTIDADE.universidade}
              </div>
            </div>
          </div>

          <div className="rounded-card border-[1.5px] border-blue bg-blue-tint p-[15px]">
            <div className="flex items-start gap-3">
              <div className="flex size-[34px] flex-none items-center justify-center rounded-tile-sm bg-[#0E2A42] text-[14px] leading-none font-extrabold text-blue">
                2
              </div>
              <div className="min-w-0 flex-1">
                <div className="t-item-sm text-ink">
                  Convide os dois outros signatários
                </div>
                <div className="t-desc mt-1.5 text-pretty text-blue-ink">
                  Presidente e conselho fiscal. Sem eles o cofre não consegue
                  formar quórum e nenhuma saída pode ser executada.
                </div>
              </div>
            </div>
            <a
              href={`/e/${slug}/convidar`}
              className="mt-[13px] block rounded-btn bg-blue py-[13px] text-center text-[13px] leading-none font-bold text-ground"
            >
              Convidar diretoria
            </a>
          </div>

          <div className="flex items-start gap-3 rounded-card border border-line bg-surface p-3.5">
            <div className="flex size-[34px] flex-none items-center justify-center rounded-tile-sm bg-line text-[14px] leading-none font-extrabold text-ink-3">
              3
            </div>
            <div className="min-w-0 flex-1">
              <div className="t-item-sm text-ink-2">
                Registre a chave Pix do cofre
              </div>
              <div className="t-desc mt-[5px] text-ink-3">
                O dinheiro passa a cair no cofre da entidade, não na conta de
                ninguém
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[11px] rounded-card border border-dashed border-dash bg-surface p-3.5">
          <TileIcone icone={BookOpen} acento="purple" tamanho="md" />
          <div className="min-w-0 flex-1">
            <div className="t-item-sm text-ink-2">
              Livro-caixa ainda sem lançamentos
            </div>
            <div className="t-meta mt-[5px] text-ink-3">
              A primeira entrada aparece aqui automaticamente
            </div>
          </div>
        </div>
      </CorpoTela>

      <BarraAbas ativa="cofre" slug={slug} />
    </Tela>
  );
}
