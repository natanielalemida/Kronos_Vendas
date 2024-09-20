import {useCallback, useEffect} from 'react';
import {InitProps} from '../type';
import {useFocusEffect} from '@react-navigation/native';

export default function Init({handleGetProdutos, setTextFilter}: InitProps) {
  useFocusEffect(
    useCallback(() => {
      setTextFilter('');
      handleGetProdutos();
      return () => {};
    }, []),
  );
}
