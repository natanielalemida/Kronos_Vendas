# Expo Migration Roadmap

## Current snapshot

The project is still based on React Native CLI and currently mixes:

- navigation setup in `App.tsx`
- feature logic inside render-heavy screens
- Portuguese naming across the frontend
- native dependencies with different migration requirements
- generated build artifacts committed to the repository

## Refactor goals

- move app bootstrap to Expo
- adopt EAS Build and EAS Update
- isolate business domains
- standardize AI-safe conventions
- reduce dead code and generated artifacts
- migrate to English-first frontend naming

## Target stack

- Expo
- EAS Build
- EAS Update
- React Navigation or Expo Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- FlashList
- expo-image

## Native dependency audit

### Keep for now, validate with Expo Dev Build

- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-screens`
- `react-native-safe-area-context`
- `react-native-svg`
- `lottie-react-native`

### Replace with Expo-first alternatives

- `react-native-fs` → `expo-file-system`
- `react-native-html-to-pdf` → `expo-print`
- `react-native-share` → `expo-sharing`
- `react-native-simple-biometrics` → `expo-local-authentication`
- `react-native-vector-icons` → `@expo/vector-icons`

### Needs deeper strategy before migration

- `knex-react-native-sqlite`
- `react-native-sqlite-storage`
- sync and offline persistence layer
- PDF generation flow
- screenshot/export flow with `react-native-view-shot`

## Cleanup candidates

### Safe candidates

- generated JS bundles committed to source control
- duplicated visual helpers
- legacy README content from React Native CLI bootstrap

### Needs confirmation by code migration

- native folders `android/` and `ios/`
- legacy config files tied only to RN CLI
- old assets and icon packs
- duplicate loading components

## Domain remapping

| Legacy area | Target domain |
| --- | --- |
| `src/modules/login` | `src/modules/auth` |
| `src/modules/menu/components/Clientes` | `src/modules/customers` |
| `src/modules/menu/components/Pedidos` | `src/modules/orders` |
| `src/modules/menu/components/NovaRequisicao` | `src/modules/orders` |
| `src/modules/menu/components/Produtos` | `src/modules/products` |
| `src/modules/menu/components/Configuracoes` | `src/modules/settings` |
| `src/sync` | `src/modules/sync` or `src/services/sync` |

## Migration phases

### Phase 1

- centralize app entrypoint
- create providers layer
- introduce theme foundation
- add Expo and EAS configuration files
- define AI rules and documentation

### Phase 2

- install Expo dependencies
- prepare dev build flow
- introduce query/store infrastructure
- set path aliases
- define runtime update policy end to end

### Phase 3

- migrate `auth`
- migrate `orders`
- migrate `customers`
- migrate `products`

### Phase 4

- rework offline sync architecture
- rework database integration
- validate asset, PDF and sharing flows

### Phase 5

- remove obsolete native/config files
- prune dependencies
- finalize README and onboarding

## OTA policy

- JS/UI/assets-only changes can go through OTA
- native dependency changes require new build
- permission changes require new build
- runtime compatibility must be protected by `runtimeVersion`

## Recommended next execution block

1. Add Expo packages and align the root scripts
2. Introduce TanStack Query and Zustand
3. Migrate login/auth flow to the new module standard
4. Replace the first native dependency with an Expo equivalent
5. Start the dependency removal checklist
