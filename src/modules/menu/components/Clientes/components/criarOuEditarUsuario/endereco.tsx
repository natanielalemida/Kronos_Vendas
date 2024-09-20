// @ts-nocheck
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import CustomTextInput from '../../../../../components/customTextInput/customTextInput';
import {colors} from '../../../../../styles';
import UseSaveOrEdit from './hooks/useSaveOrEdit';
import SelectMunicipio from './components';
import Init from '../../hooks/init';
import UseGetMunicipio from './hooks/useGetMunicipio';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {RemoteDataSetExample3} from './components/teste';

export default function Endereco() {
  const {form, setForm} = UseSaveOrEdit();

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              style={styles.input}
              placeholder="Logradouro"
              value={form.Logradouro}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, Logradouro: value}))
              }
            />
            <CustomTextInput
              placeholder="Nº"
              style={styles.input}
              flex={1}
              keyboardType="numeric"
              value={form.NumeroEndereco}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, NumeroEndereco: value}))
              }
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Bairro"
              style={styles.input}
              value={form.Bairro}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, Bairro: value}))
              }
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              style={styles.input}
              placeholder="Complemento"
              value={form.Complemento}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, Complemento: value}))
              }
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="CEP"
              style={styles.input}
              keyboardType="numeric"
              value={form.CEP}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, CEP: value}))
              }
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <RemoteDataSetExample3 />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flex: 1,
    paddingLeft: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 16,
  },
  cancelButton: {
    padding: 14,
    width: '30%',
    alignItems: 'center',
    backgroundColor: colors.cancelButton,
    borderRadius: 25,
  },
  finishButton: {
    padding: 14,
    alignItems: 'center',
    width: '30%',
    backgroundColor: colors.confirmButton,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
