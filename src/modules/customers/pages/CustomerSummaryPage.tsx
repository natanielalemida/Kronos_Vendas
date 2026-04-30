import React from 'react';
import {ScrollView, Text, View} from 'react-native';

import {HeaderProducts} from '@/modules/components/headers/HeaderProducts';
import Loading from '@/modules/components/loading/Loading';
import {ShowIf} from '@/modules/components/showIf';
import {logger} from '@/shared/utils/logger';

import {formatCustomerDocument} from '../helpers/customer-form.helpers';
import {useSetupCustomerSummaryPage} from '../hooks/useSetupCustomerSummaryPage';
import {styles} from '../styles/customerSummaryPage.styles';

export default function CustomerSummaryPage(): React.JSX.Element {
  const {data, derivedState, handlers, viewState} = useSetupCustomerSummaryPage();

  return (
    <View style={styles.container}>
      <HeaderProducts
        label="Resumo"
        leftColor="white"
        leftIcon="chevron-back-outline"
        leftSize={25}
        onPressLeftIcon={handlers.handleGoBack}
        rightColor="white"
        rightColor2="white"
        rightIcon={derivedState.isSyncedCustomer ? undefined : 'save-outline'}
        rightIcon2={
          derivedState.isSyncedCustomer ? undefined : 'cloud-upload-outline'
        }
        rightSize={25}
        rightSize2={25}
        onPressRightIcon={() => {
          handlers.handleSaveCustomer().catch(error => {
            logger.error(
              'CustomerSummary',
              'Error while saving customer.',
              error,
            );
          });
        }}
        onPressRightIcon2={() => {
          handlers.handleSyncCustomer().catch(error => {
            logger.error(
              'CustomerSummary',
              'Error while syncing customer.',
              error,
            );
          });
        }}
      />

      <Loading isModalLoadingActive={viewState.isLoading} />

      <View style={styles.content}>
        <ScrollView>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Dados pessoais</Text>
              <View style={styles.sectionDivider} />

              <View style={styles.infoContainer}>
                <View style={styles.spaceBetweenRow}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.label}>Nome / Razao social</Text>
                    <ShowIf condition={!data.isCompanyDocument}>
                      <Text style={styles.infoText}>{data.form.NomeFantasia}</Text>
                    </ShowIf>
                    <ShowIf condition={data.isCompanyDocument}>
                      <Text style={styles.infoText}>{data.form.RazaoSocial}</Text>
                    </ShowIf>
                  </View>

                  <View style={styles.statusColumn}>
                    <Text style={styles.label}>Status</Text>
                    <Text
                      style={
                        derivedState.isSyncedCustomer
                          ? styles.syncedStatus
                          : styles.unsyncedStatus
                      }>
                      {derivedState.isSyncedCustomer
                        ? 'Sincronizado'
                        : 'Não sincronizado'}
                    </Text>
                  </View>
                </View>

                <ShowIf condition={!!data.form.CNPJCPF}>
                  <Text style={styles.label}>
                    {data.isCompanyDocument ? 'CNPJ' : 'CPF'}
                  </Text>
                  <Text style={styles.infoText}>
                    {formatCustomerDocument(data.form.CNPJCPF)}
                  </Text>
                </ShowIf>

                <ShowIf condition={!!data.form.IE}>
                  <Text style={styles.label}>RG / IE</Text>
                  <Text style={styles.infoText}>{data.form.IE}</Text>
                </ShowIf>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Endereço</Text>
              <View style={styles.sectionDivider} />

              <View style={styles.infoContainer}>
                <View style={styles.spaceBetweenRow}>
                  <View>
                    <Text style={styles.label}>Logradouro</Text>
                    <Text style={styles.infoText}>{data.form.Logradouro}</Text>
                  </View>
                  <View style={styles.statusColumn}>
                    <Text style={styles.label}>Numero</Text>
                    <Text style={styles.infoText}>{data.form.NumeroEndereco}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.spaceBetweenRow}>
                  <View>
                    <Text style={styles.label}>Bairro</Text>
                    <Text style={styles.infoText}>{data.form.Bairro}</Text>
                  </View>
                  <View style={styles.statusColumn}>
                    <Text style={styles.label}>CEP</Text>
                    <Text style={styles.infoText}>{data.form.CEP}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.spaceBetweenRow}>
                  <View>
                    <Text style={styles.label}>Cidade</Text>
                    <Text style={styles.infoText}>
                      {data.form.Municipio?.MunicipioNome}
                    </Text>
                  </View>
                  <View style={styles.statusColumn}>
                    <Text style={styles.label}>Estado</Text>
                    <Text style={styles.infoText}>
                      {data.form.Municipio?.Estado}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Contatos</Text>
              <View style={styles.sectionDivider} />

              <View style={styles.infoContainer}>
                {data.form.Celular.map((contact, index) => (
                  <View key={`${contact.Contato}-${index}`}>
                    <Text style={styles.label}>Celular</Text>
                    <Text style={styles.infoText}>{contact.Contato}</Text>
                  </View>
                ))}

                {data.form.Email.map((contact, index) => (
                  <View key={`${contact.Contato}-${index}`}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.infoText}>{contact.Contato}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
