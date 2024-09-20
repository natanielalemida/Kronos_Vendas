import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {InitProps} from '../type';

export default function Init({handleFetchData}: InitProps) {
  useFocusEffect(
    useCallback(() => {
      handleFetchData();
      return () => {};
    }, []),
  );
}
