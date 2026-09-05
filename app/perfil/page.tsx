import {
  Building2,
  Check,
  ChevronRight,
  Lock,
  LogOut,
  Plus,
  User,
} from 'lucide-react';

import { BarraAbas } from '@/components/BarraAbas';
import { BarraProgresso } from '@/components/BarraProgresso';
import { Botao } from '@/components/Botao';
import { Hero } from '@/components/Hero';
import { CorpoTela, RotuloSecao, Tela } from '@/components/Tela';
import { TileIcone } from '@/components/TileIcone';
import { ENTIDADE, PENDENTES, USUARIA, nomeDoPapel } from '@/lib/mock';
import { formatCompacto } from '@/lib/format';

export const metadata = { title: 'Perfil · Quórum' };

/**
 * 5e · Perfil e carteirinha na mesma tela — e 6f, a troca de diretoria.
 *
 * O cartão de perfil fica ABAIXO do hero, não por trás dele: a sobreposição
 * cortava o nome atrás da faixa azul, que foi o erro mais visível da auditoria.
 */
export default async function Perfil({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  if (estado === 'troca') return <TrocaDeDiretoria />;

  const eu = USUARIA();

  return (
    <Tela>
      <Hero
        statusBar={{ hora: '21:34', direita: 'Wi-Fi · 82%' }}
        titulo="Perfil"
      />

      <CorpoTela respiroAbas className="pt-3">
        <section className="flex-none rounded-card border border-line bg-surface">
          <div className="flex items-center gap-[13px] p-3.5">
            <div className="flex size-[52px] flex-none items-center justify-center rounded-full bg-blue text-[20px] leading-none font-extrabold text-ground">
              {eu.nome.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="t-secao text-ink">{eu.nome}</h2>
              <div className="mt-[5px] truncate text-[12px] leading-[1.3] text-ink-3">
                {eu.email}
              </div>
              <div className="mt-2 flex gap-[7px]">
                <span className="t-chip rounded-chip bg-blue-tint px-[7px] py-[5px] text-blue">
                  {nomeDoPapel[eu.papel]}
                </span>
                <span className="t-chip rounded-chip bg-green-tint px-[7px] py-[5px] text-green">
                  Assinante
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-line">
            <Numero
              valor={formatCompacto(ENTIDADE.saldoCentavos)}
              rotulo="Sob sua guarda"
              borda
            />
            <Numero valor="128" rotulo="Assinaturas" borda />
            <Numero valor="Mar 2026" rotulo="Na diretoria desde" />
          </div>
        </section>

        {/* Carteirinha — para mostrar na portaria da festa. */}
        <section
          className="flex-none overflow-hidden rounded-card p-4"
          style={{
            backgroundImage:
              'radial-gradient(64px 44px at 88% 16%,rgba(255,255,255,.16) 0 60%,transparent 61%),' +
              'radial-gradient(84px 54px at 8% 96%,rgba(255,255,255,.16) 0 60%,transparent 61%),' +
              'linear-gradient(160deg,#1E88E5,#29A3F5 52%,#1B7FD4)',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="t-rotulo whitespace-nowrap text-white/80">
              {ENTIDADE.nome} · {ENTIDADE.universidade}
            </span>
            <span className="t-chip flex-none rounded-chip border border-white/30 bg-ground/32 px-2 py-[5px] text-white">
              Sócia
            </span>
          </div>

          <div className="mt-3.5 text-[22px] leading-[1.15] font-extrabold tracking-[-0.03em] text-white">
            {eu.nome}
          </div>
          <div className="mt-[5px] text-[12.5px] leading-[1.4] font-medium text-white/88">
            {nomeDoPapel[eu.papel]} · diretoria {ENTIDADE.diretoria}
          </div>

          <div className="mt-4 flex gap-[22px]">
            <CampoCarteirinha rotulo="Sócio nº" valor="0142" />
            <CampoCarteirinha rotulo="Validade" valor="31/12/2026" />
          </div>

          <div className="mt-3.5 rounded-tile-sm bg-ground/34 px-[11px] py-[9px] font-mono text-[11px] leading-none tracking-[0.02em] text-white/92">
            ref 4c71-90ab-22e5-0142
          </div>
        </section>

        <div className="flex flex-none flex-col gap-[9px]">
          <LinhaPerfil
            icone={User}
            acento="blue"
            titulo="Dados pessoais"
            detalhe="Nome, curso, matrícula"
          />
          <LinhaPerfil
            icone={Building2}
            acento="purple"
            titulo="Entidade"
            detalhe={`${ENTIDADE.nome} · ${ENTIDADE.universidade}`}
          />
          <LinhaPerfil
            icone={Check}
            acento="green"
            titulo="Assinatura digital"
            detalhe="Chave e dispositivo"
          />
          <LinhaPerfil
            icone={LogOut}
            acento="amber"
            titulo="Troca de diretoria"
            detalhe="Gestão 2026 → 2027"
            href="/perfil?estado=troca"
          />
        </div>

        <p className="my-0.5 text-center text-[11.5px] leading-none text-ink-3">
          Quórum v0.1
        </p>
      </CorpoTela>

      <BarraAbas ativa="perfil" slug={ENTIDADE.slug} pendencias={PENDENTES.length} />
    </Tela>
  );
}

/* ── 6f · troca de diretoria ────────────────────────────────────────────── */

function TrocaDeDiretoria() {
  return (
    <Tela>
      <Hero
        variante="purple"
        statusBar={{ hora: '10:04', direita: 'Wi-Fi · 78%' }}
        rotulo={ENTIDADE.nome}
        titulo="Troca de diretoria"
        subtitulo={
          <>
            Gestão 2026 → Gestão 2027
            <br />
            Vigência 01 jan 2027
          </>
        }
        pilula="1 de 2"
      />

      <CorpoTela respiroAbas className="gap-2 pt-3">
        <RotuloSecao>Saem do cofre · 31 dez 2026</RotuloSecao>

        <div className="flex items-center gap-[11px] rounded-[14px] border border-line bg-surface px-[13px] py-[11px] opacity-55">
          <div className="flex flex-none gap-1.5">
            <AvatarNeutro>LM</AvatarNeutro>
            <AvatarNeutro>MS</AvatarNeutro>
          </div>
          <div className="min-w-0 flex-1">
            <div className="t-item-sm text-ink line-through">
              Letícia e Marina
            </div>
            <div className="mt-[5px] text-[11.5px] leading-[1.3] whitespace-nowrap text-ink-2">
              Presidente e tesoureira
            </div>
          </div>
          <LogOut size={16} strokeWidth={1.7} className="flex-none text-ink-2" aria-hidden />
        </div>

        <RotuloSecao>Entram no cofre · 01 jan 2027</RotuloSecao>

        <div className="flex items-center gap-[11px] rounded-[14px] border-[1.5px] border-blue bg-blue-tint px-[13px] py-[11px]">
          <div className="flex size-[34px] flex-none items-center justify-center rounded-tile-sm bg-[#0E2A42] text-[12.5px] leading-none font-bold text-blue">
            CB
          </div>
          <div className="min-w-0 flex-1">
            <div className="t-item-sm text-ink">Caio Bertoldi</div>
            <div className="mt-[5px] text-[11.5px] leading-[1.3] text-blue-ink">
              Presidente · aceitou em 28 nov
            </div>
          </div>
          <Check size={16} strokeWidth={2} className="flex-none text-green" aria-hidden />
        </div>

        <div className="flex items-center gap-[11px] rounded-[14px] border border-line bg-surface px-[13px] py-[11px]">
          <div className="flex size-[34px] flex-none items-center justify-center rounded-tile-sm border-[1.5px] border-dashed border-dash text-[12px] leading-none font-bold text-ink-3">
            JP
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
            <div className="t-item-sm text-ink">Júlia Prazeres</div>
            <div className="text-[11.5px] leading-[16px] text-amber">
              Tesoureira · convite há 2 dias
            </div>
          </div>
          <span className="t-chip flex-none rounded-chip bg-amber-tint px-[7px] py-[5px] text-amber">
            Aguardando
          </span>
        </div>

        <div className="flex items-center gap-[11px] rounded-[14px] border border-line bg-surface px-[13px] py-[11px]">
          <div className="flex size-[34px] flex-none items-center justify-center rounded-tile-sm bg-green-tint text-[12.5px] leading-none font-bold text-green">
            RT
          </div>
          <div className="min-w-0 flex-1">
            <div className="t-item-sm text-ink">Rafael Tonetto</div>
            <div className="mt-[5px] text-[11.5px] leading-[1.3] text-ink-2">
              Conselho fiscal · permanece
            </div>
          </div>
          <span className="t-chip flex-none rounded-chip bg-green-tint px-[7px] py-[5px] text-green">
            Mantido
          </span>
        </div>

        <div className="mt-1.5 rounded-card border border-line bg-surface p-3.5">
          <div className="flex items-start gap-[11px]">
            <TileIcone icone={Lock} acento="blue" tamanho="md" />
            <div className="min-w-0 flex-1">
              <div className="t-item-sm text-ink">
                A troca exige {ENTIDADE.quorum.de} de {ENTIDADE.quorum.entre} da
                gestão atual
              </div>
              <div className="t-meta mt-[5px] text-ink-2">
                O histórico não muda
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
            <div className="flex flex-none gap-[7px]">
              <div className="flex size-9 items-center justify-center rounded-avatar bg-green-tint text-[12.5px] leading-none font-bold text-green">
                RT
              </div>
              <div className="flex size-9 items-center justify-center rounded-avatar border-[1.5px] border-dashed border-dash">
                <Plus size={16} strokeWidth={1.7} className="text-ink-3" aria-hidden />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="num text-[13px] leading-[1.2] font-bold text-amber">
                1 de 2 assinaturas
              </div>
              <div className="mt-[5px] text-[12px] leading-[1.3] text-ink-2">
                Rafael assinou · falta você
              </div>
            </div>
          </div>

          <BarraProgresso className="mt-3" valor={50} acento="amber" />
          <Botao className="mt-[13px]">Assinar a troca</Botao>
        </div>
      </CorpoTela>

      <BarraAbas ativa="perfil" slug={ENTIDADE.slug} pendencias={PENDENTES.length} />
    </Tela>
  );
}

/* ── peças ──────────────────────────────────────────────────────────────── */

function Numero({
  valor,
  rotulo,
  borda = false,
}: {
  valor: string;
  rotulo: string;
  borda?: boolean;
}) {
  return (
    <div className={`p-3 ${borda ? 'border-r border-line' : ''}`}>
      <div className="num text-[15px] leading-none font-extrabold tracking-[-0.03em] text-ink">
        {valor}
      </div>
      <div className="mt-1.5 text-[10.5px] leading-[1.3] text-ink-3">
        {rotulo}
      </div>
    </div>
  );
}

function CampoCarteirinha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <div className="t-rotulo whitespace-nowrap text-white/72">{rotulo}</div>
      <div className="num mt-1.5 text-[13px] leading-none font-bold text-white">
        {valor}
      </div>
    </div>
  );
}

function AvatarNeutro({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-[34px] items-center justify-center rounded-tile-sm bg-line text-[12.5px] leading-none font-bold text-ink-2">
      {children}
    </div>
  );
}

function LinhaPerfil({
  icone,
  acento,
  titulo,
  detalhe,
  href,
}: {
  icone: typeof User;
  acento: 'blue' | 'green' | 'amber' | 'purple';
  titulo: string;
  detalhe: string;
  href?: string;
}) {
  const conteudo = (
    <>
      <TileIcone icone={icone} acento={acento} tamanho="md" />
      <div className="min-w-0 flex-1">
        <div className="t-item-sm text-ink">{titulo}</div>
        <div className="mt-[5px] truncate text-[11.5px] leading-[1.3] text-ink-3">
          {detalhe}
        </div>
      </div>
      <ChevronRight size={16} strokeWidth={1.7} className="flex-none text-ink-3" aria-hidden />
    </>
  );

  const classe =
    'flex min-h-[58px] items-center gap-[11px] rounded-[14px] border border-line bg-surface px-[13px] py-[11px]';

  return href ? (
    <a href={href} className={classe}>
      {conteudo}
    </a>
  ) : (
    <div className={classe}>{conteudo}</div>
  );
}
