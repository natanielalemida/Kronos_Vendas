import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import Search from '../../../components/search';
import {useState, useEffect, useRef} from 'react';
import {colors} from '../../../styles';
import Loading from '../../../components/loading/Loading';
import UseGetFetch from './hooks/useGetFetch';
import Init from './hooks/init';
import {ClienteDto} from '../../../../sync/clientes/type';
import ModalEditCliente from './components/modalEditCliente.ts';
import UseModal from './components/modalEditCliente.ts/hooks/useModal.ts';
import {useNavigation} from '@react-navigation/native';

export default function Clientes() {
  const navigation = useNavigation();
  const [textFilter, setTextFilter] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const {cliente, isActive, setActive, handleVerifyCliente} = UseModal();
  const {handleGetUsers, clientes, isLoading} = UseGetFetch();

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

  const handleSetActive = async (value: boolean) => {
    setActive(value);
    await handleGetUsers();
  };

  Init({handleGetUsers, setTextFilter});

  return (
    <View style={styles.container}>
      <Search
        placeholder="Pesquisar..."
        value={textFilter}
        onChangeText={setTextFilter}
      />
      <View style={styles.top}>
        <Loading isModalLoadingActive={isLoading} />
        <ModalEditCliente
          cliente={cliente}
          isActive={isActive}
          setActive={handleSetActive}
        />
        <FlatList
          data={clientes}
          renderItem={({item}: {item: ClienteDto}) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => handleVerifyCliente(item)}
              key={item.Codigo}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemCode}>{item.Codigo}</Text>
                <Text style={styles.itemDescription}>{item.NomeFantasia}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => `${(item.Codigo, item.NomeFantasia, item.id)}`}
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
