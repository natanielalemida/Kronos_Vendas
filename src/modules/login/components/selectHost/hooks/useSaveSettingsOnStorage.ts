import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

type PropsModal = {
  id?: number;
  host: string;
  terminal: string;
  codStore: string;
  isEdditing: boolean;
};

type UseStorageProps = {
    closeModal?: () => void;
}

export default function UseSaveSettingsOnStorage({}) {
  const [connections, setConnections] = useState<PropsModal[]>([]);

  const loadSettings = async () => {
    const storedData = await AsyncStorage.getItem('listaDeConexoes');
    return storedData ? JSON.parse(storedData) : [];
  };

  const deleteSetting = async (id: number) => {
    let storedConnections = await loadSettings();
    storedConnections = storedConnections.filter((conn: PropsModal) => conn.id !== id);
    await AsyncStorage.setItem('listaDeConexoes', JSON.stringify(storedConnections));
    setConnections(storedConnections);
  };

  const saveOrUpdateSetting = async (params: PropsModal, closeModal?: () => void) => {
    let storedConnections = await loadSettings();

    if (params.isEdditing) {
      storedConnections = storedConnections.map((conn: PropsModal) =>
        conn.id === params.id ? { ...conn, ...params } : conn
      );
    } else {
      storedConnections.push({ ...params});
    }
    
    await AsyncStorage.setItem('listaDeConexoes', JSON.stringify(storedConnections));
    setConnections(storedConnections);
  };

  const getConnections = async () => {
    const storedConnections = await loadSettings();
    setConnections(storedConnections)
  }

  const getById = async (id: number): Promise<PropsModal | undefined> => {
    const storedConnections = await loadSettings();
    return storedConnections.find((conn: PropsModal) => conn.id === id);
  };


  return {
    saveOrUpdateSetting,
    getConnections,
    deleteSetting,
    getById,
    connections,
  };
}
