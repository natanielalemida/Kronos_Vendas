import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {CheckBox} from '@rneui/themed';

import CustomTextInput from '@/modules/components/customTextInput/customTextInput';

import {CustomerMunicipalityAutocomplete} from '../components/CustomerMunicipalityAutocomplete';
import {useSetupCustomerAddressPage} from '../hooks/useSetupCustomerAddressPage';
import {styles} from '../styles/customerAddressPage.styles';

export default function CustomerAddressPage(): React.JSX.Element {
  const {data, handlers, refs} = useSetupCustomerAddressPage();

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={refs.streetInputRef}
              onChangeText={handlers.handleStreetChange}
              onSubmitEditing={handlers.handleStreetSubmit}
              placeholder="Logradouro"
              style={styles.input}
              value={data.form.Logradouro}
            />

            <View style={styles.numberContainer}>
              <CustomTextInput
                ref={refs.numberInputRef}
                keyboardType="numeric"
                onChangeText={handlers.handleNumberChange}
                onSubmitEditing={handlers.handleNumberSubmit}
                placeholder="Nº"
                style={[styles.input, styles.flexInput]}
                value={data.form.NumeroEndereco}
              />

              <TouchableOpacity
                onPress={handlers.handleToggleWithoutNumber}
                style={styles.checkboxButton}>
                <CheckBox
                  checked={data.withoutNumber}
                  containerStyle={styles.checkboxContainer}
                  onPress={handlers.handleToggleWithoutNumber}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={refs.districtInputRef}
              onChangeText={handlers.handleDistrictChange}
              onSubmitEditing={handlers.handleDistrictSubmit}
              placeholder="Bairro"
              style={styles.input}
              value={data.form.Bairro}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={refs.complementInputRef}
              onChangeText={handlers.handleComplementChange}
              onSubmitEditing={handlers.handleComplementSubmit}
              placeholder="Complemento"
              style={styles.input}
              value={data.form.Complemento}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={refs.zipCodeInputRef}
              keyboardType="numeric"
              onChangeText={handlers.handleZipCodeChange}
              onSubmitEditing={handlers.handleZipCodeSubmit}
              placeholder="CEP"
              style={styles.input}
              value={data.form.CEP}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomerMunicipalityAutocomplete ref={refs.municipalityInputRef} />
          </View>
        </View>
      </View>
    </View>
  );
}
