/**
 * Entrada por magic link.
 *
 * Placeholder do B4: o middleware já redireciona as rotas privadas para cá,
 * então a rota precisa existir. O fluxo de autenticação em si ainda não está
 * ligado — no plano de entrega, banco e login vêm depois das telas.
 */
export default function Entrar() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col justify-center gap-3 px-4">
      <p className="t-rotulo text-ink-3">Quórum</p>
      <h1 className="t-hero">Entrar</h1>
      <p className="t-desc text-ink-2">
        O acesso é por link enviado no e-mail. Sem senha.
      </p>
      <p className="t-meta mt-4 text-ink-3">
        Ainda não implementado — ver prompt B4.
      </p>
    </main>
  );
}
