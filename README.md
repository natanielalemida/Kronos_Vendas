# 🚀 Kronos Vendas

Refatoração completa do app **Kronos Vendas** saindo de **React Native CLI** para uma base moderna com **Expo**, **EAS Build** e **EAS Update**.

Este repositório está em transição. O app legado ainda existe, mas a arquitetura nova já começou a ser formalizada para que a migração aconteça com menos risco, mais previsibilidade e menos retrabalho.

## 📌 Objetivos da refatoração

- Migrar o bootstrap do app para **Expo**
- Adotar **EAS Update** com controle explícito de runtime
- Reorganizar o projeto por **domínio de negócio**
- Padronizar a base para trabalho assistido por IA
- Reduzir acoplamento entre tela, regra de negócio e integração
- Remover arquivos gerados, código morto e dependências desnecessárias
- Criar uma documentação forte o suficiente para guiar a refatoração inteira

## 🧭 Status atual

- O projeto original ainda roda como **React Native CLI**
- A migração para Expo foi **iniciada estruturalmente**
- O `App.tsx` foi simplificado e a composição principal foi movida para `src/app`
- Foi criada uma base de documentação para IA, arquitetura e plano de migração
- Foi adicionada uma configuração inicial de **Expo + EAS Update**
- Um artefato gerado (`android/app/src/main/assets/index.android.bundle`) foi removido do versionamento

## 🏗️ Arquitetura alvo

Baseada no documento [kronos-vendas-frontend-architecture.html](/Users/natan/Downloads/kronos-vendas-frontend-architecture.html), a arquitetura alvo do projeto passa a seguir estes princípios:

- **Expo** como base do runtime, build, plugins e assets
- **EAS Build** para binários
- **EAS Update** para OTA
- **Feature-first architecture**
- **TanStack Query** para estado remoto
- **Zustand** para estado local/global
- **React Hook Form + Zod** para formulários
- **Design system centralizado**
- **Inglês no código**, português apenas no contrato com a API

## 🗂️ Estrutura desejada

```text
src/
├── app/
│   ├── navigation/
│   └── providers/
├── modules/
│   ├── auth/
│   ├── customers/
│   ├── orders/
│   ├── products/
│   ├── reports/
│   └── settings/
├── shared/
│   ├── config/
│   ├── theme/
│   ├── ui/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   └── utils/
└── services/
```

## 🧱 O que já foi criado nesta fase

- `src/app/AppRoot.tsx`
- `src/app/providers/AppProviders.tsx`
- `src/app/navigation/AppRootNavigator.tsx`
- `src/app/navigation/AppVersionBadge.tsx`
- `src/shared/config/appVersion.ts`
- `src/shared/theme/*`
- `app.config.ts`
- `AGENTS.md`
- `docs/refactor/expo-migration-roadmap.md`

## 🤖 Regras para IA

O arquivo [AGENTS.md](/Users/natan/Documents/Kronos_Vendas/AGENTS.md) é a fonte principal para orientar IA durante a refatoração.

Resumo rápido:

- código em inglês
- UI em `.tsx` com foco em renderização
- regra de negócio fora da tela
- `styles.ts` para estilos por tela
- domínio isolado por módulo
- nada de API direta em componente visual
- nada de inventar token visual na feature
- toda limpeza precisa ser rastreável

## 📚 Documentos importantes

- Arquitetura base: [kronos-vendas-frontend-architecture.html](/Users/natan/Downloads/kronos-vendas-frontend-architecture.html)
- Guia para IA: [AGENTS.md](/Users/natan/Documents/Kronos_Vendas/AGENTS.md)
- Roadmap de migração: [docs/refactor/expo-migration-roadmap.md](/Users/natan/Documents/Kronos_Vendas/docs/refactor/expo-migration-roadmap.md)

## 🔄 Estratégia de migração

### 1. Foundation

- centralizar bootstrap
- criar providers
- criar tema/tokens
- preparar Expo config
- preparar EAS config

### 2. Infra

- introduzir TanStack Query
- introduzir Zustand
- mapear libs nativas atuais para equivalentes Expo ou Dev Build
- definir persistência offline e banco local

### 3. Refatoração por domínio

- `login` → `auth`
- `Clientes` → `customers`
- `Pedidos` + `NovaRequisicao` → `orders`
- `Produtos` → `products`
- `Configuracoes` → `settings`
- `sync` → `sync/offline`

### 4. Limpeza

- remover arquivos gerados
- remover bundles commitados
- eliminar dependências não usadas
- remover duplicações
- remover nomenclatura em português do frontend

## 📦 Expo + OTA

A configuração inicial de Expo foi centralizada em [app.config.ts](/Users/natan/Documents/Kronos_Vendas/app.config.ts).

Direção adotada nesta fase:

- `runtimeVersion` com política `fingerprint`
- `updates.enabled = true`
- `fallbackToCacheTimeout = 0`
- suporte a canais `development`, `preview` e `production`

Motivo: durante a migração teremos alterações frequentes em runtime nativo e queremos reduzir o risco de publicar OTA incompatível com builds antigos.

## 🧪 Como vamos validar a migração

- lint por fatia migrada
- teste manual por domínio
- smoke test de navegação
- validação de sync/offline
- validação de geração/compartilhamento de PDF
- validação de autenticação e biometria
- validação de build de desenvolvimento e build preview

## 🧹 Limpeza já identificada

- remover bundle Android gerado do repositório
- revisar `android/` e `ios/` quando o projeto passar a usar prebuild/dev build
- revisar dependências nativas antigas
- mapear arquivos e componentes duplicados

## ⚠️ Pontos de atenção da migração

- o app atual usa várias libs com dependência nativa
- algumas delas podem permanecer via **Expo Dev Build**
- outras devem migrar para equivalentes Expo
- a camada de banco local e sync offline precisa ser migrada com cuidado
- a troca de runtime não deve acontecer misturando cleanup grande com refactor funcional no mesmo passo

## 🛠️ Próximos passos recomendados

1. Instalar e alinhar a base Expo no `package.json`
2. Introduzir `expo-router` ou consolidar `React Navigation` dentro de `src/app/navigation`
3. Adicionar TanStack Query e Zustand
4. Mapear todas as libs nativas para `keep`, `replace`, `remove`
5. Migrar primeiro o domínio `auth`
6. Migrar depois `orders`, que hoje concentra boa parte da complexidade

## 💚 Meta desta refatoração

Chegar a uma base em que:

- a arquitetura fique previsível
- o código fique mais fácil de manter
- a IA consiga atuar sem bagunçar o projeto
- atualizações OTA possam ser feitas com segurança
- o time consiga evoluir o app sem depender de remendos locais
