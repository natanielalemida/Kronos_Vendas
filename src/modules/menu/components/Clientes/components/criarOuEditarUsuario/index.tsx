// @ts-nocheck
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import CustomTextInput from '../../../../../components/customTextInput/customTextInput';
import {colors} from '../../../../../styles';
import UseSaveOrEdit from './hooks/useSaveOrEdit';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import {TextInputMask} from 'react-native-masked-text';
import {ShowIf} from '../../../../../components/showIf';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CriarOuEditarUsuario() {
  const navigation = useNavigation();
  const {form, setForm, handleClearForm, verify} = UseSaveOrEdit();
  const [celular, setCelular] = useState();
  const [email, setEmail] = useState();

  const next = () => {
    const result = verify([
      'CNPJCPF',
      'IE',
      'NomeFantasia',
      'RazaoSocial',
      'Email',
      'Celular',
    ]);
    if (!result) {
      Alert.alert('Campos obrigatórios', 'Por favor, preecha todos os campos');
      return;
    }
    navigation.navigate('Endereco');
  };

  const sureDelete = (contato: string, placeholder: string) => {
    setForm(oldValue => ({
      ...oldValue,
      [placeholder]: oldValue[placeholder].filter(
        item => item.Contato !== contato,
      ),
    }));
  };

  const deleteCelular = (contato: string, placeholder: string) => {
    Alert.alert(
      'Você tem certeza?',
      `Deseja deletar o contato ${contato}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => sureDelete(contato, placeholder),
        },
      ],
      {cancelable: false},
    );
  };

  const handleSetValueToForm = (placeholder: string) => {
    const isEmail = placeholder === 'Email';
    setForm(oldValue => ({
      ...oldValue,
      [placeholder]: [
        ...oldValue[placeholder],
        isEmail ? {Contato: email} : {Contato: celular},
      ],
    }));

    isEmail ? setEmail('') : setCelular('');
  };

  const renderInputWithIcon = (
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
  ) => (
    <View style={styles.inputContainer}>
      {placeholder === 'Celular' ? (
        <TextInputMask
          type={'cel-phone'}
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99)',
          }}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          onEndEditing={() => handleSetValueToForm(placeholder)}
          style={styles.input}
        />
      ) : placeholder === 'Email' ? (
        <CustomTextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onEndEditing={() => handleSetValueToForm(placeholder)}
          keyboardType={keyboardType}
          style={styles.input}
        />
      ) : null}
      <Ionicons
        name="add-circle-outline"
        size={20}
        onPress={() => handleSetValueToForm(placeholder)}
        color={colors.primary}
        style={styles.inputIcon}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator>
      <View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              style={styles.input}
              placeholder="CPF/CNPJ"
              width="60%"
              keyboardType="numeric"
              value={form.CNPJCPF}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, CNPJCPF: value}))
              }
            />
            <CustomTextInput
              style={styles.input}
              placeholder="IE"
              keyboardType="numeric"
              flex={1}
              value={form.IE}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, IE: value}))
              }
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              style={styles.input}
              placeholder="Nome Fantasia"
              value={form.NomeFantasia}
              flex={1}
              onChangeText={value =>
                setForm(oldValue => ({...oldValue, NomeFantasia: value}))
              }
            />
          </View>
        </View>
        <ShowIf condition={form.CNPJCPF?.length > 11}>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                style={styles.input}
                placeholder="Razão Social"
                value={form.RazaoSocial}
                flex={1}
                onChangeText={value =>
                  setForm(oldValue => ({...oldValue, RazaoSocial: value}))
                }
              />
            </View>
          </View>
        </ShowIf>
        <View style={styles.row}>
          {renderInputWithIcon(
            'Celular',
            celular,
            value => setCelular(value),
            'numeric',
          )}
        </View>
        {form.Celular.map((celularContato, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                placeholder="Celular"
                style={styles.input}
                value={celularContato.Contato}
                flex={1}
              />
              <Icon
                name="trash"
                color={colors.cancelButton}
                size={25}
                onPress={() => deleteCelular(celularContato.Contato, 'Celular')}
              />
            </View>
          </View>
        ))}

        <View style={styles.row}>
          {renderInputWithIcon(
            'Email',
            email,
            value => setEmail(value),
            'email-address',
          )}
        </View>

        {form.Email.map((EmailContato, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                placeholder="Email"
                style={styles.input}
                value={EmailContato.Contato}
                flex={1}
              />
              <Icon
                name="trash"
                color={colors.cancelButton}
                size={25}
                onPress={() => deleteCelular(EmailContato.Contato, 'Email')}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingLeft: 12,
  },
  inputIcon: {
    marginLeft: 10, // Espaço entre o ícone e o campo de entrada
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
