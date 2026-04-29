import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';
import {LoadingModalProps} from '@/shared/types';
import {colors} from '@/modules/styles';
import {loadingStyles} from './loading.styles';

export function Loading({isModalLoadingActive}: LoadingModalProps) {
  return (
    <Modal
      statusBarTranslucent
      transparent={true}
      visible={isModalLoadingActive}>
      <View style={loadingStyles.overlay}>
        <ActivityIndicator size="large" color={colors.arcGreenNeon} />
      </View>
    </Modal>
  );
}

export default Loading;
