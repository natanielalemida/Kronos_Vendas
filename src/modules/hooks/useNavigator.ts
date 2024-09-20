import {useNavigation} from '@react-navigation/native';

export function UseNavigator() {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const goTo = (value: string, data?: any) => {
    navigation.navigate(value, data);
  };

  return {
    goBack,
    goTo,
  };
}
