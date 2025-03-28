import {useCallback, useEffect} from 'react';
import {InitProps} from '../type';
import {useFocusEffect} from '@react-navigation/native';

export default function Init({handleGetProdutos, setOptions}: InitProps) {
  useFocusEffect(
    useCallback(() => {
      handleGetProdutos();
      return () => {};
    }, []),
  );
}
