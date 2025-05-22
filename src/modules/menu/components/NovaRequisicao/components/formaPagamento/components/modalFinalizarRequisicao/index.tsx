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
  const {
    setFinalizarVenda,
    setProdutosSelecionados,
    ProdutosSelecionados,
    usuario,
  } = useCliente();

  console.log({ProdutosSelecionados})

  const handleMountBoyd = () => {
    setFinalizarVenda({
      ValorBruto: parseFloat(calcularTotal()),
      Desconto: usuario?.DescontoMaximoVenda as number,
      ValorTotal: parseFloat(valorTotal),
      Observacao,
    });
    // const newArray = ProdutosSelecionados.map(produto => {
    //   // Calcula o valor do desconto
    //   const valorDesconto = produto.ValorVenda * (parseFloat(desconto) / 100);

    //   // Aplica o desconto ao valor original
    //   const novoValorVendaDesconto = produto.ValorVenda - valorDesconto;

    //   return {
    //     ...produto,
    //     ValorVendaDesconto: novoValorVendaDesconto, // Atualiza o valor com o desconto aplicado
    //   };
    // });

    // setProdutosSelecionados(newArray);

    setIsModalActive(false);
  };

  const handleDescontoChange = () => {
    if (!usuario?.DescontoMaximoVenda || !desconto) {
      setDesconto('0.00');
      setValorTotal(parseFloat(calcularTotal()).toFixed(2));
      return;
    }

    const number = desconto.replace(/[^0-9.]/g, '');
    let valor = parseFloat(number);

    const total = parseFloat(calcularTotal());
    // Cálculo do desconto mínimo
    const totalBruto = parseFloat(calcularTotalSemDesconto());
    const descontoMinimo = ((totalBruto - total) / totalBruto) * 100;

    if (valor > usuario.DescontoMaximoVenda) {
      valor = usuario.DescontoMaximoVenda;
    }

    setDesconto(valor.toFixed(2));

    const porcentagemDesconto = valor / 100;
    const taxa = porcentagemDesconto * totalBruto;

    setValorTotal((totalBruto - taxa).toFixed(2));

    const newArray = ProdutosSelecionados.map(produto => {
      // Calcula o valor do desconto
      const valorDesconto =
        produto.ValorVenda * (parseFloat(valor.toFixed(2)) / 100);

      // Aplica o desconto ao valor original
      const novoValorVendaDesconto = produto.ValorVenda - valorDesconto;

      return {
        ...produto,
        ValorVendaDesconto: novoValorVendaDesconto, // Atualiza o valor com o desconto aplicado
      };
    });

    setProdutosSelecionados(newArray);
  };

  const handleValorVenda = () => {
    if (!usuario?.DescontoMaximoVenda || !valorTotal) {
      setDesconto('0.00');
      setValorTotal(parseFloat(calcularTotal()).toFixed(2));
      return;
    }
    const number = valorTotal.replace(/[^0-9.]/g, '');
    const valor = parseFloat(number);

    const total = parseFloat(calcularTotal());
    const totalSemDesconto = parseFloat(calcularTotalSemDesconto());
    const valorPorcentagem = parseFloat(usuario?.DescontoMaximoVenda) / 100;
    const totalMaximoDesconto = valorPorcentagem * totalSemDesconto;

    if (valor < total - totalMaximoDesconto) {
      setValorTotal((totalSemDesconto - totalMaximoDesconto).toFixed(2));
      setDesconto(usuario?.DescontoMaximoVenda.toFixed(2));
      const newArray = ProdutosSelecionados.map(produto => {
        // Calcula o valor do desconto
        const valorDesconto =
          produto.ValorVenda *
          (parseFloat(usuario?.DescontoMaximoVenda.toFixed(2)) / 100);

        // Aplica o desconto ao valor original
        const novoValorVendaDesconto = produto.ValorVenda - valorDesconto;

        return {
          ...produto,
          ValorVendaDesconto: novoValorVendaDesconto, // Atualiza o valor com o desconto aplicado
        };
      });

      setProdutosSelecionados(newArray);
    } else {
      setValorTotal(valor.toFixed(2));

let novoDesconto = ((totalSemDesconto - valor) / totalSemDesconto) * 100;
if (novoDesconto < 0) novoDesconto = 0;
setDesconto(Math.round(novoDesconto * 100) / 100);


      const newArray = ProdutosSelecionados.map(produto => {
        // Calcula o valor do desconto
        const valorDesconto =
          produto.ValorVenda * (parseFloat(novoDesconto) / 100);

        // Aplica o desconto ao valor original
        const novoValorVendaDesconto = produto.ValorVenda - valorDesconto;

        return {
          ...produto,
          ValorVendaDesconto: novoValorVendaDesconto, // Atualiza o valor com o desconto aplicado
        };
      });

      setProdutosSelecionados(newArray);
    }
  };

  const calcularTotal = () => {
    return ProdutosSelecionados.reduce(
      (acc, item) => acc + item.Quantidade * item.ValorVendaDesconto,
      0,
    ).toFixed(2);
  };

  const calcularTotalSemDesconto = () => {
    return ProdutosSelecionados.reduce((acc, item) => {
      return acc + item.Quantidade * item.ValorVenda;
    }, 0).toFixed(2);
  };

  const calcularTotalSemDescontoExibir = () => {
  const total = ProdutosSelecionados.reduce((acc, item) => {
    const valorUnitario =
      item.TaxaDesconto === '0.00' ? item.ValorVendaDesconto : item.ValorVenda;

    return acc + item.Quantidade * valorUnitario;
  }, 0);

  return (Math.round(total * 100) / 100).toFixed(2);
};

  const porcentagemDesconto = () => {
    const totalBruto = calcularTotalSemDesconto();

    const descontoInicial = ProdutosSelecionados.reduce((acc, item) => {
      return (
        acc + (item.ValorVenda - item.ValorVendaDesconto) * item.Quantidade
      );
    }, 0);

    const porcentagem = (descontoInicial / Number(totalBruto)) * 100;
    return porcentagem < 0 ? 0 : porcentagem;
  };

  useEffect(() => {
    if (isActive) {
      setDesconto(porcentagemDesconto().toFixed(2));

      const totalBruto = calcularTotalSemDesconto();

      const descontoInicial = ProdutosSelecionados.reduce((acc, item) => {
        return (
          acc + (item.ValorVenda - item.ValorVendaDesconto) * item.Quantidade
        );
      }, 0);

      const valorTotalComDesconto = Number(totalBruto) - descontoInicial;
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
                  R$ {calcularTotalSemDescontoExibir()}
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
                  style={styles.valueText}
                  onEndEditing={handleValorVenda}
                  onChangeText={setValorTotal}
                  value={valorTotal}
                />
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.modalHeader}>
              <View
                style={{
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  width: '100%',
                }}>
                <Text style={styles.labelTextInput}>Observacao:</Text>
                <TextInput
                  style={styles.valueText}
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
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    width: '90%',
    alignSelf: 'center',
    paddingTop: 10,
  },
  centeredContent: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  labelText: {
    fontSize: 16,
    color: 'black',
  },
  valueText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  labelTextInput: {
    color: colors.black,
    fontSize: 16,
    paddingBottom: 10,
  },
  inputText: {
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    alignSelf: 'center',
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});
