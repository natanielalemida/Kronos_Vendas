import {Ionicons} from '@expo/vector-icons';
import {CheckBox} from '@rneui/themed';
import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import Search from '@/modules/components/search';
import Loading from '@/modules/components/loading/Loading';
import {HeaderProducts} from '@/modules/components/headers/HeaderProducts';
import Tag from '@/modules/components/tag/tag';
import {colors} from '@/modules/styles';

import {OrdersFilterModal} from '../components/OrdersFilterModal';
import {formatOrderDate} from '../helpers/order-formatters';
import {getOrderRowBackgroundColor} from '../helpers/orders-page.helpers';
import {useSetupOrdersPage} from '../hooks/useSetupOrdersPage';
import {styles} from '../styles/ordersPage.styles';

export default function OrdersPage(): React.JSX.Element {
  const {data, derivedState, handlers, navigation, viewState} =
    useSetupOrdersPage();

  return (
    <>
      <HeaderProducts
        label="Pedidos"
        leftColor={colors.white}
        rightColor={colors.white}
        leftSize={25}
        rightSize={25}
        leftIcon={
          derivedState.hasCustomerContext ? 'chevron-back-outline' : 'menu'
        }
        rightIcon="cloud-upload-outline"
        onPressLeftIcon={
          derivedState.hasCustomerContext
            ? navigation.goBack
            : navigation.toggleDrawer
        }
        onPressRightIcon={() => {
          handlers.handleSendOrders().catch(error => {
            console.error('Error while sending selected orders', error);
          });
        }}
      />

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Search
            placeholder="Pesquisar..."
            value={data.textFilter}
            onChangeText={handlers.handleTextFilterChange}
          />

          <TouchableOpacity
            ref={data.filterIconRef}
            style={styles.filterIcon}
            onPress={handlers.handleOpenFilterModal}>
            <Ionicons name="filter" size={25} color={colors.black} />
          </TouchableOpacity>
        </View>

        <Loading isModalLoadingActive={data.isLoading} />

        <ScrollView style={styles.scrollContainer}>
          {data.filteredOrders.map((order, index) => {
            const isSelected = data.selectedOrders.some(
              selectedOrder => selectedOrder.id === order.id,
            );

            return (
              <TouchableOpacity
                key={`${order.Codigo}-${order.id}`}
                onPress={() => handlers.handleOrderPress(order)}
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: getOrderRowBackgroundColor(
                      index,
                      isSelected,
                    ),
                  },
                ]}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemCode}>{order.Codigo} -</Text>
                  <Text style={styles.itemDescription}>
                    {order.NomeFantasia}
                  </Text>
                  <Text style={styles.itemPrice}>
                    R$ {order.ValorRecebido.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.bottomRow}>
                  <Text style={styles.labelText}>
                    Emissão: {formatOrderDate(order.DataEmissao)}
                  </Text>

                  <View style={styles.itemMetaContainer}>
                    <Tag
                      color={data.statusLabels[order.Situacao].color}
                      label={data.statusLabels[order.Situacao].label}
                    />

                    <View style={styles.syncContainer}>
                      <Text style={styles.syncLabel}>Sinc</Text>
                      <CheckBox
                        checked={!!order.Codigo}
                        containerStyle={styles.checkboxContainer}
                        onPress={() => handlers.handleSelectOrder(order)}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <OrdersFilterModal
          options={data.options}
          setOptions={handlers.setOptions}
          visible={viewState.isFilterModalVisible}
          onClose={handlers.handleCloseFilterModal}
          position={data.filterModalPosition}
        />
      </View>
    </>
  );
}
