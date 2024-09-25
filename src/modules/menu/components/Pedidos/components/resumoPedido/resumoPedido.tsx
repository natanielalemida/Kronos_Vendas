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
import UseRepository from '../../hooks/useRepository';
import Toast from 'react-native-toast-message';
import Loading from '../../../../../components/loading/Loading';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function ResumoPedido({navigation}) {
  const route = useRoute();
  const {setClienteOnContext, setProdutosSelecionados, finalizarVenda} =
    useCliente();
  const {params} = route;
  const {id, Codigo, goBack} = params || {};
  const {teste, isLoading} = UseRepository();

  const viewRef = useRef(null);

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
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Pedido enviado com sucesso',
        visibilityTime: 1000,
        ...toastStyles.success,
      });
      setTimeout(() => {
        navigation.navigate('Menu');
      }, 500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Falha',
        text2: 'Falha ao enviar pedido',
        visibilityTime: 1000,
        ...toastStyles.error,
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
    navigation.navigate('Novo Pedido', {id});
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

  const handleSharePDF = async () => {
    const uri = await viewRef.current.capture(); // Captura a imagem do ScrollView
    const html = `<h1>Pedido nº ${data?.Codigo}</h1><img src="${uri}" />`; // Cria um HTML simples com a imagem

    // Converte o HTML para PDF
    const pdf = await RNHTMLtoPDF.convert({
      html,
      fileName: 'pedido',
      directory: 'Documents',
    });

    // Compartilha o PDF
    await Share.open({url: `file://${pdf.filePath}`});
  };

  Init({handleGetUsers: handleGetPedido});

  const renderProdutos = () => (
    <View>
      <Text style={styles.sectionTitle}>Produtos</Text>
      {data?.Itens.map((produto, index) => (
        <View key={index} style={styles.productRow}>
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{produto.Descricao}</Text>
            <Text style={{fontWeight: 'bold', color: colors.confirmButton}}>
              R$ {produto.ValorUnitario.toFixed(2)}
            </Text>
          </View>
          <View style={styles.productInfo}>
            <View style={styles.productInfoBlock}>
              <Text>DESC</Text>
              <Text>
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
              <Text>QTD</Text>
              <Text>{produto.Quantidade}</Text>
            </View>
            <View style={styles.productInfoBlock}>
              <Text>VLR UN</Text>
              <Text>R$ {produto.ValorUnitario.toFixed(2)}</Text>
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
          <Text>{meio.FormaPagamento.Descricao}</Text>
          <View style={styles.paymentDetails}>
            <Text style={{fontWeight: 'bold'}}>
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
      <ViewShot
        ref={viewRef}
        options={{format: 'jpg', quality: 0.9}}
        style={{flex: 1}}>
        <ScrollView
          style={{
            padding: 20,
          }}>
          <Loading isModalLoadingActive={isLoading} />
          <Text style={styles.title}>Pedido nº {data?.Codigo}</Text>
          <View style={styles.row}>
            <Text>Cliente</Text>
            <Text style={styles.rightAlignedText}>
              {data?.Pessoa?.NomeFantasia}
            </Text>
          </View>
          <View style={styles.row}>
            <Text>CNPJ/CPF</Text>
            <Text style={styles.rightAlignedText}>{data?.Pessoa?.CNPJCPF}</Text>
          </View>
          <View style={styles.row}>
            <Text>Emissão</Text>
            <Text style={{fontWeight: 'bold'}}>
              {formatDate(data?.DataEmissao)}
            </Text>
          </View>

          {renderProdutos()}
          <View style={styles.totalRow}>
            <Text style={styles.sectionTitle}>Total</Text>
            <View style={styles.totalInfo}>
              <Text>Total Bruto</Text>
              <Text style={{fontWeight: 'bold'}}>R$ {calculateTotalBruto}</Text>
            </View>

            <View style={styles.totalInfo}>
              <Text>Desconto:</Text>
              <Text style={{fontWeight: 'bold'}}>
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
              <Text>Total Líquido</Text>
              <Text style={{fontWeight: 'bold'}}>
                R$ {calculateTotalLiquido}
              </Text>
            </View>
          </View>
          {renderMeiosPagamentos()}
        </ScrollView>
      </ViewShot>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSharePDF}>
          <Text style={styles.buttonText}>Compartilhar</Text>
        </TouchableOpacity>
        <ShowIf condition={!Codigo}>
          <TouchableOpacity
            onPress={() => enviarPedido(id)}
            style={[styles.button, styles.confirmButton]}>
            <Text style={styles.buttonText}>Sincronizar</Text>
          </TouchableOpacity>
        </ShowIf>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.confirmButton,
    width: '70%',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  productInfoBlock: {
    marginRight: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentDetails: {
    flexDirection: 'row',
  },
  totalRow: {
    marginTop: 20,
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    backgroundColor: colors.arcGreen,
  },
  button: {
    paddingVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.graySearch,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: colors.confirmButton,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightAlignedText: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
});

const toastStyles = {
  success: {
    position: 'top',
    bottomOffset: 50,
  },
  error: {
    position: 'top',
    bottomOffset: 50,
  },
};
