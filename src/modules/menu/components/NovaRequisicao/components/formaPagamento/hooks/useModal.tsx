import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';

export default function UseModal() {
  const navigation = useNavigation();
  const [isActive, setIsModalActive] = useState<boolean>(true);

  const handleCloseModal = () => {
    setIsModalActive(false);
    navigation.navigate('Menu');
  };

  return {
    isActive,
    setIsModalActive,
    handleCloseModal,
  };
}
