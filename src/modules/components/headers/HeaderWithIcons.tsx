import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type HeaderProps = {
  label: string;
  leftIcon?: string;
  leftColor?: string;
  leftSize?: number;
  rightColor?: string;
  rightIcon?: string;
  rightSize?: number;
  rightButtonDisable?: boolean;
  onPressLeftIcon?: () => void;
  onPressRighttIcon?: () => void;
};

export function HeaderWithIcons({
  label,
  leftIcon,
  leftColor,
  leftSize,
  rightIcon,
  rightColor,
  rightSize,
  rightButtonDisable,
  onPressLeftIcon,
  onPressRighttIcon,
}: HeaderProps) {
  return (
    <View
      style={{
        backgroundColor: '#00B08F',
        alignItems: 'center',
        flexDirection: 'row',
        height: 80,
        justifyContent: 'space-between',
        width: '100%',
      }}>
      {leftIcon && (
        <TouchableOpacity
          onPress={onPressLeftIcon}
          style={{width: '25%', padding: 15}}>
          <Icon
            name={leftIcon}
            size={leftSize}
            color={leftColor}
            style={{marginTop: 20}}
            onPress={onPressLeftIcon}
          />
        </TouchableOpacity>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <Text style={{color: 'white', fontSize: 18}}>{label}</Text>
      </View>
      {rightIcon && (
        <TouchableOpacity
          disabled={rightButtonDisable}
          onPress={onPressRighttIcon}
          style={{
            padding: 15,
            width: '25%',
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}>
          <Icon
            disabled={rightButtonDisable}
            name={rightIcon}
            color={rightColor}
            size={rightSize}
            style={{marginTop: 20}}
            onPress={onPressRighttIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
