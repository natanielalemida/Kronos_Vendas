import {
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../../../../../styles';
import {ModalType} from './type/modalType';
import UseForm from './hooks/useForm';
import UseSetSelecteds from '../../hooks/useSetSelecteds';
import {ProdutoDto} from '../../../../../../../../sync/products/type';
import {useCliente} from '../../../../../Clientes/context/clientContext';
import {useEffect, useState} from 'react';
import {ShowIf} from '../../../../../../../components/showIf';

export default function ModalVenda({
  isActive,
  produto,
  isAtacadoActive,
  canSetAtacado,
  isEditing,
  setAtacadoActive,
  setIsActive,
}: ModalType) {
  const [isAtacado, setAtacado] = useState(false);

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
  } = UseForm({produto, isAtacadoActive, isAtacado, setIsActive});

  const handleClose = () => {
    setAtacado(false);
    if (setAtacadoActive) {
      setAtacadoActive(false);
    }
    cleanForm();
  };

  const {addQuantidadeAndObsToProduct, selectedProduto} = UseSetSelecteds({
    setIsActive,
    setObservacao,
    setQuantidade,
    cleanForm: handleClose,
    produto,
    isActive,
  });

  const handleValorVenda = () => {
    const valorVendaEdit = isEditing
      ? produto?.ValorVendaDesconto
      : produto?.ValorVenda;
    const total = isAtacado ? produto?.ValorVendaAtacado : valorVendaEdit;

    if (!valorVenda) {
      setDesconto('0.00');
      setValorVenda(total?.toFixed(2));
      return;
    }

    const maxDesconto = usuario?.DescontoMaximoVenda / 100 || 0;
    const descontoMaximo = total * maxDesconto;
    const valorNumerico = parseFloat(valorVenda.replace(/[^0-9.]/g, ''));

    if (valorNumerico > total) {
      const descontoCalculado = ((total - valorNumerico) / total) * 100;
      setDesconto(descontoCalculado.toFixed(2));
    } else if (valorNumerico < total - descontoMaximo) {
      setValorVenda((total - descontoMaximo).toFixed(2));
      setDesconto(usuario?.DescontoMaximoVenda.toFixed(2));
    } else {
      const descontoCalculado = ((total - valorNumerico) / total) * 100;
      setDesconto(descontoCalculado.toFixed(2));
    }
  };

  const handleDesconto = () => {
    const valorVendaEdit = isEditing
      ? produto?.ValorVendaDesconto
      : produto?.ValorVenda;
    const total = isAtacado ? produto?.ValorVendaAtacado : valorVendaEdit;

    if (!desconto) {
      setDesconto('0.00');
      setValorVenda(total?.toFixed(2));
      return;
    }

    const maxDesconto = usuario?.DescontoMaximoVenda || 0;
    const descontoNumerico = parseFloat(desconto.replace(/[^0-9.]/g, ''));

    if (descontoNumerico > maxDesconto) {
      setDesconto(maxDesconto.toFixed(2));
      const valorComDesconto = total - (maxDesconto / 100) * total;
      setValorVenda(valorComDesconto.toFixed(2));
    } else {
      const valorComDesconto = total - (descontoNumerico / 100) * total;
      setValorVenda(valorComDesconto.toFixed(2));
    }
  };

  useEffect(() => {
    setAtacado(isAtacadoActive);
  }, [isAtacadoActive]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      visible={isActive}
      onRequestClose={cleanForm}>
      <View style={styles.modalBackground}>
        <KeyboardAvoidingView behavior="padding" style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedProduto?.Descricao}</Text>
          <View style={styles.modalHeader}>
            <ShowIf condition={canSetAtacado}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 10,
                }}>
                <Switch
                  disabled={!canSetAtacado}
                  value={isAtacado}
                  onChange={() => setAtacado(!isAtacado)}
                />
                <Text style={styles.centeredTextInput}>Valor atacado</Text>
              </View>
            </ShowIf>

            <View style={styles.inputContainer}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.centeredText}>Estoque</Text>
                  <Text style={styles.centeredTextInput}>1</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.centeredText}>Valor Produto</Text>
                  <Text style={styles.centeredTextInput}>
                    R$
                    {isAtacado
                      ? selectedProduto?.ValorVendaAtacado.toFixed(2)
                      : isEditing
                      ? selectedProduto?.ValorVendaDesconto.toFixed(2)
                      : selectedProduto?.ValorVenda.toFixed(2)}
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
                    keyboardType="numeric"
                    style={styles.borderedCenteredTextInput}
                    value={valorVenda}
                    onEndEditing={handleValorVenda}
                    onChangeText={setValorVenda}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.paddedCenteredText}>Desconto</Text>
                  <TextInput
                    keyboardType="numeric"
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
                    onPress={() =>
                      setQuantidade(value => Math.max(value - 1, 1))
                    }
                    name="remove-circle-sharp"
                    size={25}
                    color={colors.cancelButton}
                  />
                  <TextInput
                    value={`${quantidade}`}
                    onChangeText={handleTextChange}
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
                  onPress={handleClose}
                  style={styles.cancelButton}>
                  <Icon name="close-circle-sharp" size={25} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    const valorProduto = isAtacado
                      ? selectedProduto?.ValorVendaAtacado.toFixed(2)
                      : isEditing
                      ? selectedProduto?.ValorVendaDesconto.toFixed(2)
                      : selectedProduto?.ValorVenda.toFixed(2);

                    addQuantidadeAndObsToProduct(
                      selectedProduto as ProdutoDto,
                      quantidade,
                      observacao,
                      valorVenda,
                      valorProduto,
                    );
                  }}>
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
