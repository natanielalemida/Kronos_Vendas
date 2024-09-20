import {
  DimensionValue,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../input/styles';
import ModalSelect from './ModalSelect';
import {useMemo, useState} from 'react';

type InputProps = {
  leftIcon?: string;
  rightIcon?: string;
  placeholder?: string;
  leftSize?: number;
  leftColor?: string;
  rightColor?: string;
  rightSize?: number;
  value?: string;
  onTextChange: (value: {NomeFantasia: string; Codigo: number}) => void;
  data: {NomeFantasia: string; Codigo: number}[];
  style?: {};
  inputWidth?: DimensionValue;
};

export default function Select({
  leftIcon,
  rightIcon,
  leftSize,
  leftColor,
  rightColor,
  rightSize,
  placeholder,
  data,
  value,
  inputWidth,
  onTextChange,
}: InputProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const label = !value ? placeholder : value;

  return (
    <TouchableOpacity
      style={[styles.inputContainer, {width: inputWidth}]}
      onPress={() => setModalVisible(!modalVisible)}>
      <View style={styles.leftIconContainer}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={leftSize}
            color={leftColor}
            style={styles.leftIcon}
          />
        )}
        <Text>{label}</Text>
        <ModalSelect
          isActive={modalVisible}
          closeModal={setModalVisible}
          onTextChange={onTextChange}
          data={data}
        />
      </View>
      {rightIcon && (
        <Icon name={rightIcon} color={rightColor} size={rightSize} />
      )}
    </TouchableOpacity>
  );
}
