import {DimensionValue, Text, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import ModalSelect from './ModalSelect';
import {colors} from '../../../../../../styles';
import {MunicipioSelectDto} from './type';

type InputProps = {
  placeholder?: string;
  value?: string;
  onTextChange: (value: MunicipioSelectDto) => void;
  data: MunicipioSelectDto[] | undefined;
  inputWidth?: DimensionValue;
};

export default function SelectMunicipio({
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
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'black',
        marginHorizontal: 2,
        padding: 10,
        width: '100%',
      }}
      onPress={() => setModalVisible(!modalVisible)}>
      <Text
        style={{
          color: '#000000',
          fontWeight: 'bold',
          fontSize: 16,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
