import React from 'react';
import {View, Text} from 'react-native';
import {getTagBackgroundStyle, tagStyles} from './tag.styles';
import {TagProps} from './tag.types';

const Tag: React.FC<TagProps> = ({color, label}) => {
  return (
    <View style={[tagStyles.tag, getTagBackgroundStyle(color)]}>
      <Text style={tagStyles.tagText}>{label}</Text>
    </View>
  );
};

export default Tag;
