import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {LoadingLoginProps} from '@/shared/types';
import {colors} from '@/modules/styles';
import {loadingStyles} from './loading.styles';

export function LoadingLogin({progress}: LoadingLoginProps) {
  return (
    <View style={loadingStyles.loginContainer}>
      <ActivityIndicator size="large" color={colors.arcGreenNeon} />
      <Text style={loadingStyles.loginMessage}>{progress.message}</Text>
    </View>
  );
}
