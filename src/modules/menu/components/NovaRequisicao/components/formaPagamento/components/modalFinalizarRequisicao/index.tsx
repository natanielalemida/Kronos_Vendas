import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {colors} from '../../../../../../../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {ModalProps} from './type';
import {useCliente} from '../../../../../Clientes/context/clientContext';
import {useEffect, useState} from 'react';

export default function ModalFinalizarRequisicao({
  handleCloseModal,
  setIsModalActive,
  isActive,
}: ModalProps) {
  const [Observacao, setObservacao] = useState('');
  const [valorTotal, setValorTotal] = useState('0.00');
  const [desconto, setDesconto] = useState('0.00');
  const {setFinalizarVenda, ProdutosSelecionados, usuario} = useCliente();

  const handleMountBoyd = () => {
    setFinalizarVenda({
      ValorBruto: parseFloat(calcularTotal()),
      Desconto: usuario?.DescontoMaximoVenda as number,
      ValorTotal: parseFloat(valorTotal),
      Observacao,
    });
    setIsModalActive(false);
  };

  const handleDescontoChange = () => {
    if (!usuario?.DescontoMaximoVenda || !desconto) {
      setDesconto('0.00');
      setValorTotal(parseFloat(calcularTotal()).toFixed(2));
      return;
    }
    const number = desconto.replace(/[^0-9.]/g, ''); // Remove caracteres não numéricos
    let valor = parseFloat(number); // Converte para número

    // Se o valor digitado for maior que o máximo permitido, ajusta para o valor máximo
    if (valor > usuario?.DescontoMaximoVenda) {
      valor = usuario.DescontoMaximoVenda;
      setDesconto(valor.toFixed(2)); // Atualiza o campo de desconto
    } else {
      setDesconto(valor.toFixed(2));
    }

    // Calcula a porcentagem do desconto
    const porcentagemDesconto = valor / 100;
    const taxa = porcentagemDesconto * Number(calcularTotal()); // Aplica o desconto sobre o total

    // Atualiza o valor total com o desconto aplicado
    setValorTotal((Number(calcularTotal()) - taxa).toFixed(2));
  };

  const handleDesconto = () => {
    // Se não houver valor máximo de desconto ou o campo de desconto estiver vazio
    if (!usuario?.DescontoMaximoVenda || !desconto) {
      setDesconto('0.00');
      setValorTotal(calcularTotal()); // Reseta o valor total sem desconto
      return;
    }

    // Remove qualquer caractere que não seja número ou ponto (ex: vírgulas, letras)
    const number = desconto.replace(/[^0-9.]/g, '');
    const valor = parseFloat(number);

    // Se o valor digitado for maior que o DescontoMaximoVenda
    if (valor > usuario?.DescontoMaximoVenda) {
      // Ajusta o desconto para o máximo permitido
      setDesconto(usuario.DescontoMaximoVenda.toFixed(2));

      // Calcula o desconto em porcentagem sobre o valor total
      const porcentagemDesconto = usuario.DescontoMaximoVenda / 100;
      const taxa = porcentagemDesconto * Number(calcularTotal());

      // Atualiza o valor total com o desconto máximo aplicado
      setValorTotal((Number(calcularTotal()) - taxa).toFixed(2));
    } else {
      // Caso o valor seja válido (menor ou igual ao desconto máximo)
      setDesconto(valor.toFixed(2));

      // Calcula o desconto em porcentagem
      const porcentagemDesconto = valor / 100;
      const taxa = porcentagemDesconto * Number(calcularTotal());

      // Atualiza o valor total com o desconto inserido
      setValorTotal((Number(calcularTotal()) - taxa).toFixed(2));
    }
  };

  const handleValorVenda = () => {
    if (!usuario?.DescontoMaximoVenda || !valorTotal) {
      setDesconto('0.00');
      setValorTotal(parseFloat(calcularTotal()).toFixed(2));
      return;
    }
    // Remove qualquer caractere que não seja número ou ponto do valorTotal
    const number = valorTotal.replace(/[^0-9.]/g, '');
    const valor = parseFloat(number);

    // Obtém o total calculado
    const total = parseFloat(calcularTotal());
    const totalSemDesconto = parseFloat(calcularTotalSemDesconto());
    // Verifica se existe um valor de desconto válido
    const valorPorcentagem = parseFloat(usuario?.DescontoMaximoVenda) / 100;
    const totalMaximoDesconto = valorPorcentagem * totalSemDesconto;

    if (valor > total) {
      // Se o valorTotal for maior que o total calculado, restaura para o total
      setValorTotal(total.toFixed(2));
      setDesconto(porcentagemDesconto().toFixed(2)); // Desconto zerado quando o valor total excede o limite
    } else if (valor < total - totalMaximoDesconto) {
      // Se o valor for menor que o total com o máximo de desconto aplicado
      setValorTotal((totalSemDesconto - totalMaximoDesconto).toFixed(2));
      setDesconto(usuario?.DescontoMaximoVenda.toFixed(2)); // Ajusta o desconto para o máximo permitido
    } else {
      // Se o valor está entre o total e o limite máximo de desconto
      setValorTotal(valor.toFixed(2));

      // Recalcula o desconto com base no novo valorTotal
      const novoDesconto = (
        ((totalSemDesconto - valor) / totalSemDesconto) *
        100
      ).toFixed(2);
      setDesconto(novoDesconto); // Atualiza o desconto com o valor correspondente
    }
  };

  const calcularTotal = () => {
    return ProdutosSelecionados.reduce(
      (acc, item) => acc + item.Quantidade * item.ValorVendaDesconto,
      0,
    ).toFixed(2);
  };

  const calcularTotalSemDesconto = () => {
    return ProdutosSelecionados.reduce(
      (acc, item) => acc + item.Quantidade * item.ValorVenda,
      0,
    ).toFixed(2);
  };

  const porcentagemDesconto = () => {
    const totalBruto = calcularTotalSemDesconto();

    // Verifica se algum produto já tem um desconto aplicado
    const descontoInicial = ProdutosSelecionados.reduce((acc, item) => {
      return (
        acc + (item.ValorVenda - item.ValorVendaDesconto) * item.Quantidade
      );
    }, 0);

    // Converte o desconto inicial para porcentagem com base no valor total
    return (descontoInicial / totalBruto) * 100;
  };

  useEffect(() => {
    if (isActive) {
      // Calcula o total bruto dos produtos selecionados

      // Ajusta o estado inicial com o desconto aplicado
      setDesconto(porcentagemDesconto().toFixed(2));

      // Calcula o valor total com o desconto já aplicado
      const totalBruto = calcularTotalSemDesconto();

      // Verifica se algum produto já tem um desconto aplicado
      const descontoInicial = ProdutosSelecionados.reduce((acc, item) => {
        return (
          acc + (item.ValorVenda - item.ValorVendaDesconto) * item.Quantidade
        );
      }, 0);

      const valorTotalComDesconto = totalBruto - descontoInicial;
      setValorTotal(valorTotalComDesconto.toFixed(2));
    }
  }, [isActive]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      visible={isActive}
      onRequestClose={handleCloseModal}>
      <View style={styles.modalBackground}>
        <KeyboardAvoidingView behavior="padding" style={styles.bro}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitleHeader}>FINALIZAÇÃO DA VENDA</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.modalHeader}>
              <View style={styles.centeredContent}>
                <Text style={styles.labelText}>Valor Bruto:</Text>
                <Text style={styles.valueText}>
                  R$ {calcularTotalSemDesconto()}
                </Text>
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.modalHeader}>
              <View style={styles.centeredContent}>
                <Text style={styles.labelText}>Desconto:</Text>
                <TextInput
                  style={styles.valueText}
                  value={desconto}
                  onChangeText={setDesconto}
                  onEndEditing={handleDescontoChange}
                />
              </View>
              <View style={styles.divider} />
            </View>
            <View style={styles.modalHeader}>
              <View style={styles.centeredContent}>
                <Text style={styles.labelTextInput}>Valor Total:</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.inputText}
                  onEndEditing={handleValorVenda}
                  onChangeText={setValorTotal}
                  value={valorTotal}
                />
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.labelTextInput}>Observacao:</Text>
                <TextInput
                  style={styles.inputText}
                  onChangeText={setObservacao}
                />
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.inputContainerWithPaddingBottom}>
              <View style={styles.rowSpaceAroundWithPaddingTop}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseModal}>
                  <Icon name="close-circle-sharp" size={25} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleMountBoyd}>
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
  rowSpaceAroundWithPaddingTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  inputContainerWithPaddingBottom: {
    width: '100%',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bro: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderRadius: 8,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    width: '100%',
    padding: 5,
  },
  modalTitleHeader: {
    fontSize: 16,
    paddingHorizontal: 25,
    paddingVertical: 10,
    color: 'black',
    fontWeight: '600',
    width: '100%',
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
  },
  centeredContent: {
    alignItems: 'center',
  },
  labelText: {
    paddingBottom: 10,
    fontWeight: '500',
    fontSize: 16,
  },
  labelTextInput: {
    fontWeight: '500',
    fontSize: 16,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '900',
  },
  inputText: {
    fontSize: 14,
    fontWeight: '900',
  },
});
