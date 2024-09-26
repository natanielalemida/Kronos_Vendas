import {
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
import {HeaderProducts} from '../../../../../components/headers/HeaderProducts';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../../../../components/loading/Loading';
import {ShowIf} from '../../../../../components/showIf';
import Toast from 'react-native-toast-message';

export default function Resumo() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(undefined);
  const {form} = UseSaveOrEdit();
  const {params, usuario, handleClearForm} = useCliente();
  const service = new ServiceEnviarSingleCliente(
    params,
    usuario,
    form,
    setProgress,
  );

  const handleGoBack = () => {
    handleClearForm();
    navigation.pop(1);
  };

  const handle = async (value: boolean, value2: boolean) => {
    try {
      await service.iniciarSincronizacaoSingle(value, value2);
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
    } catch (error) {
      console.log(error);
    }
  };

  const syncAndSave = false;

  return (
    <View style={styles.container}>
      <HeaderProducts
        label="Resumo"
        leftIcon="chevron-back-outline"
        leftSize={25}
        leftColor="white"
        rightIcon={syncAndSave ? undefined : 'save-outline'}
        rightColor="white"
        rightSize={25}
        rightIcon2={'cloud-upload-outline'}
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
                      <Text>Não sincronizado</Text>
                    </ShowIf>
                    <ShowIf condition={form.isSincronizado}>
                      <Text>Sincronizado</Text>
                    </ShowIf>
                  </View>
                </View>
                <Text style={styles.label}>CPF / CNPJ</Text>
                <Text style={styles.infoText}>{form.CNPJCPF}</Text>
                <Text style={styles.label}>RG / IE</Text>
                <Text style={styles.infoText}>{form.IE}</Text>
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
                    <Text style={styles.infoText}>PA</Text>
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    paddingVertical: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  infoText: {
    paddingVertical: 5,
    fontWeight: '900',
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
