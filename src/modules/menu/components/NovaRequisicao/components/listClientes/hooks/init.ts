import {useCallback} from 'react';
import {InitProps} from '../type';
import {useFocusEffect} from '@react-navigation/native';

export default function Init({handleGetUsers, setTextFilter}: InitProps) {
  useFocusEffect(
    useCallback(() => {
      handleGetUsers();
      setTextFilter('');
      return () => {};
    }, []),
  );
}
