import React from 'react';
import {View, ViewStyle} from 'react-native';
import {ShowIfProps} from './type';

export function ShowIf({condition, children, style}: ShowIfProps) {
  if (!condition) {
    return null;
  }

  return <View style={style}>{children}</View>;
}
