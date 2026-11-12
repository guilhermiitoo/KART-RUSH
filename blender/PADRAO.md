# Padrão dos personagens 3D (Blender → .glb)

## Como gerar
- No seu Blender portátil: `blender -b -P blender/capy.py`. Para gerar também as fotos de prévia: `blender -b -P blender/capy.py -- --previa`.
- Sem Blender instalado: `pip install bpy` e depois `python blender/capy.py`.
- Saída: `modelos/personagens_v2/<id>.glb`. Prévias em `blender/previa/`. Os modelos originais não são apagados.

## Medidas e orientação
- 1 unidade = 1 m. Em pé, o personagem tem ~2,1 m, contando o chapéu.
- Pés em z = 0. A frente aponta para −Y no Blender, que vira +Z no glTF/Three.js, a mesma frente do kart.
- Origem no chão, no meio entre os pés.

## Orçamento
- Até ~20 mil triângulos por personagem nesta versão de referência (o Capy tem 19 mil). A meta para a corrida com 6 jogadores é 8 a 12 mil, com uma versão leve gerada pelo mesmo script.
- Até 4 materiais: Pelo, Tecido, Brilho e Metal. A cor vem do vértice (COLOR_0), então não há texturas a carregar.

## Esqueleto (nomes fixos, iguais nos 6)
- **Corpo:** Quadril › Coluna › Peito › Pescoco › Cabeca › Mandibula
- **Rosto:** Palpebra.L/R, Sobrancelha.L/R, Orelha.L/R
- **Braços:** Ombro.L/R › Braco › Antebraco › Mao
- **Pernas:** Coxa.L/R › Canela › Pe

Personagens com rabo, antenas ou cachecol ganham ossos extras, por exemplo `Rabo.1`, `Rabo.2`, `Antena.L`.

## Animações (uma ação por nome)
| Nome | Uso | Repete |
|---|---|---|
| Parado | respirar, olhar em volta, mexer a orelha | sim |
| Sentado | pose no kart (o jogo move as mãos até o volante) | sim |
| Acenar | garagem e menu | não |
| Vitoria | pódio e chegada | sim |
| Surpresa | reação | não |
| Olhar | olhar para os lados | sim |
| Item | pegou um item | não |
| Derrota | perdeu a corrida | sim |
| Piscar | piscar de olhos (o jogo toca de vez em quando) | não |

## Técnica de modelagem
- **Corpo:** formas orgânicas fundidas por metaballs, sem emendas visíveis, pintadas por região (pele, focinho, camisa, calça…).
- **Roupas:** cortadas da forma do corpo com cortes retos, ganham espessura (Solidify) e seguem os pesos do corpo.
- **Rosto:** olhos, nariz, boca e chapéu são colados na superfície real da cabeça, por raio.
- **Esqueleto:** pesos automáticos no corpo; peças rígidas (olhos, chapéu, botas, botões) presas a um osso só.
