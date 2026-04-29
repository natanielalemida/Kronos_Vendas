import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {colors} from '@/modules/styles';

import {useSetupOrganizationSelect} from '../hooks/useSetupOrganizationSelect';
import {OrganizationSelectProps} from '../types/organization-select.types';
import {getAuthInputWidthStyle, styles} from '../styles/authInput.styles';
import {OrganizationSelectModal} from './OrganizationSelectModal';

export function OrganizationSelect({
  control,
  errorMessage,
  data,
  inputWidth,
  onSelect,
  placeholder,
}: OrganizationSelectProps): React.JSX.Element {
  const {field, handlers, isModalVisible} = useSetupOrganizationSelect({
    control,
    data,
    onSelect,
  });

  return (
    <View
      style={[
        styles.fieldContainer,
        inputWidth
          ? getAuthInputWidthStyle(inputWidth)
          : styles.fieldContainerFullWidth,
      ]}>
      <TouchableOpacity
        disabled={!data.length}
        style={[
          styles.inputContainer,
          errorMessage ? styles.inputContainerError : undefined,
        ]}
        onPress={handlers.openModal}>
        <View style={styles.leftIconContainer}>
          <Ionicons
            name="business"
            size={25}
            color={colors.black}
            style={styles.leftIcon}
          />
          <Text style={[styles.labelText, styles.labelTextDark]}>
            {field.value || placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" color={colors.black} size={25} />
        <OrganizationSelectModal
          data={data}
          isVisible={isModalVisible}
          onClose={handlers.closeModal}
          onSelect={handlers.selectOrganization}
        />
      </TouchableOpacity>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}
