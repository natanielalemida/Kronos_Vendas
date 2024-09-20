import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../styles';

type HeaderProps = {
  label: string;
  leftIcon?: string;
  leftColor?: string;
  leftSize?: number;
  rightColor?: string;
  rightIcon?: string;
  rightSize?: number;
  rightColor2?: string;
  rightIcon2?: string;
  rightSize2?: number;
  onPressLeftIcon?: () => void;
  onPressRightIcon?: () => void;
  onPressRightIcon2?: () => void;
};

export function HeaderProducts({
  label,
  leftIcon,
  leftColor,
  leftSize,
  rightIcon,
  rightColor,
  rightSize,
  rightIcon2,
  rightColor2,
  rightSize2,
  onPressLeftIcon,
  onPressRightIcon,
  onPressRightIcon2,
}: HeaderProps) {
  return (
    <View
      style={{
        backgroundColor: colors.arcGreen,
        alignItems: 'center',
        flexDirection: 'row',
        height: 80,
        justifyContent: 'space-between',
        paddingTop: 25,
        paddingHorizontal: 10,
        width: '100%',
      }}>
      {leftIcon && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={onPressLeftIcon}
            style={{paddingRight: 15, paddingTop: 1}}>
            <Icon
              name={leftIcon}
              size={leftSize}
              color={leftColor}
              onPress={onPressLeftIcon}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              fontSize: 21,
              fontWeight: '500',
            }}>
            {label}
          </Text>
        </View>
      )}
      <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
        {rightIcon2 && (
          <TouchableOpacity onPress={onPressRightIcon2}>
            <Icon
              onPress={onPressRightIcon2}
              name={rightIcon2}
              color={rightColor2}
              size={rightSize2}
              style={{marginTop: 5, paddingRight: 15}}
            />
          </TouchableOpacity>
        )}

        {rightIcon && (
          <TouchableOpacity onPress={onPressRightIcon}>
            <Icon
              onPress={onPressRightIcon}
              name={rightIcon}
              color={rightColor}
              size={rightSize}
              style={{marginTop: 5, paddingRight: 15}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
