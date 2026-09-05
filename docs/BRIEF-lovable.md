# Briefing para o Lovable

Cole daqui para baixo. Anexe as pranchas de `design/` (4a e 5a–5e) — sem elas o
Lovable reinventa o sistema visual e você perde uma rodada.

---

Construa a interface do **Quórum**: tesouraria para entidades estudantis
brasileiras — atléticas, comissões de formatura, empresas juniores.

O dinheiro da entidade fica num **cofre que exige duas assinaturas de três**
para qualquer saída, e o **livro-caixa é aberto aos associados, sem login**. O
problema que resolve: hoje o dinheiro da atlética passa pelo Pix pessoal do
tesoureiro e ninguém consegue conferir nada.

## O que já existe e você NÃO vai construir

O backend está pronto e no ar. Você constrói **só a interface**.

- **API:** `https://solana-hacka-university.vercel.app` — contrato completo no
  arquivo `docs/API.md` que estou anexando. Leia inteiro antes de começar.
- **Banco:** Supabase, com RLS ligado em toda tabela. Leia direto com
  `@supabase/supabase-js` e a chave anônima.
- **Entrar:** link por e-mail, sem senha (`signInWithOtp`).

Use `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` do meu projeto. A chave
anônima é pública por natureza — quem protege os dados é o RLS. **A chave
`service_role` nunca entra no front.**

## As telas

| tela | rota | acesso |
| --- | --- | --- |
| Capa | `/` | pública |
| Cofre da entidade | `/e/:slug` | privada, com abas |
| Aprovações | `/e/:slug/aprovacoes` | privada, com abas |
| Livro-caixa | `/e/:slug/livro` | **pública, sem login, sem abas** |
| Página da festa | `/f/:slug` | pública, sem abas |
| Perfil e carteirinha | `/perfil` | privada, com abas |

Barra de abas: Cofre · Aprovar · Festas · Perfil, com um botão flutuante
circular no centro. O livro-caixa e a página da festa **não têm abas** — são
páginas que circulam em grupo de WhatsApp, para gente que não tem conta.

### A tela que importa mais: Aprovações

É a do vídeo. Uma saída proposta, uma assinatura dada, faltando a segunda.

Quando alguém tenta executar sem quórum, a API responde **200** com
`{ bloqueado: true, assinaturasFeitas, assinaturasNecessarias }`. **Isso não é
erro e não pode virar tela de erro.** É a regra do cofre funcionando, e é a
coisa que o produto inteiro existe para mostrar: um bloco vermelho desenhado,
com a contagem de assinaturas e a frase de que nenhum valor saiu do cofre.

Erro de verdade — rede fora do ar — vem como 503 e tem outra tela. São coisas
diferentes.

### A tela que fecha o circuito: Página da festa

Escolher lote → botão comprar → QR e referência → esperar → confirmado. O QR
vem **desenhado do servidor** como texto SVG em `qr`; insira no DOM e não
carregue biblioteca de QR nenhuma.

Enquanto espera, consulte `POST /api/conciliar` a cada 2 ou 3 segundos. É
idempotente. Quando `pago: true`, mostre o comprovante.

O livro-caixa precisa **se atualizar sozinho**, sem ninguém recarregar: quem
compra numa aba vê a entrada aparecer na outra em menos de 30 segundos.

## Restrições que não se quebram

**DARK-ONLY.** Não existe tema claro. Não crie alternador. O fundo é
azul-marinho, **nunca preto**.

**Mobile-first, 390px.** As pranchas são 390 × 844. A partir daí o conteúdo
fica centrado nessa largura.

**Nenhum emoji.** Em lugar nenhum.

**Interface em pt-BR.** Datas e dinheiro em pt-BR.

### Vocabulário

**Nenhuma palavra de blockchain na interface.** Não existe "carteira",
"wallet", "on-chain", "multisig", "transação", "token", "Solana", "blockchain".
As palavras do produto são: **cofre, assinatura, saída, entrada, livro-caixa,
rubrica, proposta, quórum, comprovante, retido**.

**Não diga "Pix" em componente de execução.** O pagamento da demonstração roda
em devnet; em produção seria Pix por parceiro autorizado. Dizer que é Pix agora
seria mentir para quem avalia. Diga "a saída é executada", nunca "o Pix é
executado".

**"Rubrica" é categoria contábil** — Eventos, Marketing, Esporte, Associados.
Nunca sinônimo de assinatura.

### Dinheiro

Integer em **centavos**, sempre. `valor_centavos: 4318025` é `R$ 43.180,25`.
Nunca float, em lugar nenhum — nem em variável intermediária.

- Formate com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- Saída usa `−` (U+2212, o menos matemático), entrada usa `+`. Nunca hífen.
- `tabular-nums` em todo número, senão a coluna dança quando o valor muda.
- Cartão compacto abrevia sem centavos: `R$ 43.180`. Livro-caixa e comprovante
  mostram completo: `R$ 43.180,25`.

## O sistema visual

### Cor

| token | hex | uso |
| --- | --- | --- |
| `ground` | `#101823` | fundo da tela |
| `surface` | `#192434` | cartões |
| `surface-2` | `#1F2D41` | elevação, botão desabilitado |
| `line` | `#243448` | bordas |
| `tabbar` | `#141E2C` | barra de abas |
| `ink` | `#FFFFFF` | títulos, valores |
| `ink-2` | `#9AA9BD` | apoio |
| `ink-3` | `#6B7C93` | rótulos e datas, nunca texto que importa |

Acentos, cada um com seu fundo tingido:

| token | acento | tingido | uso |
| --- | --- | --- | --- |
| `blue` | `#1FA5FF` | `#1A3852` | ação, navegação, links |
| `green` | `#32C869` | `#173B2E` | entrada de dinheiro, confirmado |
| `amber` | `#F5C73D` | `#3A3018` | espera, progresso |
| `purple` | `#AF57DB` | `#2F2C4D` | pessoas, associados |
| `red` | `#FF5F6D` | `#3A1C24` | retido, recusado, erro |

Hero: gradiente 160°, `#1E88E5 → #29A3F5 → #1B7FD4`, com textura de formas
orgânicas claras a 16% de opacidade **atrás** do conteúdo — nunca por cima das
pílulas. O hero carrega o estado da tela: azul normal · âmbar em curso · verde
concluído · vermelho retido ou recusado · roxo pessoas. Sobre âmbar a tinta é
escura, não branca.

**As regras de cor:** `red` só em bloqueio, recusa e erro — **nunca em avatar
de pessoa**. `green` só em entrada de dinheiro e confirmação. `amber` só em
espera. `blue` só em ação e link — **nunca em saldo**. **No máximo duas cores
semânticas visíveis por tela.**

Rubrica tem cor fixa: Eventos azul · Marketing âmbar · Esporte verde ·
Associados roxo.

O **tile tingido** — quadrado arredondado com o fundo do acento e o ícone na
cor do acento — é a assinatura visual do sistema. É ele que dá vida sem poluir.
Ícones de traço 1.5–1.8.

### Tipografia

Inter, uma família só.

| peso | tamanho | tracking | uso |
| --- | --- | --- | --- |
| 800 | 25–28 | -0.035em | valor-âncora |
| 800 | 23 | -0.03em | título no hero |
| 800 | 16.5 | -0.03em | valor em lista |
| 700 | 16.5 | -0.02em | título de seção |
| 700 | 15.5 | -0.015em | nome de item |
| 600 | 10.5 | 0.09em | rótulo caixa alta |
| 600 | 10.5 | — | chip |
| 500 | 12.5–13 | — | corpo e apoio |
| 400 | 12.5 | — | descrição |

### Forma

Cartão 16px · botão 13px · tile de ícone 10–12px · avatar 11px · chip 7px ·
botão flutuante circular 58px. **Sem sombra**, exceto no botão flutuante.
Margem lateral 16px. Espaço entre cartões 10–11px.

### O componente mais importante

O **indicador de assinaturas**: avatares quadrados de 36px com as iniciais.
Quem assinou fica com fundo verde tingido e texto verde; quem falta é contorno
tracejado com um `+`. Ao lado, a contagem em negrito na cor do estado, e a
linha de quem assinou embaixo. Barra de progresso.

Três variantes, derivadas da contagem — sem prop de estado a errar:
`0 de 2` neutro cinza · `1 de 2` âmbar a 50% · completo verde a 100%.

O avatar de quem assinou é verde porque verde é confirmação. **Nunca vermelho:
vermelho não é pessoa.**

### Layout

- Nunca `position: absolute` para posicionar conteúdo. A exceção é o botão
  flutuante da barra de abas.
- Nunca altura fixa em cartão, linha de lista ou passo de linha do tempo. Use
  `min-height`.
- Toda tela com barra de abas reserva **96px livres** no fim da rolagem.
- Números longos (CNPJ, chave, hash) nunca quebram no meio. Se não couber,
  role na horizontal dentro do próprio contêiner.
- Pílula, chip e etiqueta **nunca quebram em duas linhas**. Se não couber,
  encurte o texto.
- Nenhum texto se sobrepõe a outro. Quando não couber, empurre para a linha
  seguinte — nunca `truncate` em dado que a pessoa precise ler.
- A página nunca rola na horizontal.

### Acessibilidade

- Foco visível em todo controle: anel de 2px na cor azul, com 2px de
  afastamento. Nunca `outline: none` sem substituto.
- Todo controle tem nome. Botão só de ícone precisa de `aria-label`.
- Texto pequeno precisa de 4,5:1 de contraste sobre o fundo em que está.
  `ink-3` fica em 3,67:1 sobre `surface` — use só em rótulo curto e acessório,
  nunca em texto que a pessoa precise ler.

## Estados que não podem faltar

Toda tela precisa dos três: **carregando** (esqueleto que ocupa o espaço do
conteúdo, não spinner), **vazio** (que ensina o próximo passo, não só informa
que está vazio) e **erro** (em português de gente, dizendo **o que não
aconteceu com o dinheiro** — é a primeira dúvida de quem vê a tela quebrar num
app de tesouraria).

E mais dois, que são específicos deste produto:

- **Saída retida por falta de quórum** — desenhada, não um `catch`.
- **Entrou mas não tem entidade** — convite pendente, hero âmbar, não vermelho.
  A pessoa fez tudo certo.

## Não invente

Nada de "1.200 entidades usando", depoimento, logo de universidade parceira ou
número de fachada. É um protótipo de hackathon, e dado inventado é a primeira
coisa que um avaliador testa.
