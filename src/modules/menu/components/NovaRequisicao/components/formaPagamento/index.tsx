import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {Modal, Button} from 'react-native';

export default function FormaPagamento() {
  const router = useRoute();
  const {params} = router;
  const {id} = params || {};
  const {
    ProdutosSelecionados,
    valorPago,
    formaPagamento,
    finalizarVenda,
    setFormaPagameto,
    setValorPago,
  } = useCliente();

  const [isModalPagamentoAtivo, setModalPagamento] = useState<boolean>(false);
  const [isModalConfirmVisible, setModalConfirmVisible] =
    useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const {handleCloseModal, setIsModalActive, isActive} = UseModal();
  const {handleSave} = SavePedido();

  const handleDelete = () => {
    if (selectedPayment) {
      // Subtrair o valor do pagamento excluído do valorPago atual
      const valorPagoAtualizado =
        valorPago -
        selectedPayment.CondicaoPagamento.reduce(
          (acc, condicao) => acc + condicao.ValorPago,
          0,
        );

      // Atualiza o estado do valorPago
      setValorPago(valorPagoAtualizado);

      // Atualiza a lista de forma de pagamento excluindo o item selecionado
      const updatedFormaPagamento = formaPagamento.filter(
        pagamento => pagamento.Codigo !== selectedPayment.Codigo,
      );
      setFormaPagameto(updatedFormaPagamento);

      setModalConfirmVisible(false);
    }
  };

  function adicionarDias(data: Date, dias: number): Date {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    return novaData;
  }

  // Função para formatar a data em 'DD/MM/YYYY'
  function formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function dividirValor(total: number, partes: number): number[] {
    const totalCentavos = Math.round(total * 100); // Converte o total para centavos
    const valorBase = Math.floor(totalCentavos / partes); // Valor base em centavos
    const valores: number[] = Array(partes).fill(valorBase); // Preenche todas as partes com o valor base

    let diferenca = totalCentavos - valorBase * partes; // Diferença em centavos

    // Adiciona a diferença na última parte
    valores[partes - 1] += diferenca;

    // Converte os valores de volta para reais (dividindo por 100)
    return valores.map(valor => valor / 100);
  }

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
      {/* Modal de confirmação para excluir ou editar */}
      <Modal
        visible={isModalConfirmVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Deseja excluir ou editar esse item?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Excluir"
                onPress={handleDelete}
                color={colors.cancelButton}
              />
              <Button
                title="Cancelar"
                onPress={() => setModalConfirmVisible(false)}
                color={colors.graySearch}
              />
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={{flex: 1}}>
        {formaPagamento &&
          formaPagamento.length > 0 &&
          formaPagamento.map(pagamento => {
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                key={`${pagamento.Codigo}`}
                onPress={() => {
                  setSelectedPayment(pagamento);
                  setModalConfirmVisible(true);
                }}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemCode}>{pagamento.Codigo}</Text>
                  <Text style={styles.itemDescription}>
                    {pagamento.Descricao}
                  </Text>
                </View>
                {!pagamento.IsPrazo &&
                  pagamento.CondicaoPagamento.map(condicao => {
                    return (
                      <View key={condicao.Codigo}>
                        <Text style={{color: colors.black}}>{`${
                          condicao.Codigo
                        } | R$ ${condicao.ValorPago.toFixed(2)}`}</Text>
                      </View>
                    );
                  })}
                {!!pagamento.IsPrazo &&
                  pagamento.CondicaoPagamento.map(condicao => {
                    const parcelas = Array.from(
                      {length: condicao.QtdeParcelas},
                      (_, i) => i + 1,
                    );

                    const valoresParcelas = dividirValor(
                      condicao.ValorPago,
                      condicao.QtdeParcelas,
                    );
                    return (
                      <View
                        key={condicao.Codigo}
                        style={styles.condicaoContainer}>
                        {parcelas.map((parcela, index) => {
                          // Calcular a data de emissão da parcela
                          const diasAdicionais =
                            condicao.QtdeDiasParcelaInicial +
                            index * condicao.IntervaloDias;
                          const dataParcela = adicionarDias(
                            new Date(),
                            diasAdicionais,
                          );
                          const dataFormatada = formatarData(dataParcela);
                          const emissao = formatarData(new Date());

                          return (
                            <View
                              key={`${condicao.Codigo}-${parcela}`}
                              style={styles.parcelaContainer}>
                              <Text
                                style={
                                  styles.textoParcela
                                }>{`${condicao.Codigo} | Parcela ${parcela} de ${condicao.QtdeParcelas} - Valor: R$ ${valoresParcelas[index]}`}</Text>
                              <Text
                                style={
                                  styles.textoEmissao
                                }>{`Emissão: ${emissao}`}</Text>
                              <Text
                                style={
                                  styles.textoEmissao
                                }>{`Vencimento: ${dataFormatada}`}</Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
              </TouchableOpacity>
            );
          })}
      </ScrollView>
      <View style={styles.bottom}>
        <View style={styles.leftIcon}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>
              R$ {finalizarVenda?.ValorTotal.toFixed(2)}
            </Text>
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
              valorPago.toFixed(2) !== finalizarVenda?.ValorTotal.toFixed(2)
            }>
            {renderIcon('add-sharp', 'Pagamento', () =>
              setModalPagamento(true),
            )}
          </ShowIf>
          <ShowIf
            condition={
              ProdutosSelecionados.length > 0 &&
              valorPago.toFixed(2) === finalizarVenda?.ValorTotal.toFixed(2)
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
  condicaoContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  parcelaContainer: {
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textoParcela: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  textoEmissao: {
    fontSize: 14,
    color: '#666',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
