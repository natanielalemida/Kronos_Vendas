import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type TagProps = {
  color: string;
  label: string;
};

const Tag: React.FC<TagProps> = ({color, label}) => {
  return (
    <View style={[styles.tag, {backgroundColor: color}]}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 5,
    alignSelf: 'flex-end',
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Tag;
