import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

const fallbackVersion = require('../../../package.json').version;
const fallbackRuntimeVersion = 'development';

type ExpoExtraConfig = {
  runtimeVersion?: string;
};

const configRuntimeVersion =
  typeof Constants.expoConfig?.runtimeVersion === 'string'
    ? Constants.expoConfig.runtimeVersion
    : undefined;

const extraRuntimeVersion = (
  Constants.expoConfig?.extra as ExpoExtraConfig | undefined
)?.runtimeVersion;

export const appVersion =
  Constants.expoConfig?.version ??
  Constants.nativeAppVersion ??
  fallbackVersion;

export const appRuntimeVersion =
  Updates.runtimeVersion ??
  configRuntimeVersion ??
  extraRuntimeVersion ??
  fallbackRuntimeVersion;
