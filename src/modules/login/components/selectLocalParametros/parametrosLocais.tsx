import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { colors } from '../../../styles';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BottomModal({ isActive, closeModal }) {
  const [syncImages, setSyncImages] = useState(false);

  const loadSyncStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('syncImages');
      if (value !== null) {
        setSyncImages(JSON.parse(value));
      }
    } catch (error) {
      console.error('Erro ao carregar a configuração:', error);
    }
  };

  const saveSyncStatus = async (status) => {
    try {
      await AsyncStorage.setItem('syncImages', JSON.stringify(status));
    } catch (error) {
      console.error('Erro ao salvar a configuração:', error);
    }
  };

  useEffect(() => {
    if (isActive) {
      loadSyncStatus();
    }
  }, [isActive]);

  const handleSyncChange = (value) => {
    setSyncImages(value);
    saveSyncStatus(value); 
  };

  return (
    <Modal visible={isActive} transparent animationType="slide">
      <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
        <View style={styles.modalContent}>
          <View style={styles.title}>
            <Text style={styles.modalTitle}>Parâmetros Locais</Text>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="close" size={25} color="white" />
            </TouchableOpacity>
          </View>

          {/* <View style={styles.labelContainer}>
            <Text style={styles.label}>Sincronizar imagens de produtos</Text>
            <Switch value={syncImages} onValueChange={handleSyncChange} />
          </View> */}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    padding: 10,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    backgroundColor: colors.arcGreen,
    width: '100%',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  labelContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15 
  },
  label: { 
    marginRight: 10, 
    color: 'black', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: colors.yellow,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 15,
  },
  buttonLabel: { color: 'white', fontSize: 16 },
});
