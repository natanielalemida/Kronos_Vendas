const {version} = require('./package.json');

const projectId = process.env.EXPO_PROJECT_ID;

export default () => ({
  expo: {
    name: 'Kronos Vendas',
    slug: 'kronos-vendas',
    version,
    orientation: 'portrait',
    scheme: 'kronosvendas',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
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
    runtimeVersion: {
      policy: 'fingerprint',
    },
    extra: {
      eas: {
        projectId,
      },
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
      environment: process.env.APP_ENV ?? 'development',
    },
  },
});
