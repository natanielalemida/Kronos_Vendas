import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../../../styles';
import {Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Loading from '../../../../../components/loading/Loading';
import Search from '../../../../../components/search';
import {useEffect, useState} from 'react';
import {
  ProdutoBodyCreateQtAndObsDto,
  ProdutoDto,
} from '../../../../../../sync/products/type';
import useFilter from '../listProdutos/hooks/useFilter';
import {useCliente} from '../../../Clientes/context/clientContext';
import ModalDeleteOrEdit from './compents/modalEditOrDelete';
import ModalVenda from '../listProdutos/components/modalVenda';

export default function EditarProdutoNaLista() {
  const {ProdutosSelecionados} = useCliente();
  const [produto, setProduto] = useState<ProdutoBodyCreateQtAndObsDto>();
  const [isModalActive, setModalActive] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [textFilter, setTextFilter] = useState<string>('');
  const [filteredProdutos, setFilteredProdutos] = useState<
    ProdutoBodyCreateQtAndObsDto[]
  >([]);

  useFilter({textFilter, produtos: ProdutosSelecionados, setFilteredProdutos});

  const handleSet = (produto: ProdutoBodyCreateQtAndObsDto) => {
    setProduto(produto);
    setModalActive(true);
  };

  return (
    <View style={styles.container}>
      <Search
        placeholder="Pesquisar..."
        value={textFilter}
        onChangeText={setTextFilter}
      />
      <View style={styles.top}>
        <ModalDeleteOrEdit
          produto={produto}
          isModalActive={isModalActive}
          setModalActive={setModalActive}
          setIsEditing={setIsEditing}
        />
        <ModalVenda
          isActive={isEditing}
          setIsActive={setIsEditing}
          produto={produto}
        />

        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          {filteredProdutos.map(item => {
            return (
              <TouchableOpacity
                onPress={() => handleSet(item)}
                style={styles.itemContainer}
                key={`${item.Codigo}`}>
                <View style={styles.itemTopRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemCode}>{item.Codigo}</Text>
                    <Text style={styles.itemDescription}>{item.Descricao}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    R$ {item.ValorVenda.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.itemBottomRow}>
                  <View style={styles.itemDetailsLeft}>
                    <Text>Qtd. {item.Quantidade}</Text>
                    <Text>X</Text>
                    <Text>{item.ValorVenda.toFixed(2)}</Text>
                  </View>
                  <Text>
                    Total: R$ {(item.Quantidade * item.ValorVenda).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </KeyboardAwareScrollView>
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
  itemDetailsLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
});
