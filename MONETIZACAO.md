# KART RUSH: plano de monetização e de retenção

O jogo é **grátis**. Vendemos só **visual** e **graça** (gadgets de efeito fraco). Nada pago deixa o kart mais rápido.

## O que já está no jogo (`deluxe/dx-loja.js`)

### Duas moedas
| Moeda | Como ganha | Para que serve |
|---|---|---|
| 🪙 Moedas | Jogando: corrida, posição, moedas da pista, acertos, turbo roxo, missões, troféus, login diário | Comprar itens da loja |
| 💎 Gemas | Pacotes em dinheiro, e um pouco de graça: troféus, bônus das missões, 7º dia seguido, passe | Pegar itens na hora, ativar o Passe Premium, comprar nível do passe |

**Todo item da loja tem dois preços:** o de esforço (🪙) e o de atalho (💎). Assim, quem paga ganha tempo, e quem não paga pega o mesmo item jogando. Isso valoriza o item: ele "vale dinheiro", mas também pode ser conquistado.

### Preços por raridade
| Raridade | 🪙 Moedas | 💎 Gemas | Tempo de jogo aproximado* |
|---|---|---|---|
| Comum | 400 | 40 | ~5 corridas |
| Raro | 1.200 | 120 | ~13 corridas |
| Épico | 3.000 | 300 | ~33 corridas |
| Lendário | 6.000 | 600 | ~65 corridas |

\*Média de ~90 🪙 por corrida (mais nas vitórias e com missões).

### Pacotes de gemas (preços sugeridos)
| Pacote | Gemas | Preço |
|---|---|---|
| Punhado | 120 | R$ 4,90 |
| Saco | 650 + 50 | R$ 19,90 |
| Baú (destaque) | 1.400 + 150 | R$ 39,90 |
| Tesouro | 3.000 + 500 | R$ 79,90 |

### Itens (29)
- **Pinturas (9):** Algodão Doce, Fibra de Carbono, Cromado, Neon Pulsante, Cristal de Gelo, Ouro 24k, Lava Viva, Arco-Íris e **Galáxia** (exclusiva do passe).
- **Rastros (7):** Bolhas, Fogo, Purpurina Rosa, Estrelas, Arco-Íris, Raios e **Chuva de Ouro** (exclusivo do passe).
- **Acessórios (9):** Chapéu de Festa, Orelhas de Gato, Boné de Hélice (a hélice gira com a velocidade), Chifrinhos, Auréola, Capacete Viking, Coroa Real, Chapéu de Capitão (passe grátis) e **Cartola de Ouro** (exclusiva do passe).
- **Gadgets (5):** 1 uso por volta.
  - **Buzina Maluca** (grátis): o kart da frente leva um susto e balança.
  - **Luva de Boxe:** empurra quem estiver colado ao lado.
  - **Gota de Óleo:** deixa uma poça atrás.
  - **Corrente com Gancho:** você ganha um puxão e o da frente perde um pouco.
  - **Rede de Pesca** (exclusiva do passe): difícil de mirar; quem é pescado fica lento por 1,6 s.
- **Teclas do gadget:** Q (P1), Ctrl direito ou ponto (P2), botão **Y** no controle.

Cada jogador da TV (P1 a P4) tem o próprio visual, escolhido em "EQUIPAR EM".

### Passe da Temporada (Temporada 1 · Festa Pirata)
- 30 níveis de 300 XP cada.
- **Trilha grátis:** moedas, gemas e 6 itens.
- **Trilha premium** (950 💎, cerca de R$ 30): 1.150 💎 de volta ao longo dos níveis (dá para pagar o próximo passe só jogando) e os itens exclusivos.
- Comprar um nível custa 150 💎.
- **XP:** cada corrida dá até ~110 XP. Cada missão dá 150 XP, e a 1ª vitória do dia dá +100.
- Um jogador casual (5 corridas e 3 missões por dia) completa o passe em ~10 dias. A temporada dura ~6 semanas.

### Retenção (o que faz voltar todo dia)
- **3 missões por dia**, que trocam à meia-noite. Cada uma dá 80 🪙 + 150 XP; completar as 3 dá +10 💎.
- **Prêmio diário com sequência:** o prêmio cresce a cada dia seguido, e o 7º dia dá 💎 20.
- **1ª vitória do dia:** +100 🪙 e +100 XP.
- **18 troféus**, incluindo vencer em cada mapa, "Corrida Limpa", "Pescador", "Colecionador" e "Fiel à Pista" (7 dias seguidos).
- **Tela de resultado:** mostra cada ganho da corrida, a barra do passe subindo e os troféus novos.

## O que falta para cobrar de verdade
1. **Servidor de conta.** Hoje a conta fica no `localStorage` do aparelho, e dá para editar. Para vender, saldo e itens precisam viver num servidor, com login (Google ou código da TV).
2. **Checkout.** O ponto de ligação é `DX.loja.checkout(pacote)`. Ele deve abrir um Pix ou cartão (Mercado Pago ou Stripe), e o **servidor** só credita as 💎 depois da confirmação (webhook). Hoje o botão mostra um aviso e **não credita nada**.
3. **MEI ou CNPJ** para receber.
4. **Lojas e plataformas:** na Play Store e na App Store, gemas viram "compras no app" (taxa de 15 a 30%). No AirConsole e nos portais (Poki/CrazyGames), cada um tem a própria regra de anúncios e compras.

## Próximas temporadas (ideias)
- **T2 Inferno:** kart-caveira, rastro de chamas azuis e gadget "Tridente" (empurra para trás).
- **T3 Doce:** pinturas de confeitaria, acessório "Cupcake", gadget "Chiclete" (gruda por 1 s).
- Itens de evento: Halloween, Natal, Copa.
