import Constants from 'expo-constants';

const fallbackVersion = require('../../../package.json').version;

export const appVersion =
  Constants.expoConfig?.version ??
  Constants.nativeAppVersion ??
  fallbackVersion;
