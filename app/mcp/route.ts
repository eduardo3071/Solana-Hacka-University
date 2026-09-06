/**
 * O endereço do servidor MCP: `/mcp`.
 *
 * O adaptador do pacote existe para Vite/TanStack; aqui o app é Next, então o
 * handler de protocolo (que fala Web Request/Response) é ligado à mão a um
 * Route Handler. Toda a lógica das ferramentas vive em `lib/mcp/` — este
 * arquivo é só a tomada.
 *
 * `nodejs` porque o handler usa APIs de Node, como todo endpoint deste app.
 */
import { createMcpProtocolHandler } from '@lovable.dev/mcp-js/protocols/mcp';

import mcp from '@/lib/mcp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = createMcpProtocolHandler(mcp);

export const GET = (req: Request) => handler(req);
export const POST = (req: Request) => handler(req);
export const DELETE = (req: Request) => handler(req);
export const OPTIONS = (req: Request) => handler(req);
