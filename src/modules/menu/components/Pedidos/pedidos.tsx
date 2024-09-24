import React, {useState, useRef, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {CheckBox} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import {HeaderProducts} from '../../../components/headers/HeaderProducts';

export default function Pedidos() {
  const navigation = useNavigation();
  const {
    getPedidos,
    pedidos,
    isLoading,
    teste,
    setLoading,
    getPedidosNotSynced,
  } = UseRepository();

  const [options, setOptions] = useState({syncds: true, notSyncd: true});
  const [textFilter, setTextFilter] = useState<string>('');
  const [filteredPedidos, setFilteredPedidos] = useState<PedidoSearchDto[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [filterModalPosition, setFilterModalPosition] = useState({x: 0, y: 0});
  const [pedidosSelecionados, setPedidosSelecionados] = useState<
    PedidoSearchDto[]
  >([]);

  const filterIconRef = useRef<TouchableOpacity>(null);

  useEffect(() => {
    getPedidos(options);
  }, [options]);

  Init({handleGetProdutos: () => getPedidos(options), setOptions});

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

  const navigateResumo = (item: PedidoSearchDto) => {
    navigation.navigate('resumoPedidoNavigation', {
      id: item.id,
      Codigo: item.Codigo,
    });
  };

  const enviarPedidos = async () => {
    try {
      if (pedidosSelecionados.length > 0) {
        await Promise.all(
          pedidosSelecionados.map(async pedido => await teste(pedido.id)),
        );
        setPedidosSelecionados([]);
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Pedido enviado com sucesso',
          visibilityTime: 2000,
        });
      } else {
        const data = await getPedidosNotSynced();
        await Promise.all(data.map(async pedido => await teste(pedido.id)));
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Pedido enviado com sucesso',
          visibilityTime: 2000,
        });
      }
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

  const renderItem = (item: PedidoSearchDto) => {
    const isSelected = pedidosSelecionados.some(
      pedido => pedido.id === item.id,
    );

    const backgroundColor = isSelected ? colors.arcGreen : undefined;

    return (
      <TouchableOpacity
        key={`${(item.Codigo, item.id)}`}
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
          <Text>Emissão: {item.DataEmissao.slice(0, 10)}</Text>
          <View style={styles.neonContainer}>
            <Text style={styles.neonText}>Sinc</Text>
            <CheckBox
              checked={!!item.Codigo}
              containerStyle={styles.checkBoxContainer}
              onPress={() => handleSelection(item)}
            />
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
        leftIcon="menu"
        rightIcon="cloud-upload-outline"
        onPressLeftIcon={() => navigation.toggleDrawer()}
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
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredPedidos.map(item => renderItem(item))}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  filterIcon: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    width: '100%',
    padding: 8,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  neonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  neonText: {
    fontWeight: 'bold',
  },
  checkBoxContainer: {
    backgroundColor: undefined,
  },
  listContainer: {},
});
