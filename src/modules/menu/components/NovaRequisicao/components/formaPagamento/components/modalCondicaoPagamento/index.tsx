import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../../../../../styles';
import SelectPayment from './components';
import {useEffect, useState} from 'react';
import UseRepository from '../../hooks/useRepository';
import {
  CondicaoPagamento,
  FormaPagamento,
} from '../../../../../../../../sync/pagamentos/type';
import SelectCondicao from './components/selectCodincao';
import {useCliente} from '../../../../../Clientes/context/clientContext';
import {ModalType} from './type';
import {ShowIf} from '../../../../../../../components/showIf';

export default function ModalCondicaoPagamento({
  isActive,
  setActive,
}: ModalType) {
  const [valorPagamento, setValorPagamento] = useState('0.00');
  const [pagamentoForma, setPagameto] = useState<FormaPagamento>();
  const [condicaoPagamento, setCondicaoPagamento] =
    useState<CondicaoPagamento>();
  const {formaPagamento, handleFetchData} = UseRepository();

  useEffect(() => {
    handleFetchData();
    handleTeste();
  }, [isActive]);

  const handleTeste = () => {
    const value = finalizarVenda?.ValorTotal - valorPago;
    setValorPagamento(value.toFixed(2));
  };

  const {
    setValorPago,
    valorPago,
    ProdutosSelecionados,
    setFormaPagameto,
    finalizarVenda,
  } = useCliente();

  const calcularTotal = () => {
    return ProdutosSelecionados.reduce(
      (acc, item) => acc + item.Quantidade * item.ValorVendaDesconto,
      0,
    ).toFixed(2);
  };

  const handleConfirmPayment = () => {
    if (!formaPagamento || !valorPagamento || !condicaoPagamento) {
      Alert.alert(
        'Campos obrigatorios',
        'Por favor, selecione uma forma de pagamento',
      );
      return;
    }

    const valorTotal = parseFloat(calcularTotal());
    const valorTotalMenosValorPago = valorTotal - valorPago;
    const valorTotalPago = valorPagamento.replace(/[^0-9.]+/g, '');

    const valorNumber = parseFloat(valorTotalPago);

    setFormaPagameto((prevValue = []) => {
      // Encontra o índice da forma de pagamento que tem o mesmo id
      const existingFormaPagamentoIndex = prevValue.findIndex(
        item => item.id === pagamentoForma.id,
      );

      if (existingFormaPagamentoIndex !== -1) {
        // Atualiza a forma de pagamento existente
        return prevValue.map((item, index) =>
          index === existingFormaPagamentoIndex
            ? {
                ...item,
                CondicaoPagamento: [
                  ...item.CondicaoPagamento, // Mantém as condições de pagamento existentes
                  {
                    ...condicaoPagamento,
                    ValorPago: valorNumber, // Adiciona a propriedade ValorPago com o valor de valorPagamento
                  },
                ],
              }
            : item,
        );
      } else {
        // Cria uma nova forma de pagamento
        return [
          ...prevValue,
          {
            ...pagamentoForma, // Copia todas as propriedades da forma de pagamento
            CondicaoPagamento: [
              {
                ...condicaoPagamento,
                ValorPago: valorNumber, // Adiciona a propriedade ValorPago com o valor de valorPagamento
              },
            ],
          },
        ];
      }
    });

    if (valorNumber > valorTotalMenosValorPago) {
      setValorPago(parseFloat(valorTotalMenosValorPago.toFixed(2)));
      handleCloseModal();
      return;
    }

    setValorPago(valorPago + valorNumber);

    handleCloseModal();
  };

  const handleSetValue = () => {
    const valorTotal = parseFloat(calcularTotal());
    const valorTotalMenosValorPago = valorTotal - valorPago;
    const valorTotalPago = valorPagamento.replace(/[^0-9.]+/g, '');

    const valorNumber = parseFloat(valorTotalPago);

    if (valorNumber > valorTotalMenosValorPago) {
      setValorPagamento(valorTotalMenosValorPago.toFixed(2));

      return;
    }

    setValorPagamento(isNaN(valorNumber) ? '0.00' : valorNumber.toFixed(2));
  };

  const handleCloseModal = () => {
    setPagameto(undefined);
    setValorPagamento('0.00');
    setCondicaoPagamento(undefined);
    setActive(false);
  };

  const handleSetPagamento = value => {
    setPagameto(value);
    setCondicaoPagamento(value.CondicaoPagamento[0]);
  };

  return (
    <Modal visible={isActive} animationType="slide">
      <StatusBar
        translucent
        backgroundColor="transparent" // Faz o fundo da StatusBar transparente
        barStyle="dark-content" // Use "light-content" se o fundo da sua tela for escuro
      />

      <View style={styles.container}>
        <View style={{flex: 1, padding: 20}}>
          <View>
            <View style={{paddingVertical: 5}}>
              <Text style={{color: colors.black, fontWeight: '600'}}>
                Forma de Pagamento:
              </Text>
            </View>
            <SelectPayment
              value={pagamentoForma?.Descricao}
              placeholder="Selecione a Forma de Pagamento"
              data={formaPagamento}
              onTextChange={handleSetPagamento}
            />
          </View>

          <ShowIf condition={pagamentoForma?.CondicaoPagamento.length > 1}>
            <View style={{paddingVertical: 15}}>
              <View style={{paddingVertical: 5}}>
                <Text style={{color: colors.black, fontWeight: '600'}}>
                  Condição de Pagamento:
                </Text>
              </View>

              <SelectCondicao
                value={condicaoPagamento}
                placeholder="Selecione a Condição de Pagamento"
                data={pagamentoForma?.CondicaoPagamento}
                onTextChange={setCondicaoPagamento}
              />
            </View>
          </ShowIf>
          <View style={{paddingVertical: 15}}>
            <View style={{paddingVertical: 5}}>
              <Text style={{color: colors.black, fontWeight: '600'}}>
                Valor do Pagamento
              </Text>
            </View>
            <TextInput
              value={valorPagamento}
              onEndEditing={handleSetValue}
              onChangeText={setValorPagamento}
              keyboardType="decimal-pad"
              returnKeyType="done"
              style={{
                borderBottomColor: colors.black,
                borderBottomWidth: 1,
                color: colors.black,
              }}
            />
          </View>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={handleCloseModal}>
            <Icon name="close-circle-sharp" size={25} color={colors.white} />
            <Text style={styles.totalText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={handleConfirmPayment}>
            <Icon
              name="checkmark-circle-sharp"
              size={25}
              color={colors.white}
            />
            <Text style={styles.totalText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
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
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor: colors.arcGreen,
    padding: 16,
    alignItems: 'center',
  },
  leftIcon: {
    flex: 1,
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
  totalText: {
    fontSize: 18,
    color: colors.white,
  },
});
