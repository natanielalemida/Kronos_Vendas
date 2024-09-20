import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../../../styles';
import {useCliente} from '../../../Clientes/context/clientContext';

import Icon from 'react-native-vector-icons/Ionicons';
import {ShowIf} from '../../../../../components/showIf';
import ModalFinalizarRequisicao from './components/modalFinalizarRequisicao';
import {useState} from 'react';
import UseModal from './hooks/useModal';
import ModalCondicaoPagamento from './components/modalCondicaoPagamento';
import SavePedido from './hooks/savePedido';
import {useRoute} from '@react-navigation/native';

export default function FormaPagamento() {
  const router = useRoute();
  const {params} = router;
  const {id} = params || {};
  const {ProdutosSelecionados, valorPago, formaPagamento} = useCliente();
  const [isModalPagamentoAtivo, setModalPagamento] = useState<boolean>(false);
  const {handleCloseModal, setIsModalActive, isActive} = UseModal();
  const {handleSave} = SavePedido();

  const calcularTotal = () => {
    return ProdutosSelecionados.reduce(
      (acc, item) => acc + item.Quantidade * item.ValorVendaDesconto,
      0,
    ).toFixed(2);
  };

  const renderIcon = (iconName: string, label: string, onPress: () => void) => (
    <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
      <Icon name={iconName} size={25} color={colors.white} />
      <Text style={styles.iconText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ModalFinalizarRequisicao
        isActive={isActive}
        handleCloseModal={handleCloseModal}
        setIsModalActive={setIsModalActive}
      />
      <ModalCondicaoPagamento
        setActive={setModalPagamento}
        isActive={isModalPagamentoAtivo}
      />
      <View style={{flex: 1}}>
        {formaPagamento &&
          formaPagamento.length > 0 &&
          formaPagamento.map(pagamento => {
            return (
              <View style={styles.itemContainer} key={`${pagamento.Codigo}`}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemCode}>{pagamento.Codigo}</Text>
                  <Text style={styles.itemDescription}>
                    {pagamento.Descricao}
                  </Text>
                </View>
                {pagamento.CondicaoPagamento.map(codicao => {
                  return (
                    <View>
                      <Text>{`${codicao.Codigo} | ${codicao.IntervaloDias}/DIAS - R$ ${codicao.ValorPago}`}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
      </View>
      <View style={styles.bottom}>
        <View style={styles.leftIcon}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>R$ {calcularTotal()}</Text>
          </View>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Pago</Text>
          <Text style={styles.totalText}>R$ {valorPago.toFixed(2)}</Text>
        </View>
        <View style={styles.rightIcon}>
          <ShowIf
            condition={
              ProdutosSelecionados.length > 0 &&
              valorPago.toFixed(2) !== calcularTotal()
            }>
            {renderIcon('add-sharp', 'Pagamento', () =>
              setModalPagamento(true),
            )}
          </ShowIf>
          <ShowIf
            condition={
              ProdutosSelecionados.length > 0 &&
              valorPago.toFixed(2) === calcularTotal()
            }>
            {renderIcon('checkmark-outline', 'Finalizar', () => handleSave(id))}
          </ShowIf>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flex: 1,
    width: '100%',
  },
  itemContainer: {
    padding: 15,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemLeft: {
    flexDirection: 'row',
  },
  itemCode: {
    marginRight: 5,
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemDescription: {
    marginHorizontal: 10,
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemPrice: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetailsLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
  bottom: {
    flexDirection: 'row',
    backgroundColor: colors.arcGreen,
    padding: 16,
    alignItems: 'center',
  },
  leftIcon: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightIcon: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: colors.white,
    fontSize: 14,
  },
  totalContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    color: colors.white,
  },
});
