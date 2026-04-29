import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {HeaderProducts} from '@/modules/components/headers/HeaderProducts';
import Loading from '@/modules/components/loading/Loading';
import {ShowIf} from '@/modules/components/showIf';
import {colors} from '@/modules/styles';

import {
  calculateDiscountPercent,
  formatOrderSummaryDate,
} from '../helpers/order-summary.helpers';
import {useSetupOrderSummaryPage} from '../hooks/useSetupOrderSummaryPage';
import {styles} from '../styles/orderSummaryPage.styles';

export default function OrderSummaryPage(): React.JSX.Element {
  const {data, derivedState, handlers, viewState} = useSetupOrderSummaryPage();

  return (
    <View style={styles.container}>
      <HeaderProducts
        label="Resumo Pedido"
        leftColor={colors.white}
        leftIcon="arrow-back"
        leftSize={25}
        onPressLeftIcon={handlers.handleGoBack}
        rightColor={colors.white}
        rightColor2={colors.white}
        rightIcon={derivedState.isSyncedOrder ? undefined : 'trash-outline'}
        rightIcon2={derivedState.isSyncedOrder ? undefined : 'create-outline'}
        rightSize={25}
        rightSize2={25}
        onPressRightIcon={handlers.handleDeleteOrder}
        onPressRightIcon2={() => {
          handlers.handleEditOrder().catch(error => {
            console.error('Error while opening order editor', error);
          });
        }}
      />

      <Loading isModalLoadingActive={viewState.isLoading} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pedido nº {data.order?.Codigo}</Text>

        <View style={styles.row}>
          <Text style={styles.colorBlack}>Cliente</Text>
          <Text style={[styles.rightAlignedText, {width: '80%'}]}>
            {data.order?.Pessoa?.NomeFantasia}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.colorBlack}>CNPJ/CPF</Text>
          <Text style={styles.rightAlignedText}>
            {data.order?.Pessoa?.CNPJCPF}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.colorBlack}>Emissão</Text>
          <Text style={styles.colorBlack}>
            {formatOrderSummaryDate(data.order?.DataEmissao)}
          </Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Produtos</Text>
          {data.order?.Itens.map((product, index) => (
            <View key={`${product.CodigoProduto}-${index}`} style={styles.productRow}>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.Descricao}</Text>
                <Text style={styles.productPrice}>
                  R$ {product.ValorUnitario.toFixed(2)}
                </Text>
              </View>

              <View style={styles.productInfo}>
                <View style={styles.productInfoBlock}>
                  <Text style={styles.colorBlack}>DESC</Text>
                  <Text style={styles.colorBlack}>
                    {product.ValorVendaDesconto !== product.ValorUnitario
                      ? (
                          (product.ValorUnitario - product.ValorVendaDesconto) *
                          product.Quantidade
                        ).toFixed(2)
                      : '0.00'}
                    {product.ValorVendaDesconto !== product.ValorUnitario
                      ? ` (${calculateDiscountPercent(
                          product.ValorUnitario,
                          product.ValorVendaDesconto,
                        )}%)`
                      : ''}
                  </Text>
                </View>

                <View style={styles.productInfoBlock}>
                  <Text style={styles.colorBlack}>QTD</Text>
                  <Text style={styles.colorBlack}>{product.Quantidade}</Text>
                </View>

                <View style={styles.productInfoBlock}>
                  <Text style={styles.colorBlack}>VLR UN</Text>
                  <Text style={styles.colorBlack}>
                    R$ {product.ValorUnitario.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.productInfoBlock}>
                  <Text style={styles.colorBlack}>TOTAL</Text>
                  <Text style={styles.colorBlack}>
                    R$ {(product.ValorVendaDesconto * product.Quantidade).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.sectionTitle}>Total</Text>

          <View style={styles.totalInfo}>
            <Text style={styles.colorBlack}>Total Bruto</Text>
            <Text style={styles.colorBlack}>R$ {data.totalGross.toFixed(2)}</Text>
          </View>

          <View style={styles.totalInfo}>
            <Text style={styles.colorBlack}>Desconto:</Text>
            <Text style={styles.colorBlack}>
              R$ {(data.totalGross - data.totalNet).toFixed(2)} (
              {data.totalGross > 0
                ? (((data.totalGross - data.totalNet) / data.totalGross) * 100).toFixed(2)
                : '0.00'}
              %)
            </Text>
          </View>

          <View style={styles.totalInfo}>
            <Text style={styles.colorBlack}>Total Líquido</Text>
            <Text style={styles.colorBlack}>R$ {data.totalNet.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          {data.order?.MeiosPagamentos.map((paymentMethod, index) => (
            <View
              key={`${paymentMethod.FormaPagamento.Descricao}-${index}`}
              style={styles.paymentRow}>
              <Text style={styles.colorBlack}>
                {paymentMethod.FormaPagamento.Descricao}
              </Text>
              <View style={styles.paymentDetails}>
                <Text style={styles.colorBlack}>
                  R$ {paymentMethod.ValorRecebido.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handlers.handleSharePdf().catch(error => {
              console.error('Error while exporting order pdf', error);
            });
          }}>
          <Text style={styles.buttonText}>Compartilhar PDF</Text>
        </TouchableOpacity>

        <ShowIf condition={!derivedState.isSyncedOrder}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              handlers.handleSendOrder().catch(error => {
                console.error('Error while sending order', error);
              });
            }}>
            <Text style={styles.buttonText}>Enviar Pedido</Text>
          </TouchableOpacity>
        </ShowIf>

        <TouchableOpacity
          style={[styles.confirmButton, styles.warningButton]}
          onPress={handlers.handleDuplicateOrder}>
          <Text style={styles.buttonText}>Duplicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
