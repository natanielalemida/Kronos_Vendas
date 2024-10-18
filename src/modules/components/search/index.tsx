import React, {useState} from 'react';
import {StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../styles';
import {SearchProps} from './type/searchProps';
import {ShowIf} from '../showIf';

export default function Search({
  value,
  onChangeText,
  placeholder,
}: SearchProps) {
  return (
    <View style={styles.container}>
      <Icon
        name="search"
        size={20}
        color={colors.graySearch}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={colors.graySearch}
      />
      <ShowIf condition={!!value}>
        <TouchableOpacity
          style={styles.icon_block}
          onPress={() => onChangeText('')}>
          <Icon size={19} color="black" name="close-circle" />
        </TouchableOpacity>
      </ShowIf>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4d4d4',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  icon_block: {},
});
