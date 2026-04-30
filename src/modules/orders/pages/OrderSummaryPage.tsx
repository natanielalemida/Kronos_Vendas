import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {HeaderProducts} from '@/modules/components/headers/HeaderProducts';
import Loading from '@/modules/components/loading/Loading';
import {ShowIf} from '@/modules/components/showIf';
import {colors} from '@/modules/styles';

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
        onPressRightIcon2={handlers.handleEditOrder}
      />

      <Loading isModalLoadingActive={viewState.isLoading} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pedido nº {data.order?.Codigo}</Text>

        <View style={styles.row}>
          <Text style={styles.colorBlack}>Cliente</Text>
          <Text style={[styles.rightAlignedText, {width: '80%'}]}>
            {data.customerName}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.colorBlack}>CNPJ/CPF</Text>
          <Text style={styles.rightAlignedText}>{data.customerDocumentLabel}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.colorBlack}>Emissão</Text>
          <Text style={styles.colorBlack}>{data.issuedAtLabel}</Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Produtos</Text>
          {data.products.map(product => (
            <View key={product.id} style={styles.productRow}>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.description}</Text>
                <Text style={styles.productPrice}>{product.unitPriceLabel}</Text>
              </View>

              <View style={styles.productInfo}>
                <View style={styles.productInfoBlock}>
                  <Text style={styles.colorBlack}>DESC</Text>
                  <Text style={styles.colorBlack}>{product.discountLabel}</Text>
                </View>

                <View style={styles.productInfoBlock}>
                  <Text style={styles.colorBlack}>QTD</Text>
                  <Text style={styles.colorBlack}>{product.quantityLabel}</Text>
                </View>

                <View style={styles.productInfoBlock}>
                  <Text style={styles.colorBlack}>VLR UN</Text>
                  <Text style={styles.colorBlack}>{product.unitPriceLabel}</Text>
                </View>

                <View style={styles.productInfoBlock}>
                  <Text style={styles.colorBlack}>TOTAL</Text>
                  <Text style={styles.colorBlack}>{product.totalPriceLabel}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.sectionTitle}>Total</Text>

          <View style={styles.totalInfo}>
            <Text style={styles.colorBlack}>Total Bruto</Text>
            <Text style={styles.colorBlack}>{data.totalGrossLabel}</Text>
          </View>

          <View style={styles.totalInfo}>
            <Text style={styles.colorBlack}>Desconto:</Text>
            <Text style={styles.colorBlack}>
              {data.discountAmountLabel} ({data.discountPercentLabel}%)
            </Text>
          </View>

          <View style={styles.totalInfo}>
            <Text style={styles.colorBlack}>Total Líquido</Text>
            <Text style={styles.colorBlack}>{data.totalNetLabel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          {data.paymentMethods.map(paymentMethod => (
            <View key={paymentMethod.id} style={styles.paymentRow}>
              <Text style={styles.colorBlack}>{paymentMethod.description}</Text>
              <View style={styles.paymentDetails}>
                <Text style={styles.colorBlack}>{paymentMethod.amountLabel}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlers.handleSharePdf}>
          <Text style={styles.buttonText}>Compartilhar PDF</Text>
        </TouchableOpacity>

        <ShowIf condition={!derivedState.isSyncedOrder}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handlers.handleSendOrder}>
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
