import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const menuRouterScreenBaseStyles = {
  headerStyle: {
    backgroundColor: colors.arcGreen,
  },
  drawerStyle: {backgroundColor: colors.arcGreen400},
  headerTintColor: colors.white,
};

export const menuRouterStyles = StyleSheet.create({
  drawerContentContainer: {
    paddingTop: 0,
    paddingBottom: 35,
  },
  drawerToggleButton: {
    marginLeft: 16,
  },
  drawerToggleIcon: {
    padding: 10,
  },
  headerRightButton: {
    paddingHorizontal: 10,
  },
  headerRightIcon: {
    marginRight: 16,
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: colors.arcGreen,
    padding: 16,
    minHeight: '14%',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  userText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  userTextPhoto: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerButton: {
    padding: 10,
    marginRight: 16,
  },
  versionText: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.7,
  },
  exitIcon: {
    paddingBottom: 1,
  },
});
