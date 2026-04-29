import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {ShowIf} from '@/modules/components/showIf';
import {formatCnpj, formatCpf} from '@/shared/utils/document-formatters';

import {
  getCustomerRowBackgroundStyle,
  isCompanyDocument,
} from '../helpers/customers-page.helpers';
import {styles} from '../styles/customersPage.styles';
import {CustomerListItemProps} from '../types/customers-components.types';
import {CustomerAddressList} from './CustomerAddressList';

export function CustomerListItem({
  customer,
  index,
  onPress,
}: CustomerListItemProps) {
  const hasCompanyDocument = isCompanyDocument(customer.CNPJCPF);

  return (
    <TouchableOpacity
      style={[styles.itemContainer, getCustomerRowBackgroundStyle(index)]}
      onPress={() => onPress(customer)}>
      <View style={styles.itemTopRow}>
        <Text style={styles.itemCode}>{customer.Codigo}</Text>
        <Text style={styles.itemDescription}>{customer.NomeFantasia}</Text>
      </View>

      <ShowIf condition={!!customer.CNPJCPF}>
        <View style={styles.itemTopRow}>
          <ShowIf condition={hasCompanyDocument}>
            <>
              <Text style={styles.itemDocument}>{customer.RazaoSocial}</Text>
              <Text style={styles.itemDocument}>
                CNPJ: {formatCnpj(customer.CNPJCPF)}
              </Text>
            </>
          </ShowIf>

          <ShowIf condition={!hasCompanyDocument}>
            <Text style={styles.itemDocument}>
              CPF: {formatCpf(customer.CNPJCPF)}
            </Text>
          </ShowIf>

          <Text style={styles.itemDescription}>{customer.IERG}</Text>
        </View>
      </ShowIf>

      <CustomerAddressList addresses={customer.Enderecos ?? []} />
    </TouchableOpacity>
  );
}
