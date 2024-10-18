import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import Search from '../../../components/search';
import {useEffect, useState, useRef, useCallback} from 'react';
import UseGetProdutos from './hooks/useGetProdutos';
import {ProdutoDto} from '../../../../sync/products/type';
import {colors} from '../../../styles';
import Loading from '../../../components/loading/Loading';
import {useFocusEffect} from '@react-navigation/native';

export default function Produto() {
  const {handleGetProdutos, produtos, isLoading} = UseGetProdutos();
  const [textFilter, setTextFilter] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useFocusEffect(
    useCallback(() => {
      setTextFilter('');
      return () => {};
    }, []),
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      handleGetProdutos(textFilter);
    }, 500); // Aguarda 500ms após o último caractere digitado

    return () => {};
  }, [textFilter]);

  const isEven = (index: number) => index % 2 === 0;

  const renderItem = ({item, index}: {item: ProdutoDto; index: number}) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {backgroundColor: isEven(index) ? colors.grayList : colors.white},
      ]}
      key={item.Codigo}>
      <View style={styles.itemTopRow}>
        <Text
          style={
            styles.itemDescription
          }>{`${item.Codigo} - ${item.Descricao}`}</Text>
      </View>

      <View style={styles.itemBottomRow}>
        <View style={styles.itemDetailsLeft}>
          <Text style={{color: colors.black}}>{item.UnidadeMedida}</Text>
          <Text style={{color: colors.black}}>Est. 10</Text>
        </View>
        <Text style={{color: colors.black}}>EAN: {item.CodigoDeBarras}</Text>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
            }}>
            Valor R$ {item.ValorVenda.toFixed(2)}
          </Text>
          <Text style={{color: 'black', fontSize: 16}}>
            Atac: R$ {item.ValorVendaAtacado.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Search
        placeholder="Pesquisar..."
        value={textFilter}
        onChangeText={setTextFilter}
      />
      <View style={styles.top}>
        {/* <Loading isModalLoadingActive={isLoading} /> */}
        <FlatList
          data={produtos}
          renderItem={renderItem}
          keyExtractor={item => item.Codigo.toString()}
          keyboardShouldPersistTaps="always"
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
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemDescription: {
    marginHorizontal: 10,
    width: '80%',
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
  black: {
    color: colors.black,
  },
  itemDetailsLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
});
