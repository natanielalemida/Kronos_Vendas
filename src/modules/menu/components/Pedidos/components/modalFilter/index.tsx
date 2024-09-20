import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../../../../styles';

import Ionicons from 'react-native-vector-icons/Ionicons';

interface ModalFilterProps {
  visible: boolean;
  onClose: () => void;
  position: {x: number; y: number};
  setOptions: (value: {syncds: boolean; notSyncd: boolean}) => void;
  options: {syncds: boolean; notSyncd: boolean};
}

export default function ModalFilter({
  visible,
  onClose,
  position,
  setOptions,
  options,
}: ModalFilterProps) {
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      style={{flex: 1}}
      onRequestClose={onClose}>
      <TouchableOpacity onPress={onClose} style={{flex: 1}}>
        <View
          style={[
            styles.modalContainer,
            {
              top: position.y,
              alignSelf: 'flex-end',
              right: 10,
            },
          ]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="cloud-upload-outline"
                size={25}
                color={colors.confirmButton}
                style={{paddingHorizontal: 10}}
              />
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingHorizontal: 10,
                }}>
                Sincronizados
              </Text>
            </View>
            <Switch
              value={options.syncds}
              onValueChange={() =>
                setOptions(oldValue => ({
                  ...oldValue,
                  syncds: !oldValue.syncds,
                }))
              }
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="cloud-offline-outline"
                size={25}
                color={colors.cancelButton}
                style={{paddingHorizontal: 10}}
              />
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingHorizontal: 10,
                }}>
                Não sincronizaos
              </Text>
            </View>
            <Switch
              value={options.notSyncd}
              onValueChange={() =>
                setOptions(oldValue => ({
                  ...oldValue,
                  notSyncd: !oldValue.notSyncd,
                }))
              }
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
