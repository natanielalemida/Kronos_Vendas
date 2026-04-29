import React from 'react';
import {Text, View} from 'react-native';

import {ShowIf} from '@/modules/components/showIf';

import {styles} from '../styles/customersPage.styles';
import {CustomerAddressListProps} from '../types/customers-components.types';

export function CustomerAddressList({addresses}: CustomerAddressListProps) {
  return (
    <>
      {addresses.map(address => (
        <ShowIf
          key={`${address.Logradouro}-${address.Numero}`}
          condition={!!address.Logradouro}>
          <View>
            <Text style={styles.addressText}>
              Logradouro: {address.Logradouro} - Número: {address.Numero}
            </Text>
            <Text style={styles.addressText}>Bairro: {address.Bairro}</Text>
          </View>
        </ShowIf>
      ))}
    </>
  );
}
