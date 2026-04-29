import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Text, TextInput, View} from 'react-native';

import {colors} from '@/modules/styles';

import {useSetupAuthInput} from '../hooks/useSetupAuthInput';
import {AuthInputProps} from '../types/auth-input.types';
import {getAuthInputWidthStyle, styles} from '../styles/authInput.styles';

export function AuthInput({
  control,
  errorMessage,
  inputWidth,
  leftColor,
  leftIcon,
  leftSize,
  name,
  onEndEditing,
  onFocus,
  onPressRightIcon,
  password,
  placeholder,
  rightColor,
  rightIcon,
  rightSize,
  targetFocusField,
}: AuthInputProps): React.JSX.Element {
  const {field, inputRef} = useSetupAuthInput({
    control,
    name,
    placeholder,
    targetFocusField,
  });

  return (
    <View
      style={[
        styles.fieldContainer,
        inputWidth
          ? getAuthInputWidthStyle(inputWidth)
          : styles.fieldContainerFullWidth,
      ]}>
      <View
        style={[
          styles.inputContainer,
          errorMessage ? styles.inputContainerError : undefined,
        ]}>
        <View style={styles.leftIconContainer}>
          {leftIcon ? (
            <Ionicons
              name={leftIcon}
              size={leftSize}
              color={leftColor}
              style={styles.leftIcon}
            />
          ) : null}
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            onEndEditing={onEndEditing}
            onFocus={onFocus}
            placeholder={placeholder}
            placeholderTextColor={colors.black}
            ref={inputRef}
            secureTextEntry={password}
            style={[styles.textField, styles.textFieldDark]}
            value={typeof field.value === 'string' ? field.value : ''}
          />
        </View>
        {rightIcon ? (
          <Ionicons
            name={rightIcon}
            color={rightColor}
            onPress={onPressRightIcon}
            size={rightSize}
          />
        ) : null}
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}
