import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';

import CustomTextInput from '@/modules/components/customTextInput/customTextInput';

import {useSetupCustomerMunicipalityAutocomplete} from '../hooks/useSetupCustomerMunicipalityAutocomplete';
import {styles} from '../styles/customerMunicipalityAutocomplete.styles';

export const CustomerMunicipalityAutocomplete = React.forwardRef(
  function CustomerMunicipalityAutocomplete(
    _props,
    ref: React.ForwardedRef<React.ComponentRef<typeof CustomTextInput>>,
  ): React.JSX.Element {
    const {data, handlers} = useSetupCustomerMunicipalityAutocomplete();

    return (
      <View style={styles.container}>
        <CustomTextInput
          ref={ref}
          onChangeText={handlers.handleSearchChange}
          placeholder="Municipios"
          style={styles.input}
          value={data.query}
        />

        {data.filteredMunicipalities.length ? (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={data.filteredMunicipalities}
            keyExtractor={item => item.Codigo.toString()}
            keyboardShouldPersistTaps="always"
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handlers.handleMunicipalitySelect(item)}>
                <Text style={styles.suggestion}>{item.MunicipioNome}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsContainer}
          />
        ) : null}
      </View>
    );
  },
);
