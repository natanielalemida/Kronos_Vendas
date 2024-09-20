import {Text, Touchable, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type HeaderProps = {
  label: string;
  leftIcon?: string;
  leftColor?: string;
  leftSize?: number;
  rightColor?: string;
  rightIcon?: string;
  rightSize?: number;
  onPressLeftIcon?: () => void;
  onPressRightIcon?: () => void;
};

export function HeaderLeft({
  label,
  leftIcon,
  leftColor,
  leftSize,
  rightIcon,
  rightColor,
  rightSize,
  onPressLeftIcon,
  onPressRightIcon,
}: HeaderProps) {
  return (
    <View
      style={{
        backgroundColor: '#00B08F',
        alignItems: 'center',
        flexDirection: 'row',
        height: '10%',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '65%',
          marginTop: 20,
        }}>
        <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}>
          {label}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '25%',
        }}>
        {leftIcon && (
          <TouchableOpacity
            style={{padding: 15}}
            onPress={() => onPressLeftIcon()}>
            <Icon
              name={leftIcon}
              size={leftSize}
              color={leftColor}
              onPress={onPressLeftIcon}
              style={{marginTop: 20}}
            />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity
            style={{padding: 15}}
            onPress={() => onPressRightIcon()}>
            <Icon
              name={rightIcon}
              color={rightColor}
              size={rightSize}
              onPress={onPressRightIcon}
              style={{marginTop: 20}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
