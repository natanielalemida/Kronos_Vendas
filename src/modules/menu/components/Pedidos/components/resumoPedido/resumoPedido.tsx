import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useState} from 'react';
import PedidoRepository from '../../repository/pedidoRepository';
import Init from '../../../Clientes/hooks/init';
import {useRoute} from '@react-navigation/native';
import {PedidoSearchDto} from '../../type';
import {HeaderProducts} from '../../../../../components/headers/HeaderProducts';
import {useCliente} from '../../../Clientes/context/clientContext';
import {colors} from '../../../../../styles';
import {ShowIf} from '../../../../../components/showIf';
import UseRepository from '../../hooks/useRepository';
import Toast from 'react-native-toast-message';

export default function ResumoPedido({navigation}) {
  const route = useRoute();
  const {setClienteOnContext, setProdutosSelecionados, finalizarVenda} =
    useCliente();
  const {params} = route;
  const {id, Codigo, goBack} = params || {};
  const {teste} = UseRepository();

  const [data, setData] = useState<PedidoSearchDto>();
  const repository = new PedidoRepository();

  const handleGetPedido = async () => {
    const result = await repository.getPedidoById(id);
    setData({
      ...result,
      Itens: result.Itens.map(item => ({
        ...item,
        Codigo: item.CodigoProduto,
      })),
    });
  };

  const enviarPedido = async (id: number) => {
    try {
      await teste(id);
      await Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2: 'Pedido enviado com sucesso',
        text2Style: {fontSize: 14},
        visibilityTime: 1000,
      });
      setTimeout(() => {
        navigation.navigate('Menu');
      }, 500);
    } catch (error) {
      await Toast.show({
        type: 'error',
        text1: 'Falha',
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2: 'Falha ao enviar pedido',
        text2Style: {fontSize: 14},
        visibilityTime: 1000,
      });
    }
  };

  const deletePedido = async () => {
    await repository.deletePedidoById(id);
    navigation.navigate('Menu');
  };

  const handleTeste = () => {
    setClienteOnContext(data?.Pessoa);
    setProdutosSelecionados(data?.Itens);
    navigation.navigate('Novo Pedido', {
      id: id,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Deletar Pedido',
      'Você tem certeza que deseja deletar o pedido atual?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'OK', onPress: () => deletePedido()},
      ],
    );
  };

  // Função para formatar a data
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna o mês de 0-11, então adicione +1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  function calcularPorcentagemDesconto(valorOriginal, valorFinal) {
    const valorDesconto = valorOriginal - valorFinal;
    const porcentagemDesconto = (valorDesconto / valorOriginal) * 100;
    console.log({porcentagemDesconto});
    return porcentagemDesconto.toFixed(2); // Arredonda para duas casas decimais
  }

  Init({handleGetUsers: handleGetPedido});

  const renderProdutos = () => {
    return (
      <View>
        <Text style={styles.sectionTitle}>Produtos</Text>
        {data?.Itens.length > 0 &&
          data.Itens.map((produto, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productDetails}>
                <Text style={{width: '74%'}}>{produto.Descricao}</Text>
                <Text>R$ {produto.ValorUnitario.toFixed(2)}</Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{alignItems: 'center'}}>
                  <Text>DESC</Text>
                  <Text>{produto.ValorVendaDesconto}</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text>QTD</Text>
                  <Text>{produto.Quantidade}</Text>
                </View>
                <View>
                  <Text style={{alignSelf: 'flex-end'}}>VLR UN</Text>
                  <Text>R$ {produto.ValorUnitario.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    );
  };

  const renderMeiosPagamentos = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
        {data?.MeiosPagamentos.length > 0 &&
          data.MeiosPagamentos.map((meio, index) => (
            <View key={index} style={styles.paymentRow}>
              <Text>{meio.FormaPagamento.Descricao}</Text>
              <View style={styles.paymentDetails}>
                <Text>R$ {meio.ValorRecebido.toFixed(2)}</Text>
              </View>
            </View>
          ))}
      </View>
    );
  };

  const {valorTotal, porcentagemTotal} = data?.Itens.reduce(
    (acc, item) => {
      const valorDesconto = item.ValorUnitario - item.ValorVendaDesconto;

      const porcentagemDesconto = calcularPorcentagemDesconto(
        item.ValorUnitario,
        item.ValorVendaDesconto,
      );

      const descontoValido = isNaN(parseFloat(porcentagemDesconto))
        ? 0
        : parseFloat(porcentagemDesconto);

      acc.valorTotal += valorDesconto;
      acc.porcentagemTotal += descontoValido;

      return acc;
    },
    {valorTotal: 0, porcentagemTotal: 0},
  ) || {valorTotal: 0, porcentagemTotal: 0};

  return (
    <View style={{flex: 1}}>
      <HeaderProducts
        label="Resumo Pedido"
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={
          goBack ? () => navigation.pop(2) : () => navigation.goBack()
        }
        rightColor="white"
        rightIcon={!Codigo ? 'trash-outline' : undefined}
        rightSize={25}
        rightColor2="white"
        rightIcon2={!Codigo ? 'create-outline' : undefined}
        rightSize2={25}
        onPressRightIcon2={handleTeste}
        onPressRightIcon={handleDelete}
        leftSize={25}
      />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Pedido nº {data?.Codigo}</Text>
        <View style={styles.row}>
          <Text>Cliente</Text>
          <Text style={styles.rightAlignedText}>
            {data?.Pessoa?.NomeFantasia}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>Emissão</Text>
          <Text>{formatDate(data?.DataEmissao)}</Text>
        </View>

        {renderProdutos()}
        <View style={styles.totalRow}>
          <Text style={styles.sectionTitle}>Total</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Total Bruto</Text>
            <Text>
              R$
              {data?.Itens.reduce(
                (acc, item) => acc + item.Quantidade * item.ValorUnitario,
                0,
              ).toFixed(2)}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Desconto:</Text>
            {/* Exibe o valor total do desconto e a porcentagem total */}
            <Text>
              {`${valorTotal.toFixed(2)} (${porcentagemTotal.toFixed(2)}%)`}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Total Liquido</Text>
            <Text>
              R$
              {data?.Itens.reduce(
                (acc, item) => acc + item.Quantidade * item.ValorVendaDesconto,
                0,
              ).toFixed(2)}
            </Text>
          </View>
        </View>
        {renderMeiosPagamentos()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Compartilhar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => enviarPedido(id)}
          style={[styles.button, {backgroundColor: colors.confirmButton}]}>
          <Text style={styles.buttonText}>Sincronizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productRow: {
    marginBottom: 10,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '40%',
  },
  totalRow: {},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderColor: 'gray',
    backgroundColor: colors.arcGreen,
  },
  button: {
    backgroundColor: colors.graySearch,
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold',
  },
  rightAlignedText: {
    textAlign: 'right',
  },
});
