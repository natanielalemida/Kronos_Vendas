import {ActivityIndicator, Modal, View} from 'react-native';
import {LoadingPropsType} from './type';

export default function Loading({isModalLoadingActive}: LoadingPropsType) {
  return (
    <Modal
      statusBarTranslucent
      transparent={true}
      visible={isModalLoadingActive}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    </Modal>
  );
}
