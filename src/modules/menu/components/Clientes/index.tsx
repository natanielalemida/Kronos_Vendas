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
import useEditUser from './components/modalEditCliente.ts/hooks/useEditUser.ts';
import {useCliente} from './context/clientContext.tsx';
import {ShowIf} from '../../../components/showIf/showIf.tsx';

export default function Clientes() {
  const navigation = useNavigation();
  const [textFilter, setTextFilter] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const {cliente, isActive, setActive, handleVerifyCliente} = UseModal();
  const {handleGetUsers, clientes, isLoading} = UseGetFetch();
  const {setForm} = useCliente();
  const {handleEditUser} = useEditUser({setActive, setForm});

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

  const renderEndereco = (endereco: {
    Logradouro: string;
    C: string;
    Numero: string;
    Bairro: string;
  }) => (
    <ShowIf condition={!!endereco.Logradouro}>
      <View key={`${endereco.Logradouro}-${endereco.Numero}`}>
        <Text style={styles.enderecoText}>
          Logradouro: {endereco.Logradouro} - Número: {endereco.Numero}
        </Text>
        <Text style={styles.enderecoText}>Bairro: {endereco.Bairro}</Text>
      </View>
    </ShowIf>
  );

  const isEven = (index: number) => index % 2 === 0;

  return (
    <View style={styles.container}>
      <Search
        placeholder="Pesquisar..."
        value={textFilter}
        onChangeText={setTextFilter}
      />
      <ModalEditCliente
        cliente={cliente}
        isActive={isActive}
        setActive={handleSetActive}
      />
      <View style={styles.top}>
        <Loading isModalLoadingActive={isLoading} />
        {clientes.length === 0 && !isLoading ? ( // Exibir mensagem se não houver clientes
          <Text style={styles.noResultsText}>Nenhum cliente encontrado.</Text>
        ) : (
          <FlatList
            data={clientes}
            renderItem={({item, index}: {item: ClienteDto; index: number}) => (
              <TouchableOpacity
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor: isEven(index)
                      ? colors.grayList
                      : colors.white,
                  },
                ]}
                onPress={() => {
                  console.log('Item index:', index);
                  handleEditUser(item);
                }}
                key={item.Codigo}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemCode}>{item.Codigo}</Text>
                  <Text style={styles.itemDescription}>
                    {item.NomeFantasia}
                  </Text>
                </View>
                <ShowIf condition={!!item.CNPJCPF}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemCode}>
                      CNPJ/CPF: {item.CNPJCPF}
                    </Text>
                    <Text style={styles.itemDescription}>{item.IERG}</Text>
                  </View>
                </ShowIf>
                {item.Enderecos?.map(renderEndereco)}
              </TouchableOpacity>
            )}
            keyExtractor={item => `${item.Codigo}`}
          />
        )}
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
    fontSize: 16, // Aumentado para 16 para melhor legibilidade
    fontWeight: 'bold',
  },
  itemDescription: {
    width: '85%',
    marginHorizontal: 10,
    fontSize: 16, // Aumentado para 16 para melhor legibilidade
    color: colors.black,
    fontWeight: 'bold',
  },
  enderecoText: {
    fontSize: 14, // Aumentado para 14 para melhor legibilidade
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
