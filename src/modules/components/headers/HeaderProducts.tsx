import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Text, TouchableOpacity, View} from 'react-native';
import {headerProductsStyles} from './HeaderProducts.styles';
import {HeaderProductsProps} from './HeaderProducts.types';

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
}: HeaderProductsProps) {
  return (
    <View style={headerProductsStyles.container}>
      {leftIcon && (
        <View style={headerProductsStyles.leftContainer}>
          <TouchableOpacity
            onPress={onPressLeftIcon}
            style={headerProductsStyles.leftButton}>
            <Ionicons name={leftIcon} size={leftSize} color={leftColor} />
          </TouchableOpacity>
          <Text style={headerProductsStyles.label}>{label}</Text>
        </View>
      )}
      <View style={headerProductsStyles.rightContainer}>
        {rightIcon2 && (
          <TouchableOpacity onPress={onPressRightIcon2}>
            <Ionicons
              name={rightIcon2}
              color={rightColor2}
              size={rightSize2}
              style={headerProductsStyles.rightIcon}
            />
          </TouchableOpacity>
        )}

        {rightIcon && (
          <TouchableOpacity onPress={onPressRightIcon}>
            <Ionicons
              name={rightIcon}
              color={rightColor}
              size={rightSize}
              style={headerProductsStyles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
