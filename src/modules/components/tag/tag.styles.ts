import {StyleSheet} from 'react-native';
import {colors} from '@/modules/styles';

export const tagStyles = StyleSheet.create({
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 5,
    alignSelf: 'flex-end',
  },
  tagText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export function getTagBackgroundStyle(color: string) {
  return {backgroundColor: color};
}
