import {Image, Text, View} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import {useAppSession} from '@/shared/hooks/useAppSession';

import {menuRouterStyles} from '../styles/menuRouter.styles';
import {MenuDrawerContentComponentProps} from '../types/menu-router.types';

export function MenuDrawerContent({
  version,
  ...props
}: MenuDrawerContentComponentProps) {
  const {usuario} = useAppSession();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={menuRouterStyles.drawerContentContainer}>
      <View style={menuRouterStyles.userBar}>
        <View>
          <Text style={menuRouterStyles.versionText}>Versão {version}</Text>
          <Text style={menuRouterStyles.userTextPhoto}>{usuario?.Login}</Text>
          <Text style={menuRouterStyles.userText}>Kronos vendas</Text>
        </View>
        <View style={menuRouterStyles.avatarContainer}>
          <Image
            style={menuRouterStyles.avatarImage}
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png',
            }}
          />
        </View>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
