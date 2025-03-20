import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../../../styles';
import UseSaveOrEdit from './hooks/useSaveOrEdit';
import ServiceEnviarSingleCliente from '../../../../../enviarDados/cliente/service/serviceEnviarSingleCliente';
import {useCliente} from '../../context/clientContext';
import {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Loading from '../../../../../components/loading/Loading';
import {ShowIf} from '../../../../../components/showIf';
import Toast from 'react-native-toast-message';
import {HeaderProducts} from '../../../../../components/headers/HeaderProducts';

export default function Resumo() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(undefined);
  const {form, verify} = UseSaveOrEdit();
  const {params, usuario, handleClearForm, setClienteOnContext} = useCliente();
  const route = useRoute();
  const {params: itemDosCara} = route;
  const {setClienteOnContextActive} = itemDosCara || {};
  const service = new ServiceEnviarSingleCliente(
    params,
    usuario,
    form,
    setProgress,
  );

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

  const handleGoBack = () => {
    handleClearForm();
    navigation.pop(1);
  };

  const handleGoBack2 = () => {
    handleClearForm();
    navigation.pop(2);
  };

  const validate = () => {
    const result = verify(['NomeFantasia', 'Municipio', 'CEP', 'CNPJCPF']);
    if (result) return true;
    Alert.alert(
      'Campos obrigatorios',
      'por favor, preecha todos os campos obrigatios',
    );
    return false;
  };

  const handle = async (value: boolean, value2: boolean) => {
    const result = validate();
    if (!result) return;
    try {
      const sucess = await service.iniciarSincronizacaoSingle(value, value2);
      if (sucess) {
        if (setClienteOnContextActive) {
          setClienteOnContext(sucess);
          Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text1Style: {fontSize: 18, fontWeight: 'bold'},
            text2: 'Usuário criado com sucesso',
            text2Style: {fontSize: 14},
            visibilityTime: 2000,
          });
          setTimeout(() => {
            handleGoBack2();
          }, 500);
          return;
        }
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text1Style: {fontSize: 18, fontWeight: 'bold'},
          text2: 'Usuário criado com sucesso',
          text2Style: {fontSize: 14},
          visibilityTime: 2000,
        });
        setTimeout(() => {
          handleGoBack();
        }, 500);
      }
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Network Error') {
        Alert.alert(
          'Sem conexão',
          'Verifique sua conexão com a internet e tente novamente',
        );

        setProgress(undefined);
        return;
      }
      Alert.alert('Falha', err.message);
      setProgress(undefined);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderProducts
        label="Resumo"
        leftIcon="chevron-back-outline"
        leftSize={25}
        leftColor="white"
        rightIcon={form.isSincronizado ? undefined : 'save-outline'}
        rightColor="white"
        rightSize={25}
        rightIcon2={form.isSincronizado ? undefined : 'cloud-upload-outline'}
        rightColor2="white"
        rightSize2={25}
        onPressRightIcon2={() => handle(true)}
        onPressLeftIcon={() => handleGoBack()}
        onPressRightIcon={() => handle(false)}
      />
      <Loading isModalLoadingActive={!!progress && progress != undefined} />
      <View style={{padding: 10, flex: 1}}>
        <ScrollView>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.labelTextH1}>Dados pessoais</Text>
              <View style={styles.inputContainer} />
              <View style={styles.infoContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Nome / Razao social</Text>
                    <ShowIf condition={form.CNPJCPF?.length <= 11}>
                      <Text style={styles.infoText}>{form.NomeFantasia}</Text>
                    </ShowIf>
                    <ShowIf condition={form.CNPJCPF?.length > 11}>
                      <Text style={styles.infoText}>{form.RazaoSocial}</Text>
                    </ShowIf>
                  </View>
                  <View style={{alignItems: 'flex-end', width: '40%'}}>
                    <Text style={styles.label}>Status</Text>
                    <ShowIf condition={!form.isSincronizado}>
                      <Text
                        style={{color: colors.cancelButton, fontWeight: '500'}}>
                        Não sincronizado
                      </Text>
                    </ShowIf>
                    <ShowIf condition={form.isSincronizado}>
                      <Text style={{color: colors.arcGreen, fontWeight: '500'}}>
                        Sincronizado
                      </Text>
                    </ShowIf>
                  </View>
                </View>

                {form.CNPJCPF && form.CNPJCPF.length > 11 && (
                  <View>
                    <Text style={styles.label}>CNPJ</Text>
                    <Text style={styles.infoText}>
                      {mascararCNPJ(form.CNPJCPF)}
                    </Text>
                  </View>
                )}
                {form.CNPJCPF && form.CNPJCPF.length <= 11 && (
                  <View>
                    <Text style={styles.label}>CPF</Text>
                    <Text style={styles.infoText}>
                      {mascararCPF(form.CNPJCPF)}
                    </Text>
                  </View>
                )}
                <ShowIf condition={!!form.IE}>
                  <Text style={styles.label}>RG / IE</Text>
                  <Text style={styles.infoText}>{form.IE}</Text>
                </ShowIf>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.labelTextH1}>Endereço</Text>
              <View style={styles.inputContainer} />
              <View style={styles.infoContainer}>
                <View style={styles.rowWithTwoColumns}>
                  <View>
                    <Text style={styles.label}>Logradouro</Text>
                    <Text style={styles.infoText}>{form.Logradouro}</Text>
                  </View>
                  <View style={styles.rightAligned}>
                    <Text style={styles.label}>Numero</Text>
                    <Text style={styles.infoText}>{form.NumeroEndereco}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.rowWithTwoColumns}>
                  <View>
                    <Text style={styles.label}>Bairro</Text>
                    <Text style={styles.infoText}>{form.Bairro}</Text>
                  </View>
                  <View style={styles.rightAligned}>
                    <Text style={styles.label}>CEP</Text>
                    <Text style={styles.infoText}>{form.CEP}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.rowWithTwoColumns}>
                  <View>
                    <Text style={styles.label}>Cidade</Text>
                    <Text style={styles.infoText}>
                      {form.Municipio?.MunicipioNome}
                    </Text>
                  </View>
                  <View style={styles.rightAligned}>
                    <Text style={styles.label}>Estado</Text>
                    <Text style={styles.infoText}>
                      {form?.Municipio?.Estado}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.labelTextH1}>Contatos</Text>
              <View style={styles.inputContainer} />
              <View style={styles.infoContainer}>
                {form.Celular.map((celularContato, index) => (
                  <View key={index}>
                    <Text style={styles.label}>Celular</Text>
                    <Text style={styles.infoText}>
                      {celularContato.Contato}
                    </Text>
                  </View>
                ))}

                {form.Email.map((EmailContato, index) => (
                  <View key={index}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.infoText}>{EmailContato.Contato}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  column: {
    flex: 1,
  },
  labelTextH1: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    paddingVertical: 5,
  },
  label: {
    color: colors.black,
    fontWeight: 'bold',
  },
  infoText: {
    paddingVertical: 5,
    color: colors.black,
  },
  rowWithTwoColumns: {
    flexDirection: 'row',
  },
  rightAligned: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
