import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCliente} from '../Clientes/context/clientContext';
import ModalDeleteOrEdit from './components/editProdutosOnList/compents/modalEditOrDelete';
import {useState} from 'react';
import {ProdutoBodyCreateQtAndObsDto} from '../../../../sync/products/type';
import ModalVenda from './components/listProdutos/components/modalVenda';
import {ShowIf} from '../../../components/showIf';

export default function NovaRequisicao() {
  const router = useRoute();
  const {params} = router;
  const {id} = params || {};
  const navigation = useNavigation();
  const {clienteOnContext, ProdutosSelecionados} = useCliente();
  const [produto, setProduto] = useState<
    ProdutoBodyCreateQtAndObsDto | undefined
  >();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalActive, setModalActive] = useState<boolean>(false);

  const handleSet = (produto: ProdutoBodyCreateQtAndObsDto) => {
    setProduto(produto);
    setModalActive(true);
  };

  const renderIcon = (iconName: string, label: string, onPress: () => void) => (
    <TouchableOpacity style={style.iconContainer} onPress={onPress}>
      <Icon name={iconName} size={25} color={colors.white} />
      <Text style={style.iconText}>{label}</Text>
    </TouchableOpacity>
  );

  const calcularTotal = () => {
    return ProdutosSelecionados.reduce(
      (acc, item) => acc + item.Quantidade * item.ValorVendaDesconto,
      0,
    ).toFixed(2);
  };

  function mascararCPF(cpf: string) {
    if (!cpf) return;
    cpf = cpf.replace(/\D/g, '');

    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  function mascararCNPJ(cnpj: string) {
    if (!cnpj) return;
    cnpj = cnpj.replace(/\D/g, '');

    // Aplica a máscara no formato XX.XXX.XXX/XXXX-XX
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }

  const isEven = (index: number) => index % 2 === 0;

  return (
    <View style={style.container}>
      <View style={style.top}>
        <ModalDeleteOrEdit
          produto={produto}
          isModalActive={isModalActive}
          setModalActive={setModalActive}
          setIsEditing={setIsEditing}
        />
        <ModalVenda
          isActive={isEditing}
          setIsActive={setIsEditing}
          canSetAtacado={false}
          isAtacadoActive={false}
          isEditing={true}
          setAtacadoActive={() => {}}
          produto={produto}
        />
        <View
          style={{
            marginTop: 5,
            padding: 10,
            backgroundColor: colors.white,
            width: '98%',
            alignSelf: 'center',
            borderRadius: 15,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{color: colors.black, fontSize: 16, fontWeight: '800'}}>
              Cliente
            </Text>
            <ShowIf condition={!!clienteOnContext?.id}>
              <FontAwesome
                name="history"
                size={25}
                color={colors.black}
                onPress={() =>
                  navigation.navigate('PedidosCliente', {
                    clienteId: clienteOnContext?.id,
                  })
                }
              />
            </ShowIf>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={{color: colors.black}}>Nome:</Text>
            <Text
              style={{
                color: colors.black,
                width: '85%',
                textAlign: 'right',
              }}>
              {clienteOnContext?.NomeFantasia}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ShowIf
              condition={
                !!clienteOnContext?.CNPJCPF &&
                clienteOnContext?.CNPJCPF.length > 11
              }>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <Text
                  style={{
                    color: colors.black,
                  }}>
                  CNPJ:
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    textAlign: 'right',
                  }}>
                  {mascararCNPJ(clienteOnContext?.CNPJCPF)}
                </Text>
              </View>
            </ShowIf>
            <ShowIf
              condition={
                (!!clienteOnContext?.CNPJCPF &&
                  clienteOnContext?.CNPJCPF.length <= 11) ||
                !clienteOnContext?.CNPJCPF
              }>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <Text
                  style={{
                    color: colors.black,
                  }}>
                  CPF:
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    textAlign: 'right',
                  }}>
                  {mascararCPF(clienteOnContext?.CNPJCPF)}
                </Text>
              </View>
            </ShowIf>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: colors.black}}>Enderecos:</Text>
            {clienteOnContext?.Enderecos &&
              clienteOnContext?.Enderecos.length > 0 &&
              clienteOnContext?.Enderecos.map(endereco => {
                return (
                  <Text style={{color: colors.black}}>
                    {endereco.Logradouro} - {endereco.Numero} -{' '}
                    {endereco.Bairro}
                  </Text>
                );
              })}
          </View>
        </View>
        <Text
          style={{
            color: colors.black,
            fontSize: 16,
            fontWeight: '800',
            paddingHorizontal: 10,
          }}>
          Itens
        </Text>
        <ScrollView>
          {ProdutosSelecionados.map((item, index) => (
            <TouchableOpacity
              style={[
                style.itemContainer,
                {
                  backgroundColor:
                    item.Codigo === produto?.Codigo
                      ? colors.arcGreenNeon
                      : isEven(index)
                      ? colors.grayList
                      : colors.white,
                },
              ]}
              key={item.Codigo.toString()}
              onPress={() => handleSet(item)}>
              <View style={style.itemTopRow}>
                <View style={style.itemLeft}>
                  <Text style={style.itemCode}>{item.Codigo}</Text>
                  <Text style={style.itemDescription}>{item.Descricao}</Text>
                </View>
                <Text style={style.itemPrice}>
                  R$ {item.ValorVendaDesconto.toFixed(2)}
                </Text>
              </View>
              <View style={style.itemBottomRow}>
                <View style={style.itemDetailsLeft}>
                  <Text style={{color: colors.black}}>
                    Qtd. {item.Quantidade}
                  </Text>
                  <Text style={{color: colors.black}}>X</Text>
                  <Text style={{color: colors.black}}>
                    {item.ValorVendaDesconto.toFixed(2)}
                  </Text>
                </View>
                <Text style={{color: colors.black}}>
                  Total: R${' '}
                  {(item.Quantidade * item.ValorVendaDesconto).toFixed(2)}
                </Text>
              </View>
              <ShowIf condition={!!item.Observacao}>
                <Text style={{color: colors.black}}>{item.Observacao}</Text>
              </ShowIf>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={style.bottom}>
        <View style={style.leftIcon}>
          <ShowIf condition={!!clienteOnContext}>
            {renderIcon('add-sharp', 'Produtos', () =>
              // @ts-ignore
              navigation.navigate('ListClientes', {
                screen: 'SelectProdutos',
              }),
            )}
          </ShowIf>
          <ShowIf condition={!clienteOnContext}>
            {renderIcon('people-sharp', 'Clientes', () =>
              // @ts-ignore
              navigation.navigate('ListClientes', {
                screen: 'SelectClientes',
              }),
            )}
          </ShowIf>
        </View>
        <View style={style.totalContainer}>
          <Text style={style.totalText}>Total</Text>
          <Text style={style.totalText}>R$ {calcularTotal()}</Text>
        </View>
        <View style={style.rightIcon}>
          <ShowIf condition={ProdutosSelecionados.length > 0}>
            {renderIcon('checkmark-circle-sharp', 'Finalizar', () =>
              // @ts-ignore
              navigation.navigate('ListClientes', {
                screen: 'FormaPagamento',
                params: {
                  id: id,
                },
              }),
            )}
          </ShowIf>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.arcGreen400,
  },
  top: {
    flex: 1,
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
    fontSize: 16,
    color: colors.white,
  },
  itemContainer: {
    padding: 15,
    borderRadius: 15,
    margin: 2,
  },
  itemTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLeft: {
    width: '75%',
    flexDirection: 'row',
  },
  itemCode: {
    marginRight: 5,
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemDescription: {
    marginHorizontal: 10,
    width: '80%',
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemPrice: {
    marginLeft: 10,
    fontSize: 14,
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
});
