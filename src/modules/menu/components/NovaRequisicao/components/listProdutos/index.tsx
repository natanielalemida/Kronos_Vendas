import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {useEffect, useState, useRef} from 'react';
import UseGetProdutos from './hooks/useGetProdutos';
import Init from './hooks/init';
import {ProdutoDto} from '../../../../../../sync/products/type';
import Search from '../../../../../components/search';
import Loading from '../../../../../components/loading/Loading';
import {colors} from '../../../../../styles';
import UseModal from './hooks/useModal';
import ModalVenda from './components/modalVenda';
import UseSetSelecteds from './hooks/useSetSelecteds';
import {ShowIf} from '../../../../../components/showIf';
import {useCliente} from '../../../Clientes/context/clientContext';

export default function Produto() {
  const {handleGetProdutos, produtos, isLoading} = UseGetProdutos();
  const {findIndex} = UseSetSelecteds({});
  const {
    isActive,
    produtoModal,
    isAtacado,
    canSetAtacado,
    setCanSetAtacado,
    setAtacado,
    setIsActive,
    handleOpenModal,
  } = UseModal();
  const {clienteOnContext} = useCliente();

  const [textFilter, setTextFilter] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializa a função para buscar os produtos
  Init({handleGetProdutos, setTextFilter});

  console.log({clienteOnContext});

  // Aplica debounce na busca por produtos
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      handleGetProdutos(textFilter);
    }, 500); // Aguarda 500ms após o último caractere digitado

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [textFilter]);

  const renderItem = ({item}: {item: ProdutoDto}) => {
    const color = findIndex(item);
    return (
      <View>
        <ShowIf condition={clienteOnContext?.TipoPreco === null}>
          <TouchableOpacity
            style={[styles.itemContainer, {backgroundColor: color}]}
            key={item.Codigo}
            onPress={() => handleOpenModal(item, false, true)}>
            <View style={styles.itemTopRow}>
              <Text
                style={
                  styles.itemDescription
                }>{`${item.Codigo} - ${item.Descricao}`}</Text>
            </View>

            <View style={styles.itemBottomRow}>
              <View style={styles.itemDetailsLeft}>
                <Text>{item.UnidadeMedida}</Text>
                <Text>Est. 10</Text>
              </View>
              <Text>EAN: {item.CodigoDeBarras}</Text>
            </View>
            <View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                  }}>
                  Valor Varejo: R$ {item.ValorVenda.toFixed(2)}
                </Text>
                <Text style={{color: 'black', fontSize: 16}}>
                  Valor Atac: R$ {item.ValorVendaAtacado.toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ShowIf>

        <ShowIf condition={Number(clienteOnContext?.TipoPreco) === 1}>
          <TouchableOpacity
            style={[styles.itemContainer, {backgroundColor: color}]}
            key={item.Codigo}
            onPress={() => handleOpenModal(item, false, false)}>
            <View style={styles.itemTopRow}>
              <Text
                style={
                  styles.itemDescription
                }>{`${item.Codigo} - ${item.Descricao}`}</Text>
            </View>

            <View style={styles.itemBottomRow}>
              <View style={styles.itemDetailsLeft}>
                <Text>{item.UnidadeMedida}</Text>
                <Text>Est. 10</Text>
              </View>
              <Text>EAN: {item.CodigoDeBarras}</Text>
            </View>
            <View>
              <Text style={{color: 'black', fontSize: 16}}>
                Valor: R$ {item.ValorVenda.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </ShowIf>

        <ShowIf
          condition={
            Number(clienteOnContext?.TipoPreco) === 2 &&
            Number(item.VendeProdutoNoAtacado) === 1
          }>
          <TouchableOpacity
            style={[styles.itemContainer, {backgroundColor: color}]}
            key={item.Codigo}
            onPress={() => handleOpenModal(item, true, false)}>
            <View style={styles.itemTopRow}>
              <Text
                style={
                  styles.itemDescription
                }>{`${item.Codigo} - ${item.Descricao}`}</Text>
            </View>

            <View style={styles.itemBottomRow}>
              <View style={styles.itemDetailsLeft}>
                <Text>{item.UnidadeMedida}</Text>
                <Text>Est. 10</Text>
              </View>
              <Text>EAN: {item.CodigoDeBarras}</Text>
            </View>
            <View>
              <Text style={{color: 'black', fontSize: 16}}>
                Valor: R$ {item.ValorVendaAtacado.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </ShowIf>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Search
        placeholder="Pesquisar..."
        value={textFilter}
        onChangeText={setTextFilter}
      />
      <ModalVenda
        isActive={isActive}
        setIsActive={setIsActive}
        canSetAtacado={canSetAtacado}
        isAtacadoActive={isAtacado}
        setAtacadoActive={setAtacado}
        produto={produtoModal}
      />
      <View style={styles.top}>
        <Loading isModalLoadingActive={isLoading} />
        <FlatList
          data={produtos}
          renderItem={renderItem}
          keyExtractor={item => item.Codigo.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  top: {
    flex: 1,
    width: '100%',
  },
  itemContainer: {
    padding: 15,
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
