/**
 * Espelho de `dist/` para a verificação da prévia gerenciada.
 *
 * O app é Next e serve tudo pelo servidor: a build de verdade fica em `.next`.
 * A prévia, porém, confere a existência de `dist/` depois do build — convenção
 * de projeto estático. Este script cria essa pasta a partir do que o Next já
 * gerou, sem inventar build paralela: os assets estáticos são copiados e o
 * index.html é só um aviso, jamais servido em produção.
 */

import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const raiz = process.cwd();
const next = path.join(raiz, '.next');
const dist = path.join(raiz, 'dist');

if (!existsSync(next)) {
  console.error('[dist] .next não existe — rode `next build` antes.');
  process.exit(1);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const estaticos = path.join(next, 'static');
if (existsSync(estaticos)) {
  await cp(estaticos, path.join(dist, '_next', 'static'), { recursive: true });
}

await writeFile(
  path.join(dist, 'index.html'),
  `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Quórum</title>
  </head>
  <body>
    <p>Quórum é servido pelo servidor do Next (.next). Esta pasta existe apenas para a verificação de build.</p>
  </body>
</html>
`,
  'utf8',
);

console.log('[dist] pronto');
