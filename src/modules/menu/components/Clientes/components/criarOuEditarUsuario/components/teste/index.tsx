import React, {memo} from 'react';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import UseGetMunicipio from '../../hooks/useGetMunicipio';
import {useCliente} from '../../../../context/clientContext';
import Init from '../../../../hooks/init';
import {View, ActivityIndicator} from 'react-native';

export const RemoteDataSetExample3 = memo(() => {
  const {form, setForm} = useCliente();
  const {getMunicipio, municipios} = UseGetMunicipio();

  Init({handleGetUsers: getMunicipio});

  if (municipios.length < 1) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00B08F" />
      </View>
    );
  }

  return (
    <AutocompleteDropdown
      clearOnFocus={false}
      closeOnBlur={true}
      closeOnSubmit={false}
      onSelectItem={item => {
        item &&
          // @ts-ignore
          setForm(oldValue => ({
            ...oldValue,
            Municipio: {
              Codigo: item.id,
              MunicipioNome: item.title,
              MunicipioCodigo: item.MunicipioCodigo,
              Estado: item.Estado,
            },
          }));
      }}
      initialValue={'2'} // or just '2'
      dataSet={[...municipios]}
      textInputProps={{
        placeholder: 'Municipio',
        autoCorrect: false,
        autoCapitalize: 'none',
        style: {
          color: '#383b42',
        },
      }}
      rightButtonsContainerStyle={{
        height: 30,
        alignSelf: 'center',
      }}
      inputContainerStyle={{
        backgroundColor: '#f2f2f2',
      }}
      suggestionsListContainerStyle={{
        backgroundColor: '#fff',
      }}
      containerStyle={{flexGrow: 1, flexShrink: 1}}
    />
  );
});
