import React, {useState} from 'react';
import {Text, View, Switch, StyleSheet} from 'react-native';
import {colors} from '../../../styles';
import UseRepository from './hooks/useRepository';

export default function Configuracoes() {
  const [isEnabled, setIsEnabled] = useState(false);
  const {save} = UseRepository();

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    await save({
      Descricao: 'UsarApenasOnline',
      Valor: '1',
      Ativo: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Usar apenas online</Text>
      <Switch
        trackColor={{false: '#767577', true: colors.arcGreen}}
        thumbColor={isEnabled ? colors.confirmButton : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    color: colors.black,
    marginRight: 10,
    fontWeight: '600',
    fontSize: 16,
  },
});
