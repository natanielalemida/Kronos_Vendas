const {version} = require('./package.json');

const projectId =
  process.env.EXPO_PROJECT_ID ?? 'f37b9d05-2657-4ea3-b8c4-14e474aaa145';

export default () => ({
  expo: {
    name: 'Kronos Vendas',
    slug: 'kronos-vendas',
    version,
    orientation: 'portrait',
    scheme: 'kronosvendas',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    android: {
      package: 'com.kronos_vendas',
    },
    plugins: [
      'expo-font',
      [
        'expo-local-authentication',
        {
          faceIDPermission:
            'Permita que o Kronos Vendas use biometria para autenticar seu acesso.',
        },
      ],
    ],
    updates: {
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 0,
      ...(projectId ? {url: `https://u.expo.dev/${projectId}`} : {}),
    },
    runtimeVersion: version,
    extra: {
      eas: {
        projectId,
      },
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
      environment: process.env.APP_ENV ?? 'development',
      runtimeVersion: version,
    },
  },
});
