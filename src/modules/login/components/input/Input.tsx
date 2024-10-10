import {DimensionValue, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from './styles';
import {useEffect, useRef} from 'react';
import {colors} from '../../../styles';

type InputProps = {
  leftIcon?: string;
  rightIcon?: string;
  placeholder?: string;
  leftSize?: number;
  leftColor?: string;
  rightColor?: string;
  rightSize?: number;
  value?: string;
  password?: boolean;
  style?: {};
  refName?: any;
  onFocus?: () => void;
  onChangeText: (value: string) => void;
  inputWidth?: DimensionValue;
  onEndEditing?: () => void;
  onPressRigthIcon?: () => void;
};

export default function Input({
  leftIcon,
  rightIcon,
  leftSize,
  leftColor,
  rightColor,
  rightSize,
  placeholder,
  value,
  inputWidth,
  password,
  refName,
  onPressRigthIcon,
  onFocus,
  onEndEditing,
  onChangeText,
}: InputProps) {
  const loginRef = useRef(null);

  const focusLogin = () => {
    const timer = setTimeout(() => {
      loginRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (refName === placeholder) {
      focusLogin();
    }
  }, [refName]);

  return (
    <View style={[styles.inputContainer, {width: inputWidth}]}>
      <View style={styles.leftIconContainer}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={leftSize}
            color={leftColor}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          onFocus={onFocus}
          ref={loginRef}
          autoCapitalize="none"
          autoCorrect={false}
          onEndEditing={onEndEditing}
          secureTextEntry={password}
          value={value}
          placeholder={placeholder}
          onChangeText={(value: string) => onChangeText(value)}
          style={{width: '80%', color: colors.black}}
          placeholderTextColor={colors.black}
        />
      </View>
      {rightIcon && (
        <Icon
          name={rightIcon}
          color={rightColor}
          size={rightSize}
          onPress={onPressRigthIcon}
        />
      )}
    </View>
  );
}
