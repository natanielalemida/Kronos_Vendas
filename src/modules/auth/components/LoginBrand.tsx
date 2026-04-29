import React from 'react';
import {Image, Text, View} from 'react-native';

import {LoginBrandProps} from '../types/login-component.types';
import {styles} from '../styles/loginPage.styles';

export function LoginBrand({
  compactLayout,
  logo,
}: LoginBrandProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.brandContainer,
        compactLayout && styles.compactBrandContainer,
      ]}>
      <Image source={logo} style={styles.brandImage} />
      <Text style={styles.brandTitle}>Kronos Vendas</Text>
    </View>
  );
}
