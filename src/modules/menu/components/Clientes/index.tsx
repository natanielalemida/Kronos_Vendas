import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import Search from '../../../components/search';
import {useState, useEffect, useRef} from 'react';
import {colors} from '../../../styles';
import Loading from '../../../components/loading/Loading';
import UseGetFetch from './hooks/useGetFetch';
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

  const {cliente, isActive, setActive} = UseModal();
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
        {/* <Loading isModalLoadingActive={isLoading} /> */}
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
                onPress={() => handleEditUser(item)}
                key={item.Codigo}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemCode}>{item.Codigo}</Text>
                  <Text style={styles.itemDescription}>
                    {item.NomeFantasia}
                  </Text>
                </View>
                <ShowIf condition={!!item.CNPJCPF}>
                  <View style={styles.itemTopRow}>
                    <ShowIf
                      condition={!!item.CNPJCPF && item?.CNPJCPF.length > 11}>
                      <Text style={styles.itemCodeCNPJCPF}>
                        {item.RazaoSocial}
                      </Text>
                      <Text style={styles.itemCodeCNPJCPF}>
                        CNPJ: {mascararCNPJ(item.CNPJCPF)}
                      </Text>
                    </ShowIf>
                    <ShowIf
                      condition={!!item.CNPJCPF && item?.CNPJCPF.length <= 11}>
                      <Text style={styles.itemCodeCNPJCPF}>
                        CPF: {mascararCPF(item.CNPJCPF)}
                      </Text>
                    </ShowIf>
                    <Text style={styles.itemDescription}>{item.IERG}</Text>
                  </View>
                </ShowIf>
                {item.Enderecos?.map(renderEndereco)}
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="always"
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
  black: {
    color: colors.black,
  },
  itemCode: {
    color: colors.black,
    marginRight: 5,
    fontSize: 16, // Aumentado para 16 para melhor legibilidade
    fontWeight: 'bold',
  },
  itemCodeCNPJCPF: {
    color: colors.black,
    marginRight: 5,
    fontSize: 14, // Aumentado para 16 para melhor legibilidade
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
    color: colors.black,
    fontSize: 14, // Aumentado para 14 para melhor legibilidade
  },
  noResultsText: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
