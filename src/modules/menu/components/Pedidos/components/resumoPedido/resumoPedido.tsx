import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useRef, useState} from 'react';
import PedidoRepository from '../../repository/pedidoRepository';
import Init from '../../../Clientes/hooks/init';
import {useRoute} from '@react-navigation/native';
import {PedidoSearchDto} from '../../type';
import {HeaderProducts} from '../../../../../components/headers/HeaderProducts';
import {useCliente} from '../../../Clientes/context/clientContext';
import {colors} from '../../../../../styles';
import {ShowIf} from '../../../../../components/showIf';
import ViewShot from 'react-native-view-shot';
import UseRepository from '../../hooks/useRepository';
import {getClienteToSave} from './hooks/getClienteToSave';
import Loading from '../../../../../components/loading/Loading';
import useExportPdf from './components/compartilharPdf';

export default function ResumoPedido({navigation}) {
  const route = useRoute();
  const {
    setClienteOnContext,
    setProdutosSelecionados,
    clienteOnContext,
    usuario,
  } = useCliente();
  const {params} = route;
  const {id, Codigo, goBack, idCliente} = params || {};

  const {teste, clonePedido} = UseRepository();
  const {getByIdToSave, getByCodeToSave} = getClienteToSave();

  const viewRef = useRef(null);
  const [data, setData] = useState<PedidoSearchDto>();
  const [isLoading, setIsLoading] = useState(false);
  const repository = new PedidoRepository();

  const {PedidoPDF} = useExportPdf();

  const handleGetPedido = async () => {
    if (clienteOnContext?.Codigo) {
      const result = await repository.getPedidoById(id);

      setData({
        ...result,
        Itens: result.Itens.map(item => ({
          ...item,
          Codigo: item.CodigoProduto,
        })),
      });
      return;
    } else {
      const result = await repository.getPedidoById(id);

      setData({
        ...result,
        Itens: result.Itens.map(item => ({
          ...item,
          Codigo: item.CodigoProduto,
        })),
      });
    }
  };

  const enviarPedido = async (id: number) => {
    try {
      setIsLoading(true);
      let cliente = null;
      if (idCliente) {
        cliente = await getByIdToSave(idCliente);
      }
      const result = await teste(id, cliente, usuario);
      if (result) {
        Alert.alert('Sucesso', 'Pedido enviado com sucesso');
        setTimeout(() => {
          navigation.navigate('Menu');
        }, 500);
        return;
      }
    } catch (error) {
      console.error({error});
      Alert.alert('Falha', 'Falha ao enviar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePedido = async () => {
    await repository.deletePedidoById(id);
    navigation.navigate('Menu');
  };

  const handleGetPessoa = async () => {
    const cliente = data?.Pessoa.Codigo
      ? await getByCodeToSave(data?.Pessoa.id)
      : await getByIdToSave(data?.Pessoa.id);

    const clintesNew = {
      ...cliente,
      Enderecos: [
        {
          Logradouro: cliente.Logradouro,
          Numero: cliente.Numero,
          Bairro: cliente.Bairro,
        },
      ],
    };
    return clintesNew;
  };

  const handleTeste = async () => {
    const cliente = await handleGetPessoa();
    setClienteOnContext(cliente);
    setProdutosSelecionados(data?.Itens);
    navigation.navigate('Novo Pedido', {id});
  };

  const handleEdit = async () => {
    const cliente = await handleGetPessoa();
    setClienteOnContext(cliente);
    setProdutosSelecionados(data?.Itens);
    navigation.navigate('Novo Pedido');
  };

  const handleClone = () => {
    Alert.alert(
      'Duplicar pedido',
      'Você tem certeza que deseja Duplicar o pedido atual?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'OK', onPress: () => handleEdit()},
      ],
    );
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

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calcularPorcentagemDesconto = (valorOriginal, valorFinal) => {
    const valorDesconto = valorOriginal - valorFinal;
    const porcentagemDesconto = (valorDesconto / valorOriginal) * 100;
    return porcentagemDesconto.toFixed(2);
  };

  Init({handleGetUsers: handleGetPedido});

  const renderProdutos = () => (
    <View>
      <Text style={styles.sectionTitle}>Produtos</Text>
      {data?.Itens.map((produto, index) => (
        <View key={index} style={styles.productRow}>
          <View style={styles.productDetails}>
            <Text
              style={{
                width: '80%',
                color: colors.arcGreen,
                fontWeight: 'bold',
              }}>
              {produto.Descricao}
            </Text>
            <Text style={{fontWeight: 'bold', color: colors.confirmButton}}>
              R$ {produto.ValorUnitario.toFixed(2)}
            </Text>
          </View>
          <View style={styles.productInfo}>
            <View style={styles.productInfoBlock}>
              <Text style={styles.colorBlack}>DESC</Text>
              <Text style={styles.colorBlack}>
                {produto.ValorVendaDesconto !== produto.ValorUnitario
                  ? (
                      (produto.ValorUnitario - produto.ValorVendaDesconto) *
                      produto.Quantidade
                    ).toFixed(2)
                  : '0.00'}
                {produto.ValorVendaDesconto !== produto.ValorUnitario
                  ? ` (${calcularPorcentagemDesconto(
                      produto.ValorUnitario,
                      produto.ValorVendaDesconto,
                    )}%)`
                  : ''}
              </Text>
            </View>
            <View style={styles.productInfoBlock}>
              <Text style={styles.colorBlack}>QTD</Text>
              <Text style={styles.colorBlack}>{produto.Quantidade}</Text>
            </View>
            <View style={styles.productInfoBlock}>
              <Text style={styles.colorBlack}>VLR UN</Text>
              <Text style={styles.colorBlack}>
                R$ {produto.ValorUnitario.toFixed(2)}
              </Text>
            </View>
            <View style={styles.productInfoBlock}>
              <Text style={styles.colorBlack}>TOTAL</Text>
              <Text style={styles.colorBlack}>
                R${' '}
                {(produto.ValorVendaDesconto * produto.Quantidade).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMeiosPagamentos = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
      {data?.MeiosPagamentos.map((meio, index) => (
        <View key={index} style={styles.paymentRow}>
          <Text style={styles.colorBlack}>{meio.FormaPagamento.Descricao}</Text>
          <View style={styles.paymentDetails}>
            <Text style={{fontWeight: 'bold', color: colors.black}}>
              R$ {meio.ValorRecebido.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const calculateTotalBruto = data?.Itens.reduce(
    (acc, item) => acc + item.Quantidade * item.ValorUnitario,
    0,
  ).toFixed(2);

  const calculateTotalLiquido = data?.MeiosPagamentos.reduce(
    (acc, item) => acc + item.ValorRecebido,
    0,
  ).toFixed(2);

  return (
    <View style={styles.container}>
      <HeaderProducts
        label="Resumo Pedido"
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={
          goBack ? () => navigation.pop(2) : () => navigation.goBack()
        }
        rightColor="white"
        rightColor2="white"
        rightIcon={!Codigo ? 'trash-outline' : undefined}
        rightSize={25}
        rightIcon2={!Codigo ? 'create-outline' : undefined}
        rightSize2={25}
        onPressRightIcon2={handleTeste}
        onPressRightIcon={handleDelete}
        leftSize={25}
      />
      <Loading isModalLoadingActive={isLoading} />
      <ViewShot
        ref={viewRef}
        options={{format: 'jpg', quality: 0.9}}
        style={{flex: 1}}>
        <ScrollView style={{padding: 20}}>
          <Text style={styles.title}>Pedido nº {data?.Codigo}</Text>
          <View style={styles.row}>
            <Text style={styles.colorBlack}>Cliente</Text>
            <Text style={[styles.rightAlignedText, {width: '80%'}]}>
              {data?.Pessoa?.NomeFantasia}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.colorBlack}>CNPJ/CPF</Text>
            <Text style={styles.rightAlignedText}>{data?.Pessoa?.CNPJCPF}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.colorBlack}>Emissão</Text>
            <Text style={{fontWeight: 'bold', color: colors.black}}>
              {formatDate(data?.DataEmissao)}
            </Text>
          </View>

          {renderProdutos()}
          <View style={styles.totalRow}>
            <Text style={styles.sectionTitle}>Total</Text>
            <View style={styles.totalInfo}>
              <Text style={styles.colorBlack}>Total Bruto</Text>
              <Text style={{fontWeight: 'bold', color: colors.black}}>
                R$ {calculateTotalBruto}
              </Text>
            </View>

            <View style={styles.totalInfo}>
              <Text style={styles.colorBlack}>Desconto:</Text>
              <Text style={{fontWeight: 'bold', color: colors.black}}>
                R$
                {(
                  Number(calculateTotalBruto) - Number(calculateTotalLiquido)
                ).toFixed(2)}
                (
                {(
                  ((Number(calculateTotalBruto) -
                    Number(calculateTotalLiquido)) /
                    Number(calculateTotalBruto)) *
                  100
                ).toFixed(2)}
                %)
              </Text>
            </View>

            <View style={styles.totalInfo}>
              <Text style={styles.colorBlack}>Total Líquido</Text>
              <Text style={{fontWeight: 'bold', color: colors.black}}>
                R$ {calculateTotalLiquido}
              </Text>
            </View>
          </View>
          {renderMeiosPagamentos()}
        </ScrollView>
      </ViewShot>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => PedidoPDF(data)}>
          <Text style={styles.buttonText}>Compartilhar PDF</Text>
        </TouchableOpacity>

        <ShowIf condition={!data?.Codigo}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => enviarPedido(id)}>
            <Text style={styles.buttonText}>Enviar Pedido</Text>
          </TouchableOpacity>
        </ShowIf>

        <TouchableOpacity
          style={[styles.confirmButton, {backgroundColor: colors.yellow}]}
          onPress={() => handleClone()}>
          <Text style={styles.buttonText}>Duplicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rightAlignedText: {
    color: colors.black,
    textAlign: 'right',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productRow: {
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    borderTopColor: 'black',
    borderTopWidth: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  productInfo: {
    flexDirection: 'row',
  },
  productInfoBlock: {
    marginLeft: 15,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentDetails: {
    marginLeft: 15,
  },
  totalRow: {
    marginVertical: 20,
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: colors.graySearch,
    padding: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: colors.confirmButton,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  colorBlack: {color: colors.black},
});
