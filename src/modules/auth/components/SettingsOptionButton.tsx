import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {SettingsOptionButtonProps} from '../types/settings.types';
import {styles} from '../styles/settingsPage.styles';

export function SettingsOptionButton({
  details = [],
  iconName,
  onPress,
  title,
}: SettingsOptionButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity onPress={onPress} style={styles.optionButton}>
      <View style={styles.optionButtonContent}>
        <Ionicons
          name={iconName}
          size={25}
          color="black"
          style={styles.optionButtonIcon}
        />
        <View style={styles.optionButtonTextContainer}>
          <Text style={styles.optionButtonTitle}>{title}</Text>
          {details.map(detail => (
            <Text
              key={detail}
              style={styles.optionButtonDetail}
              numberOfLines={1}
              ellipsizeMode="head">
              {detail}
            </Text>
          ))}
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={25}
        color="black"
        style={styles.optionButtonIcon}
      />
    </TouchableOpacity>
  );
}
