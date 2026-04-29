import {ConnectionOption} from '@/modules/storage/types/app-storage.types';
import {
  RootNavigationProp,
  RootScreenProps,
} from '@/app/navigation/types/root-navigation.types';

export type ConnectionsPageProps = RootScreenProps<'Conexoes'>;

export type ConnectionsPageNavigation = RootNavigationProp<'Conexoes'>;

export type UseSetupConnectionsPageParams = {
  navigation: ConnectionsPageNavigation;
};

export type ConnectionCardProps = {
  activeConnectionId?: number;
  connection: ConnectionOption;
  onActivate: (connection: ConnectionOption) => Promise<void>;
  onDelete: (connectionId: number, host: string) => void;
  onEdit: (connectionId: number) => void;
};
