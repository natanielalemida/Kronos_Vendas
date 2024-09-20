import {
  DimensionValue,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {useState} from 'react';
import {colors} from '../../../../../../../../styles';
import ModalSelect from './ModalSelect';
import {FormaPagamento} from '../../../../../../../../../sync/pagamentos/type';

type InputProps = {
  placeholder?: string;
  value?: string;
  onTextChange: (value: FormaPagamento) => void;
  data: FormaPagamento[] | undefined;
  inputWidth?: DimensionValue;
};

export default function SelectPayment({
  placeholder,
  data,
  value,
  onTextChange,
}: InputProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const label = !value ? placeholder : value;

  return (
    <TouchableOpacity
      style={{
        width: '100%',
        paddingVertical: 5,
        borderBottomColor: colors.black,
        borderBottomWidth: 1,
        alignSelf: 'center',
      }}
      onPress={() => setModalVisible(!modalVisible)}>
      <Text>{label}</Text>
      <ModalSelect
        isActive={modalVisible}
        label="Selecione a Condição de Pagamento"
        closeModal={setModalVisible}
        onTextChange={onTextChange}
        data={data}
      />
    </TouchableOpacity>
  );
}
