/**
 * Confere uma rota contra as regras de layout do projeto.
 *
 *   npm run dev
 *   node scripts/conferir.mjs /estilo
 *
 * As regras do CLAUDE.md viram teste executável aqui, porque olhar print a
 * print não escala para 12 pranchas e é justamente esse tipo de erro —
 * sobreposição, chip em duas linhas, valor partido no meio — que apareceu em
 * todas as rodadas de auditoria do design.
 *
 * Sai com código 1 se alguma regra falhar, então serve em CI.
 */
import { chromium } from 'playwright';

const ROTA = process.argv[2] ?? '/estilo';
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LARGURA = 390;

// O ambiente já traz o Chromium; não baixe outro.
const EXECUTAVEL =
  process.env.CHROMIUM_PATH ??
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const navegador = await chromium.launch({
  executablePath: EXECUTAVEL,
  args: ['--no-sandbox'],
});
const pagina = await navegador.newPage({
  viewport: { width: LARGURA, height: 844 },
});

const resposta = await pagina.goto(BASE + ROTA, { waitUntil: 'networkidle' });
if (!resposta?.ok()) {
  console.error(`✗ ${ROTA} respondeu ${resposta?.status()}`);
  await navegador.close();
  process.exit(1);
}

const achados = await pagina.evaluate((largura) => {
  const problemas = [];

  /**
   * Quantas linhas o conteúdo ocupa de verdade.
   *
   * Contar retângulos não serve: um flex com dois filhos lado a lado produz
   * dois retângulos na mesma linha. O que importa é quantos topos distintos
   * existem — aí sim o texto desceu de linha.
   */
  const linhasDe = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const topos = [...r.getClientRects()]
      .filter((x) => x.width > 0 && x.height > 0)
      .map((x) => Math.round(x.top));
    return new Set(topos).size || 1;
  };

  // Nenhum texto se sobrepõe a outro.
  const folhas = [...document.querySelectorAll('div,span,p,h1,h2,a,strong')]
    .filter((e) => e.children.length === 0 && e.textContent.trim());
  for (let i = 0; i < folhas.length; i++) {
    const a = folhas[i].getBoundingClientRect();
    if (!a.width || !a.height) continue;
    for (let j = i + 1; j < folhas.length; j++) {
      const b = folhas[j].getBoundingClientRect();
      if (!b.width || !b.height) continue;
      const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (x > 2 && y > 2) {
        problemas.push(
          `sobreposição: "${folhas[i].textContent.trim().slice(0, 24)}" × "${folhas[j].textContent.trim().slice(0, 24)}"`,
        );
      }
    }
  }

  // Contêiner de layout não é trecho de texto: seus filhos ficam lado a lado
  // por definição, e medir quebra de linha nele não quer dizer nada.
  const ehContainer = (el) => {
    const d = getComputedStyle(el).display;
    return d === 'flex' || d === 'grid' || d === 'inline-flex' || d === 'inline-grid';
  };

  // Pílula, chip e etiqueta nunca quebram em duas linhas.
  for (const el of document.querySelectorAll('.t-chip')) {
    if (ehContainer(el) || el.innerHTML.includes('<br')) continue;
    if (linhasDe(el) > 1) {
      problemas.push(`chip em duas linhas: "${el.textContent.trim().slice(0, 24)}"`);
    }
  }

  // Número e valor monetário nunca quebram.
  for (const el of document.querySelectorAll('.t-valor,.t-ancora,.t-ancora-sm,.num')) {
    if (ehContainer(el)) continue;
    if (linhasDe(el) > 1) {
      problemas.push(`valor partido: "${el.textContent.trim().slice(0, 24)}"`);
    }
  }

  // Nada transborda a largura da prancha.
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > largura + 0.5 || r.left < -0.5)) {
      problemas.push(`transbordo: ${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)}`);
    }
  }

  // A página não rola na horizontal.
  if (document.documentElement.scrollWidth > largura + 0.5) {
    problemas.push(`rolagem horizontal: ${document.documentElement.scrollWidth}px`);
  }

  return [...new Set(problemas)];
}, LARGURA);

await navegador.close();

if (achados.length === 0) {
  console.log(`✓ ${ROTA} — nenhuma regra de layout violada`);
  process.exit(0);
}

console.error(`✗ ${ROTA} — ${achados.length} problema(s):`);
for (const a of achados) console.error('  ' + a);
process.exit(1);
