# Quarto dos Gigantes

Novo mapa `quarto`, disponível no seletor e no campeonato. Base: `claude/fervent-franklin-4s7tla`, commit `7cc2ab6`.

## Percurso e interações

- Pista de brinquedo no chão, subida da régua, escrivaninha e cama com faixa elástica.
- Três tubos: dois seguros e um marcado com X/ASPIRADOR. O perigo alterna a cada corrida, fica fixo durante a prova e é igual para todos. Cor, texto e símbolo indicam a escolha.
- Aspirador: captura por 1,8 s, anima o kart dentro do recipiente e o devolve após os tubos com proteção breve. Não reinicia a volta.
- Seis dominós alternados: aviso no chão, queda em sequência e meia pista livre.
- Trem de brinquedo: sinal luminoso, sino de proximidade, dois vagões fechados e um vagão com passagem central. Os postes continuam sólidos.
- Bots escolhem tubos seguros, desviam dos dominós e freiam antes da passagem do trem.
- Geometria procedural, sem novos modelos externos. Mecânicas restritas ao mapa; relógios avançam apenas durante a corrida.

## Validação

`node --test tests/room-rules.test.cjs`

Seis testes de regras: escolhas, cruzamento entre voltas, avisos, colisões, altura e passagem do vagão.

Teste de integração reproduzível, na raiz do repositório:

```
python tests/build-room-harness.py
python -m http.server 8000
```

Abrir `http://localhost:8000/qa.html` e clicar **Executar testes**. O harness substitui somente o renderizador na cópia temporária `qa.html`; carrega a geometria Three.js, os módulos e a física reais. Não alterar `index.html` para rodar o teste. O arquivo gerado não deve ser publicado.

Resultado desta implementação: cenário construído sem vértices inválidos, quatro pilotos completaram três voltas em até 280 segundos simulados; três configurações perigosas capturaram e devolveram o kart e três configurações seguras não capturaram.

Limitação: o navegador disponível não criou contexto WebGL. Renderização 3D, desempenho gráfico, qualidade visual e multiplayer com celulares reais ainda precisam de teste em máquina com WebGL. O harness sem renderização não comprova esses pontos.
