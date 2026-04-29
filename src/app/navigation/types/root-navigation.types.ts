import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Settings: undefined;
  Conexoes: undefined;
  ResumoPedido: undefined;
  PedidosCliente: undefined;
  Menu: undefined;
  resumoPedidoNavigation:
    | {
        Codigo?: number;
        goBack?: boolean;
        id: number;
        idCliente?: number | null;
      }
    | undefined;
  ListClientes: undefined;
  RouterCliente: undefined;
};

export type RootNavigationProp<RouteName extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, RouteName>;

export type RootScreenProps<RouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;
