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
import {useCallback, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {CheckBox} from '@rneui/themed';

export default function Endereco() {
  const {form, setForm} = UseSaveOrEdit();
  const [semNumero, isSemNumero] = useState(false);

  const LogradouroRef = useRef(null);
  const NumeroRef = useRef(null);
  const BairroRef = useRef(null);
  const ComplementoRef = useRef(null);
  const CEPRef = useRef(null);
  const MunicipioRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      LogradouroRef.current.focus();
      return () => {};
    }, []),
  );

  const handleSetIsNumero = value => {
    isSemNumero(value);
    if (value) {
      setForm(oldValue => ({...oldValue, NumeroEndereco: 'S/N'}));
      return;
    }
    setForm(oldValue => ({...oldValue, NumeroEndereco: undefined}));
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={LogradouroRef}
              style={styles.input}
              placeholder="Logradouro"
              value={form.Logradouro}
              onSubmitEditing={() => NumeroRef.current.focus()}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, Logradouro: value}))
              }
            />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <CustomTextInput
                ref={NumeroRef}
                placeholder="Nº"
                style={styles.input}
                onSubmitEditing={() => BairroRef.current.focus()}
                flex={1}
                keyboardType="numeric"
                value={form.NumeroEndereco}
                onChangeText={value =>
                  setForm(oldValue => ({...oldValue, NumeroEndereco: value}))
                }
              />
              <TouchableOpacity
                onPress={() => handleSetIsNumero(!semNumero)}
                style={{
                  height: 30,
                  width: 30,
                  marginLeft: 15,
                }}>
                <CheckBox
                  checked={semNumero}
                  onPress={() => handleSetIsNumero(!semNumero)}
                  containerStyle={{
                    backgroundColor: undefined,
                    padding: 0,
                    paddingRight: 30,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={BairroRef}
              placeholder="Bairro"
              style={styles.input}
              value={form.Bairro}
              onSubmitEditing={() => ComplementoRef.current.focus()}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, Bairro: value}))
              }
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={ComplementoRef}
              style={styles.input}
              placeholder="Complemento"
              value={form.Complemento}
              onSubmitEditing={() => CEPRef.current.focus()}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, Complemento: value}))
              }
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={CEPRef}
              placeholder="CEP"
              style={styles.input}
              keyboardType="numeric"
              value={form.CEP}
              onSubmitEditing={() => MunicipioRef.current.focus()}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, CEP: value}))
              }
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <RemoteDataSetExample3 ref={MunicipioRef} />
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
    height: 40,
    color: colors.black,
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
