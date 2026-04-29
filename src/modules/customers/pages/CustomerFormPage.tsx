import React from 'react';
import {ScrollView, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {TextInputMask} from 'react-native-masked-text';

import CustomTextInput from '@/modules/components/customTextInput/customTextInput';
import {ShowIf} from '@/modules/components/showIf';
import {colors} from '@/modules/styles';

import {useSetupCustomerFormPage} from '../hooks/useSetupCustomerFormPage';
import {styles} from '../styles/customerFormPage.styles';

export default function CustomerFormPage(): React.JSX.Element {
  const {data, handlers, refs} = useSetupCustomerFormPage();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator>
      <View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={refs.documentInputRef}
              keyboardType="numeric"
              onChangeText={handlers.handleDocumentChange}
              onSubmitEditing={handlers.handleDocumentSubmit}
              placeholder="CPF/CNPJ"
              style={styles.input}
              value={data.formattedDocument}
              width="60%"
            />

            <CustomTextInput
              ref={refs.identityInputRef}
              keyboardType="numeric"
              onChangeText={handlers.handleIdentityChange}
              onSubmitEditing={handlers.handleIdentitySubmit}
              placeholder={data.documentLabel}
              style={[styles.input, styles.flexInput]}
              value={data.form.IE}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={refs.tradeNameInputRef}
              onChangeText={handlers.handleTradeNameChange}
              onSubmitEditing={handlers.handleTradeNameSubmit}
              placeholder="Nome Fantasia"
              style={[styles.input, styles.flexInput]}
              value={data.form.NomeFantasia}
            />
          </View>
        </View>

        <ShowIf condition={data.shouldShowCorporateName}>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                ref={refs.corporateNameInputRef}
                onChangeText={handlers.handleCorporateNameChange}
                onSubmitEditing={handlers.handleCorporateNameSubmit}
                placeholder="Razão Social"
                style={[styles.input, styles.flexInput]}
                value={data.form.RazaoSocial}
              />
            </View>
          </View>
        </ShowIf>

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <TextInputMask
              ref={refs.phoneMaskRef}
              keyboardType="numeric"
              onChangeText={handlers.handlePhoneDraftChange}
              onSubmitEditing={handlers.handlePhoneDraftSubmit}
              options={{
                dddMask: '(99)',
                maskType: 'BRL',
                withDDD: true,
              }}
              placeholder="Celular"
              placeholderTextColor={colors.black}
              style={styles.input}
              type="cel-phone"
              value={data.phoneDraft}
            />

            <Ionicons
              color={colors.primary}
              name="add-circle-outline"
              onPress={handlers.handlePhoneAppend}
              size={20}
              style={styles.inputIcon}
            />
          </View>
        </View>

        {data.form.Celular.map((contact, index) => (
          <View key={`${contact.Contato}-${index}`} style={styles.row}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                placeholder="Celular"
                style={[styles.input, styles.flexInput]}
                value={contact.Contato}
              />
              <Ionicons
                color={colors.cancelButton}
                name="trash"
                onPress={() => handlers.handlePhoneRemove(contact.Contato)}
                size={25}
              />
            </View>
          </View>
        ))}

        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              ref={refs.emailInputRef}
              keyboardType="email-address"
              onChangeText={handlers.handleEmailDraftChange}
              onSubmitEditing={handlers.handleEmailDraftSubmit}
              placeholder="Email"
              style={styles.input}
              value={data.emailDraft}
            />

            <Ionicons
              color={colors.primary}
              name="add-circle-outline"
              onPress={handlers.handleEmailAppend}
              size={20}
              style={styles.inputIcon}
            />
          </View>
        </View>

        {data.form.Email.map((contact, index) => (
          <View key={`${contact.Contato}-${index}`} style={styles.row}>
            <View style={styles.inputContainer}>
              <CustomTextInput
                placeholder="Email"
                style={[styles.input, styles.flexInput]}
                value={contact.Contato}
              />
              <Ionicons
                color={colors.cancelButton}
                name="trash"
                onPress={() => handlers.handleEmailRemove(contact.Contato)}
                size={25}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
