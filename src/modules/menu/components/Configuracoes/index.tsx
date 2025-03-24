import React, {useCallback, useState} from 'react';
import {Text, View, Switch, StyleSheet} from 'react-native';
import {colors} from '../../../styles';
import UseRepository from './hooks/useRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Configuracoes() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [syncImages, setSyncImages] = useState(false);

  const {save} = UseRepository();

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    await save({
      Descricao: 'UsarApenasOnline',
      Valor: '1',
      Ativo: true,
    });
  };

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

      useFocusEffect(
        useCallback(() => {
          loadSyncStatus();
          return () => {
          };
        }, []),
      );


  const handleSyncChange = (value) => {
    setSyncImages(value);
    saveSyncStatus(value); 
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.text}>Usar apenas online</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.arcGreen}}
          thumbColor={isEnabled ? colors.confirmButton : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.text}>Sincronizar imagens de produtos</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.arcGreen}}
          thumbColor={syncImages ? colors.confirmButton : '#f4f3f4'}
          onValueChange={handleSyncChange}
          value={syncImages}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    color: colors.black,
    marginRight: 10,
    fontWeight: '600',
    fontSize: 16,
  },
});
