import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import useGetFetch from './hooks/useGetFetch';
import Search from '../../../../../components/search';
import Loading from '../../../../../components/loading/Loading';
import {colors} from '../../../../../styles';
import {useCliente} from '../../../Clientes/context/clientContext';
import {ClienteDto} from '../../../../../../sync/clientes/type';
import {useNavigation} from '@react-navigation/native';
import {ShowIf} from '../../../../../components/showIf';

export default function SelectClientes() {
  const navigation = useNavigation();
  const [textFilter, setTextFilter] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const {handleGetUsers, clientes, isLoading} = useGetFetch();
  const {setClienteOnContext} = useCliente();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      handleGetUsers(textFilter);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [textFilter]);

  const handleSelectCliente = (cliente: ClienteDto) => {
    setClienteOnContext(cliente);
    navigation.goBack();
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

  const renderClienteItem = ({
    item,
    index,
  }: {
    item: ClienteDto;
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {backgroundColor: index % 2 === 0 ? colors.grayList : colors.white},
      ]}
      onPress={() => handleSelectCliente(item)}
      key={`${item.Codigo}-${index}`}>
      {/* Chave única */}
      <View style={styles.itemTopRow}>
        <Text style={styles.itemCode}>{item.Codigo}</Text>
        <Text style={styles.itemDescription}>{item.NomeFantasia}</Text>
      </View>
      <ShowIf condition={!!item.CNPJCPF}>
        <View style={styles.itemTopRow}>
          <ShowIf condition={!!item.CNPJCPF && item?.CNPJCPF.length > 11}>
            <Text style={styles.itemCodeCNPJCPF}>
              CNPJ: {mascararCNPJ(item.CNPJCPF)}
            </Text>
          </ShowIf>
          <ShowIf condition={!!item.CNPJCPF && item?.CNPJCPF.length <= 11}>
            <Text style={styles.itemCodeCNPJCPF}>
              CPF: {mascararCPF(item.CNPJCPF)}
            </Text>
          </ShowIf>
        </View>
      </ShowIf>
      {item.Enderecos?.map(renderEndereco)}
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
        <Loading isModalLoadingActive={isLoading} />
        {clientes.length === 0 && !isLoading ? ( // Exibir mensagem se não houver clientes
          <Text style={styles.noResultsText}>Nenhum cliente encontrado.</Text>
        ) : (
          <FlatList
            data={clientes}
            renderItem={renderClienteItem}
            keyExtractor={item => `${item.Codigo}-${item.NomeFantasia}`} // Usar chave única
            initialNumToRender={10} // Adicione as propriedades de otimização
            maxToRenderPerBatch={10}
            scrollEventThrottle={16}
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
  itemCodeCNPJCPF: {
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
    fontSize: 14, // Aumentado para 14 para melhor legibilidade
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
