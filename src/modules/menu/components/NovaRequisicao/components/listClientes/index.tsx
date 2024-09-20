import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import UseGetFetch from './hooks/useGetFetch';
import Init from './hooks/init';
import useFilter from './hooks/useFilter';
import {useNavigation} from '@react-navigation/native';
import {ClienteDto} from '../../../../../../sync/clientes/type';
import Search from '../../../../../components/search';
import Loading from '../../../../../components/loading/Loading';
import {colors} from '../../../../../styles';
import {useCliente} from '../../../Clientes/context/clientContext';

export default function SelectClientes() {
  const navigation = useNavigation();
  const [textFilter, setTextFilter] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const {handleGetUsers, clientes, isLoading, totalPages} = UseGetFetch();
  const {setClienteOnContext} = useCliente();

  // Inicializa a função para buscar os clientes
  Init({handleGetUsers, setTextFilter});

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      handleGetUsers(textFilter);
    }, 500); // Aguarda 500ms após o último caractere digitado

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [textFilter]);

  // Define o cliente selecionado e navega de volta
  const setCliente = (cliente: ClienteDto) => {
    setClienteOnContext(cliente);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Search
        placeholder="Pesquisar..."
        value={textFilter}
        onChangeText={setTextFilter}
      />
      <View style={styles.top}>
        <Loading isModalLoadingActive={isLoading} />
        <FlatList
          data={clientes}
          renderItem={({item}: {item: ClienteDto}) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => setCliente(item)}
              key={item.Codigo}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemCode}>{item.Codigo}</Text>
                <Text style={styles.itemDescription}>{item.NomeFantasia}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.Codigo.toString()}
          scrollEventThrottle={16} // Atualiza o scroll a cada 16ms
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemCode: {
    marginRight: 5,
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemDescription: {
    width: '85%',
    marginHorizontal: 10,
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
  },
});
