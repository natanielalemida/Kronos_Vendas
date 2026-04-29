import {Ionicons} from '@expo/vector-icons';

import {
  RootNavigationProp,
  RootScreenProps,
} from '@/app/navigation/types/root-navigation.types';

export type SettingsPageProps = RootScreenProps<'Settings'>;

export type SettingsPageNavigation = RootNavigationProp<'Settings'>;

export type UseSetupSettingsPageParams = {
  navigation: SettingsPageNavigation;
};

export type ConnectionDetails = {
  host: string;
  codStore: string;
  terminal: string;
};

export type SettingsModalState = {
  isConnectionModalVisible: boolean;
  isLocalParametersModalVisible: boolean;
};

export type SettingsOptionButtonProps = {
  details?: string[];
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  title: string;
};
