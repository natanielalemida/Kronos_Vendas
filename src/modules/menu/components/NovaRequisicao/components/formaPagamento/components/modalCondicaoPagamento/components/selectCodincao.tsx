import {DimensionValue, Text, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {colors} from '../../../../../../../../styles';
import ModalSelect from './ModalSelect';
import {CondicaoPagamento} from '../../../../../../../../../sync/pagamentos/type';
import ModalSelectCondicao from './ModalSelectCondicao';

type InputProps = {
  placeholder?: string;
  value?: CondicaoPagamento;
  onTextChange: (value: CondicaoPagamento) => void;
  data: CondicaoPagamento[] | undefined;
  inputWidth?: DimensionValue;
};

export default function SelectCondicao({
  placeholder,
  data,
  value,
  onTextChange,
}: InputProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const label = !value
    ? placeholder
    : `${value.Codigo} | ${value.IntervaloDias}/DIAS`;

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
      <Text style={{color: colors.black}}>{label}</Text>
      <ModalSelectCondicao
        isActive={modalVisible}
        label="Selecione a Condição de Pagamento"
        closeModal={setModalVisible}
        onTextChange={onTextChange}
        data={data}
      />
    </TouchableOpacity>
  );
}
