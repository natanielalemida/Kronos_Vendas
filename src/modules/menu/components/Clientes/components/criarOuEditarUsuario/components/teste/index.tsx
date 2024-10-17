import React, {useState, forwardRef} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard, // Importando Keyboard
} from 'react-native';
import UseGetMunicipio from '../../hooks/useGetMunicipio';
import Init from '../../../../hooks/init';
import {colors} from '../../../../../../../styles';
import {useCliente} from '../../../../context/clientContext';
import CustomTextInput from '../../../../../../../components/customTextInput/customTextInput';

export const RemoteDataSetExample3 = forwardRef((props, ref) => {
  const {setForm, form} = useCliente();
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const {getMunicipio, municipios} = UseGetMunicipio();

  Init({handleGetUsers: getMunicipio});

  if (municipios.length < 1) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00B08F" />
      </View>
    );
  }

  const handleSearch = text => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = municipios.filter(item =>
        item.MunicipioNome.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const handleSelectItem = item => {
    Keyboard.dismiss(); // Fechando o teclado ao selecionar um item
    setForm(oldValue => ({
      ...oldValue,
      Municipio: {
        Codigo: item.Codigo,
        MunicipioNome: item.MunicipioNome,
        MunicipioCodigo: item.MunicipioCodigo,
        Estado: item.Estado,
      },
    }));
    setQuery(item.MunicipioNome);
    setFilteredData([]);
  };

  return (
    <View style={styles.container}>
      <CustomTextInput
        ref={ref} // Usando a ref aqui no CustomTextInput
        style={styles.input}
        placeholder="Municipios"
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor={colors.black}
      />
      {filteredData.length > 0 && (
        <FlatList
          contentContainerStyle={{padding: 10}}
          data={filteredData}
          keyExtractor={item => item.Codigo.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => handleSelectItem(item)}
              key={`${index}-${item.Codigo}`}>
              <Text style={styles.suggestion}>{item.MunicipioNome}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    color: colors.black,
  },
  suggestionsContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  suggestion: {
    padding: 10,
    color: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
