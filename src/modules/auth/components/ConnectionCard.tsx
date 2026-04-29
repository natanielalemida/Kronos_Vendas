import {Ionicons} from '@expo/vector-icons';
import {CheckBox} from '@rneui/themed';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {ConnectionCardProps} from '../types/connections.types';
import {styles} from '../styles/connectionsPage.styles';

export function ConnectionCard({
  activeConnectionId,
  connection,
  onActivate,
  onDelete,
  onEdit,
}: ConnectionCardProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={styles.connectionCard}
      onPress={() => onEdit(connection.id)}>
      <View style={styles.connectionInfo}>
        <Ionicons
          name="wifi-sharp"
          size={25}
          color="black"
          style={styles.connectionIcon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Conexão</Text>
          <Text style={styles.detail}>Host: {connection.host}</Text>
          <Text style={styles.detail}>Cod Loja: {connection.codStore}</Text>
          <Text style={styles.detail}>Terminal: {connection.terminal}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <CheckBox
          checked={activeConnectionId === connection.id}
          containerStyle={styles.checkboxContainer}
          onPress={() => onActivate(connection)}
        />
        <TouchableOpacity
          onPress={() => onDelete(connection.id, connection.host)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
