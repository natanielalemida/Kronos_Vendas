# Kronos Vendas AI Guidelines

Este arquivo define as regras que qualquer IA deve seguir ao trabalhar neste repositório durante a refatoração.

## 1. Objetivo

A missão é migrar o app legado de **React Native CLI** para uma base **Expo + EAS Build + EAS Update**, ao mesmo tempo em que reorganizamos a arquitetura por domínio e removemos código, assets, arquivos gerados e dependências desnecessárias.

## 2. Princípios obrigatórios

- Todo o código novo deve ser escrito em **inglês**
- Português só pode existir em:
  - textos de interface destinados ao usuário final
  - payloads/contratos do backend
  - dados que já chegam da API
- Nenhuma tela nova pode concentrar regra de negócio, integração e navegação no mesmo arquivo
- Todo refactor deve priorizar legibilidade e isolamento de responsabilidade

## 3. Organização do código

### 3.1 Estrutura macro

```text
src/
├── app/
├── modules/
├── shared/
└── services/
```

### 3.2 Regra por domínio

Cada domínio deve concentrar:

- page components
- hooks
- services
- queries
- mutations
- types
- visual child components

Se algo for compartilhado entre módulos, deve subir para:

- `src/shared/ui`
- `src/shared/hooks`
- `src/shared/types`
- `src/shared/utils`
- `src/services`

## 4. Regras para componentes

Arquivos `.tsx` devem conter apenas:

- JSX
- composição visual
- binds de props
- condicionais simples
- consumo do hook central da tela

Arquivos `.tsx` não devem conter:

- chamada direta de API
- transformação complexa de payload
- regras de negócio longas
- handlers extensos
- filtros pesados
- cálculos grandes
- lógica de sincronização
- estilos inline complexos

## 5. Regras para hooks

Cada tela deve convergir para um hook central no formato:

- `useSetupLoginPage`
- `useSetupOrdersPage`
- `useSetupCustomersPage`

Esse hook central pode compor hooks menores:

- `useOrdersState`
- `useOrdersFilters`
- `useOrdersHandlers`
- `useOrdersEffects`

## 6. Estilo e design system

- Estilos de tela devem ficar em `styles.ts`
- Nenhuma feature deve inventar cor, spacing, radius ou tipografia localmente
- Tudo deve usar tokens centralizados em `src/shared/theme`
- Criar novo token é melhor do que espalhar valor mágico

## 7. Dados e estado

### 7.1 Estado remoto

Usar **TanStack Query** para:

- queries
- mutations
- cache
- invalidação
- paginação

### 7.2 Estado local/global

Usar **Zustand** para:

- sessão local
- filtros persistidos
- carrinho
- preferências
- UI global

### 7.3 Regra de separação

- backend data não deve virar estado global por padrão
- dado remoto fica em query
- estado de experiência do usuário fica em store local

## 8. Navegação

- A raiz do app deve viver em `src/app/navigation`
- Navegação não deve ficar espalhada pelos componentes visuais
- Handlers de navegação devem ser expostos por hooks
- A estrutura alvo deve aceitar Expo sem acoplamento ao bootstrap legado

## 9. Expo, build e OTA

### 9.1 Direção do projeto

- Base do app: **Expo**
- Distribuição nativa: **EAS Build**
- Atualizações JS/asset: **EAS Update**

### 9.2 Regras de update

- mudança JS/UI/hooks/assets: pode ser OTA
- mudança de permissão nativa: exige novo build
- mudança em lib nativa: exige novo build
- mudança de configuração nativa: exige novo build

### 9.3 Runtime version

Durante a refatoração, usar `runtimeVersion` com política que minimize OTA incompatível. A configuração atual proposta está em `app.config.ts`.

## 10. Limpeza e deleção

Toda remoção deve seguir uma destas categorias:

- `generated`: arquivo gerado
- `unused`: import, helper, asset ou módulo sem uso
- `duplicated`: código duplicado
- `legacy-native`: arquivo de CLI deixado para trás pela migração
- `replaced`: dependência ou módulo substituído por solução nova

Antes de deletar algo relevante:

1. localizar referências com busca global
2. registrar no diff o motivo da remoção
3. garantir que não faz parte do fluxo de runtime atual

## 11. Anti-patterns proibidos

- API chamada direto no `.tsx`
- componente gigante com múltiplas responsabilidades
- `any` como solução padrão
- `../../../../../` em cascata quando houver alternativa
- strings mágicas de tema espalhadas
- código novo em português
- persistir bundle gerado no repositório
- deixar arquivo legado sem sinalização clara de que é transitório

## 12. Convenções de nomenclatura

- `PascalCase` para componentes
- `camelCase` para funções e variáveis
- `kebab-case` para arquivos de mutation/query se fizer sentido
- hooks sempre com prefixo `use`
- nomes de arquivos e símbolos em inglês

## 13. Estratégia de refatoração por tela

Ao migrar uma tela:

1. identificar responsabilidades atuais
2. separar render, hook, styles e data layer
3. mover regras para arquivos menores
4. renomear símbolos para inglês
5. consolidar tipos
6. verificar empty/loading/error state
7. revisar se a tela ainda depende de estrutura interna de outro módulo

## 14. Prioridade de migração

1. `auth`
2. `orders`
3. `customers`
4. `products`
5. `settings`
6. `sync/offline`

## 15. Definition of done

Uma fatia de refatoração só é considerada pronta quando:

- o componente visual ficou focado em render
- a lógica foi isolada
- os nomes estão em inglês
- não sobrou chamada de API na tela
- os estilos ficaram organizados
- o diff removeu ou reduziu acoplamento
- a documentação foi atualizada se a decisão for estrutural
