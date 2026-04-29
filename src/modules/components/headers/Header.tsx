import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Text, View, TouchableOpacity} from 'react-native';
import {HeaderProps} from './type';
import {ShowIf} from '../showIf';
import {headerStyles} from './Header.styles';

export function Header({
  label,
  leftIcon,
  leftColor = 'white',
  leftSize = 24,
  rightIcon,
  rightColor = 'white',
  rightSize = 24,
  rightButtonDisable = false,
  leftButtonDisable = false,
  onPressLeftIcon,
  onPressRighttIcon,
}: HeaderProps) {
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.leftContainer}>
        <ShowIf condition={!!leftIcon}>
          <TouchableOpacity
            onPress={onPressLeftIcon}
            disabled={leftButtonDisable}
            style={headerStyles.iconButton}>
            <Ionicons name={leftIcon!} size={leftSize} color={leftColor} />
          </TouchableOpacity>
        </ShowIf>
        <Text style={headerStyles.label}>{label}</Text>
      </View>
      <ShowIf condition={!!rightIcon}>
        <TouchableOpacity
          onPress={onPressRighttIcon}
          disabled={rightButtonDisable}
          style={headerStyles.iconButton}>
          <Ionicons name={rightIcon!} size={rightSize} color={rightColor} />
        </TouchableOpacity>
      </ShowIf>
    </View>
  );
}
