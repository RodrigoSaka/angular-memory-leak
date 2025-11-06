# Laboratorio Angular de Retencao

Aplicacao Angular pensada para demonstrar na pratica como diagnosticar objetos presos na memoria usando o Chrome DevTools. O projeto foi construído para ser ruidoso de proposito: basta montar o painel de exemplo para ver buffers, listeners e instancias se acumulando.

## Visao geral

- **Painel de demonstracao** (`app-retention-demo`): simula um recurso descuidado que registra timers, listeners globais e buffers de 1 MB sem limpar nada em `ngOnDestroy`.
- **Card Procedimento no DevTools** (`app-devtools-checklist`): oferece um roteiro estatico em portugues para tirar snapshots, comparar resultados e validar a correção.
- **Playground guiado**: a pagina inicial explica o que observar, mostra contadores em tempo real e disponibiliza botoes para montar, destruir e automatizar o ciclo.

## Requisitos

- Node.js 18+
- npm 9+

## Instalacao e execucao

```bash
npm install     # instala dependencias
npm start       # sobe o servidor local em http://localhost:4200
```

Abra o endereço no Chrome ou em outro navegador Chromium para aproveitar todos os recursos do DevTools.

## Roteiro sugerido

1. Abra o DevTools e va ate a aba **Memory**. Com a pagina parada, capture um snapshot de linha de base.
2. Clique em **Add Demo Panel** algumas vezes. Observe o painel de contadores incrementar buffers, listeners e componentes retidos.
3. No painel, acione **Acionar rajada de 20 MB** e mova o ponteiro pela tela para acelerar o problema.
4. Pressione **Destroy Panels** e tire um novo snapshot. Compare com a linha de base em **Comparison** → `Objects allocated between snapshots`. Os grupos `app-retention-demo` e `ArrayBuffer` devem continuar crescendo.
5. Repita o ciclo com **Start Auto Cycle** (botao principal) para gerar evidencias rapidamente.
6. Grave uma curta timeline em **Allocation instrumentation on timeline** e clique em **Collect garbage**. A linha nao deve voltar ao nivel inicial, provando que ha objetos retidos.

O card **Procedimento no DevTools** presente na pagina repete esses passos com mais detalhes e dicas sobre filtros (`Retained size`, `Retainers`, `Detached DOM tree`, etc.).

## O que esta retendo memoria?

- `src/app/components/retention-demo/retention-demo.component.ts`: componente que registra `setInterval`, listeners globais (`mousemove`) e aloca buffers de 1 MB a cada segundo. O metodos `ngOnDestroy` propositalmente nao limpa os recursos.
- `src/app/services/retention-harness/retention-harness.service.ts`: service singleton que guarda referencias fortes para buffers, listeners e instancias de componentes, impossibilitando que o garbage collector recupere memoria.

Cada intervalo adiciona um novo `ArrayBuffer`. O botao de rajada executa 20 alocacoes de 1 MB em sequencia, expondo rapidamente os efeitos no DevTools.

## Exercicios propostos

- Ajuste o `RetentionDemoComponent` para remover listeners e timers no `ngOnDestroy` e repita os snapshots.
- Troque os arrays do `RetentionHarnessService` por estruturas fracas (`WeakRef`, `WeakSet` ou `WeakMap`) e observe o impacto.
- Adicione uma rotina de limpeza para buffers antigos e valide, via DevTools, que o heap volta ao patamar inicial apos destruir os paineis.

## Scripts

- `npm start` – servidor de desenvolvimento com recarregamento.
- `npm run build` – build de producao otimizado.
- `npm test` – executa testes unitarios com Karma.

## Contribuicao

Sugestoes e pull requests sao bem-vindos. Para mudancas maiores, abra uma issue para discutirmos a abordagem. Siga as convencoes do Angular e inclua testes quando fizer sentido.

## Licenca

Licenciado sob MIT. Veja `LICENSE` para mais detalhes.
