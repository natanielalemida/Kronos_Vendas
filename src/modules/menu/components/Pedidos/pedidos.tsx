import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import UseRepository from './hooks/useRepository';
import Init from '../Produtos/hooks/init';
import Search from '../../../components/search';
import useFilter from '../Produtos/hooks/useFilter';
import {PedidoSearchDto} from './type';
import {colors} from '../../../styles';
import Loading from '../../../components/loading/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalFilter from './components/modalFilter';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {CheckBox} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import {HeaderProducts} from '../../../components/headers/HeaderProducts';
import Tag from '../../../components/tag/tag';
import {useCliente} from '../Clientes/context/clientContext';
import {getClienteToSave} from './components/resumoPedido/hooks/getClienteToSave';
import {getTerminal} from '../../../../storage/empresaStorage';

export default function Pedidos() {
  const route = useRoute();
  const {params} = route;
  const {clienteId} = params || {};
  const navigation = useNavigation();
  const {getPedidos, pedidos, isLoading, teste, setLoading, setPedidos} =
    UseRepository();
  const {usuario, empresa} = useCliente();
  const {getByIdToSave} = getClienteToSave();
  const [options, setOptions] = useState({
    syncds: true,
    notSyncd: true,
  });
  const [textFilter, setTextFilter] = useState<string>('');
  const [filteredPedidos, setFilteredPedidos] = useState<PedidoSearchDto[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [filterModalPosition, setFilterModalPosition] = useState({x: 0, y: 0});
  const [pedidosSelecionados, setPedidosSelecionados] = useState<
    PedidoSearchDto[]
  >([]);

  const filterIconRef = useRef<TouchableOpacity>(null);

  const labels = {
    0: {label: 'Pendente', color: '#f1c40f'},
    1: {label: 'Aprovado', color: '#2ecc71'},
    2: {label: 'Cancelada', color: '#e74c3c'},
  };

  useEffect(() => {
    getPedidos(options);
  }, [options]);

  useFocusEffect(
    useCallback(() => {
      setOptions(oldValue => ({...oldValue, clienteId}));
      return () => {
        setFilteredPedidos([]);
        setPedidos([]);
        navigation.setParams({clienteId: undefined});
      };
    }, [clienteId]),
  );

  useFilter({
    textFilter,
    produtos: pedidos,
    setFilteredProdutos: setFilteredPedidos,
  });

  const handleSelection = (item: PedidoSearchDto) => {
    const index = pedidosSelecionados.findIndex(
      pedido => pedido.id === item.id,
    );
    const selectedPedidos =
      index !== -1
        ? pedidosSelecionados.filter(pedido => pedido.id !== item.id)
        : [...pedidosSelecionados, item];

    setPedidosSelecionados(selectedPedidos);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const navigateResumo = (item: PedidoSearchDto) => {
    navigation.navigate('resumoPedidoNavigation', {
      id: item.id,
      Codigo: item.Codigo,
      idCliente: item.PessoaCodigo ? undefined : item.idPessoa,
    });
  };

  const enviarPedidos = async () => {
    try {
      if (pedidosSelecionados.length === 0) {
        Toast.show({
          type: 'error',
          text1: 'Sem pedidos selecionados',
          text2: 'Por favor, selecione um pedido',
          visibilityTime: 2000,
        });
        return;
      }

      const terminal = await getTerminal();

      const result = await Promise.all(
        pedidosSelecionados.map(async pedido => {
          const pessoaId = await getByIdToSave(pedido.idPessoa);
          return teste(pedido.id, pessoaId, usuario, empresa.Codigo, terminal);
        }),
      );


     const haveInvalid = result.find((value) => value === !value)

      if (!haveInvalid) return;

      setPedidosSelecionados([]);

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Pedido enviado com sucesso',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Erro ao processar os pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    filterIconRef.current?.measure((fx, fy, width, height, px, py) => {
      setFilterModalPosition({x: px, y: py + height});
      setIsModalVisible(true);
    });
  };

  const isEven = (index: number) => index % 2 === 0;

  const renderItem = (item: PedidoSearchDto, index: number) => {
    const isSelected = pedidosSelecionados.some(
      pedido => pedido.id === item.id,
    );
    const backgroundColor = isSelected
      ? colors.arcGreen
      : isEven(index)
      ? colors.grayList
      : colors.white;

    return (
      <TouchableOpacity
        key={`${item.Codigo}-${item.id}`}
        onPress={() => navigateResumo(item)}
        style={[styles.itemContainer, {backgroundColor}]}>
        <View style={styles.itemTopRow}>
          <Text style={styles.itemCode}>{item.Codigo} -</Text>
          <Text style={styles.itemDescription}>{item.NomeFantasia}</Text>
          <Text style={styles.itemPrice}>
            R$ {item.ValorRecebido.toFixed(2)}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.black}>
            Emissão: {formatDate(item.DataEmissao)}
          </Text>
          <View
            style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <Tag
              color={labels[item.Situacao].color}
              label={labels[item.Situacao].label}
            />
            <View style={styles.neonContainer}>
              <Text style={styles.neonText}>Sinc</Text>
              <CheckBox
                checked={!!item.Codigo}
                containerStyle={styles.checkBoxContainer}
                onPress={() => handleSelection(item)}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <HeaderProducts
        label="Pedidos"
        leftColor="white"
        rightColor="white"
        leftSize={25}
        rightSize={25}
        leftIcon={clienteId ? 'chevron-back-outline' : 'menu'}
        rightIcon="cloud-upload-outline"
        onPressLeftIcon={
          clienteId
            ? () => navigation.goBack()
            : () => navigation.toggleDrawer()
        }
        onPressRightIcon={enviarPedidos}
      />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Search
            placeholder="Pesquisar..."
            value={textFilter}
            onChangeText={setTextFilter}
          />
          <TouchableOpacity
            ref={filterIconRef}
            style={styles.filterIcon}
            onPress={handleOpenModal}>
            <Icon name="filter" size={25} color="black" />
          </TouchableOpacity>
        </View>
        <Loading isModalLoadingActive={isLoading} />
        <ScrollView style={styles.scrollContainer}>
          {filteredPedidos.map((item, index) => renderItem(item, index))}
        </ScrollView>
        <ModalFilter
          options={options}
          setOptions={setOptions}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          position={filterModalPosition}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  black: {
    color: colors.black,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  filterIcon: {
    paddingHorizontal: 10,
  },
  scrollContainer: {
    width: '100%',
  },
  itemContainer: {
    width: '100%',
    padding: 15,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemCode: {
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemDescription: {
    width: '62%',
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  neonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  neonText: {
    fontWeight: 'bold',
    color: colors.black,
  },
  checkBoxContainer: {
    backgroundColor: undefined,
    padding: 0,
    marginRight: -1,
  },
});
