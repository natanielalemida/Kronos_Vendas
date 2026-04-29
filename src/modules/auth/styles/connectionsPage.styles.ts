import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.arcGreen400,
  },
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    elevation: 2,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectionIcon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  detail: {
    color: 'black',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  checkboxContainer: {
    backgroundColor: undefined,
    padding: 0,
    marginRight: -1,
  },
  listContent: {
    paddingBottom: 80,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.arcGreen,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
