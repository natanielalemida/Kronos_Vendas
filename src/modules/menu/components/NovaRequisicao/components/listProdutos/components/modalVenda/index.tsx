import {
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../../../../../styles';
import {ModalType} from './type/modalType';
import UseForm from './hooks/useForm';
import UseSetSelecteds from '../../hooks/useSetSelecteds';
import {ProdutoDto} from '../../../../../../../../sync/products/type';
import {useCliente} from '../../../../../Clientes/context/clientContext';
import {useEffect} from 'react';

export default function ModalVenda({
  isActive,
  produto,
  setIsActive,
}: ModalType) {
  const {usuario} = useCliente();
  const {
    handleTextChange,
    cleanForm,
    setObservacao,
    setQuantidade,
    setDesconto,
    setValorVenda,
    valorVenda,
    desconto,
    observacao,
    quantidade,
  } = UseForm({produto, setIsActive});

  const {addQuantidadeAndObsToProduct, selectedProduto} = UseSetSelecteds({
    setIsActive,
    setObservacao,
    setQuantidade,
    cleanForm,
    produto,
    isActive,
  });

  const handleValorVenda = () => {
    if (!usuario?.DescontoMaximoVenda || !valorVenda || !desconto) {
      setDesconto('0.00');
      setValorVenda(produto?.ValorVenda.toFixed(2));
      return;
    }

    // Substitui qualquer caractere que não seja número ou ponto, para garantir que números decimais sejam processados
    const number = valorVenda.replace(/[^0-9.]/g, '');
    const valor = parseFloat(number);

    const total = parseFloat(produto?.ValorVenda); // valor total do produto
    const totalMaximoDesconto = (usuario?.DescontoMaximoVenda / 100) * total; // valor máximo de desconto permitido

    if (valor > total) {
      // Se o valor fornecido for maior que o valor do produto, define o desconto com base na diferença
      const descontoCalculado = ((total - valor) / total) * 100;
      setDesconto(descontoCalculado.toFixed(2)); // Define o desconto em percentual
      setValorVenda(valor.toFixed(2));
    } else if (valor < total - totalMaximoDesconto) {
      // Se o valor for menor do que o permitido, ajusta para o valor máximo possível
      setValorVenda((total - totalMaximoDesconto).toFixed(2));
      setDesconto(usuario?.DescontoMaximoVenda.toFixed(2)); // Define o desconto máximo
    } else {
      // Calcula o desconto normalmente
      const descontoCalculado = ((total - valor) / total) * 100;
      setDesconto(descontoCalculado.toFixed(2)); // Define o desconto com base no valor inserido
      setValorVenda(valor.toFixed(2));
    }
  };
  const handleDesconto = () => {
    if (!usuario?.DescontoMaximoVenda || !desconto) {
      setDesconto('0.00');
      setValorVenda(produto?.ValorVenda.toFixed(2));
      return;
    }

    // Substitui qualquer caractere que não seja número ou ponto
    const number = desconto.replace(/[^0-9.]/g, '');
    const valor = parseFloat(number);

    if (valor > usuario?.DescontoMaximoVenda) {
      setDesconto(usuario?.DescontoMaximoVenda.toFixed(2));
      const porcentagemDesconto = usuario?.DescontoMaximoVenda / 100;
      const taxa = porcentagemDesconto * Number(produto?.ValorVenda);
      setValorVenda((Number(produto?.ValorVenda) - taxa).toFixed(2));
    } else {
      setDesconto(valor.toFixed(2));
      const porcentagemDesconto = valor / 100;
      const taxa = porcentagemDesconto * Number(produto?.ValorVenda);
      setValorVenda((Number(produto?.ValorVenda) - taxa).toFixed(2));
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      visible={isActive}
      onRequestClose={() => {
        cleanForm();
      }}>
      <View style={styles.modalBackground}>
        <KeyboardAvoidingView behavior="padding" style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedProduto?.Descricao}</Text>
          <View style={styles.modalHeader}>
            <View style={styles.inputContainer}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.centeredText}>Estoque</Text>
                  <Text style={styles.centeredTextInput}>1</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.centeredText}>Valor Produto</Text>
                  <Text style={styles.centeredTextInput}>
                    R$ {selectedProduto?.ValorVenda.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.rowSpaceAround}>
                <View style={styles.halfWidth}>
                  <Text style={styles.paddedCenteredText}>Valor da Venda</Text>
                  <TextInput
                    style={styles.borderedCenteredTextInput}
                    value={valorVenda}
                    onEndEditing={handleValorVenda}
                    onChangeText={setValorVenda}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.paddedCenteredText}>Desconto</Text>
                  <TextInput
                    style={styles.borderedCenteredTextInput}
                    value={desconto}
                    onEndEditing={handleDesconto}
                    onChangeText={setDesconto}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.paddingVertical10}>
                <Text style={styles.boldCenteredText}>Quantidade</Text>
                <View style={styles.rowSpaceAround}>
                  <Icon
                    onPress={() => setQuantidade(value => value - 1)}
                    name="remove-circle-sharp"
                    size={25}
                    color={colors.cancelButton}
                  />
                  <TextInput
                    value={`${quantidade}`}
                    onChangeText={value => handleTextChange(value)}
                    keyboardType="numeric"
                    style={styles.quantityInput}
                  />

                  <Icon
                    name="add-circle-sharp"
                    onPress={() => setQuantidade(value => Number(value) + 1)}
                    size={25}
                    color={colors.arcGreen}
                  />
                </View>
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.inputContainerWithPadding}>
              <Text style={styles.leftAlignedText}>Observação</Text>
              <TextInput value={observacao} onChangeText={setObservacao} />
              <View style={styles.divider} />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.rowSpaceAroundWithPaddingBottom}>
                <Text>Total</Text>
                <Text>
                  R$ {(parseFloat(valorVenda) * quantidade).toFixed(2)}
                </Text>
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.inputContainerWithPaddingBottom}>
              <View style={styles.rowSpaceAroundWithPaddingTop}>
                <TouchableOpacity
                  onPress={() => cleanForm()}
                  style={styles.cancelButton}>
                  <Icon name="close-circle-sharp" size={25} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() =>
                    addQuantidadeAndObsToProduct(
                      selectedProduto as ProdutoDto,
                      quantidade,
                      observacao,
                      valorVenda,
                      desconto,
                    )
                  }>
                  <Icon
                    name="checkmark-circle-sharp"
                    size={25}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    width: '100%',
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 16,
    paddingHorizontal: 25,
    padding: 10,
    color: 'black',
    width: '100%',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
  inputContainerWithPadding: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputContainerWithPaddingBottom: {
    width: '100%',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowSpaceAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  rowSpaceAroundWithPaddingBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
  },
  rowSpaceAroundWithPaddingTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  column: {
    width: '48%',
  },
  halfWidth: {
    width: '50%',
  },
  centeredTextInput: {
    textAlign: 'center',
    paddingVertical: 10,
  },
  borderedCenteredTextInput: {
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  centeredText: {
    textAlign: 'center',
    fontWeight: '900',
  },
  boldCenteredText: {
    textAlign: 'center',
    fontWeight: '900',
  },
  leftAlignedText: {
    textAlign: 'left',
    fontWeight: '900',
  },
  paddedCenteredText: {
    paddingVertical: 10,
    textAlign: 'center',
    fontWeight: '900',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  cancelButton: {
    backgroundColor: colors.cancelButton,
    width: '45%',
    borderRadius: 3,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.confirmButton,
    width: '45%',
    borderRadius: 3,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '25%',
    textAlign: 'center',
    paddingVertical: 10,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
});
