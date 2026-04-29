import React from 'react';
import {TextInput, View, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../../styles';
import {SearchProps} from './type/searchProps';
import {ShowIf} from '../showIf';
import {searchStyles} from './search.styles';

export default function Search({
  value,
  onChangeText,
  placeholder,
}: SearchProps) {
  return (
    <View style={searchStyles.container}>
      <Ionicons
        name="search"
        size={20}
        color={colors.graySearch}
        style={searchStyles.icon}
      />
      <TextInput
        style={searchStyles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={colors.graySearch}
      />
      <ShowIf condition={!!value}>
        <TouchableOpacity
          style={searchStyles.clearButton}
          onPress={() => onChangeText('')}>
          <Ionicons size={19} color={colors.black} name="close-circle" />
        </TouchableOpacity>
      </ShowIf>
    </View>
  );
}
