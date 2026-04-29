import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {ShowIf} from '@/modules/components/showIf';

import {AuthInput} from './AuthInput';
import {OrganizationSelect} from './OrganizationSelect';
import {LoginFormProps} from '../types/login-component.types';
import {styles} from '../styles/loginPage.styles';

export function LoginForm({
  compactForm,
  compactLayout,
  form,
  handlers,
  organizations,
  shouldShowBiometricButton,
}: LoginFormProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.formContainer,
        compactForm && styles.compactFormContainer,
      ]}>
      <OrganizationSelect
        control={form.control}
        errorMessage={form.errors.organizationCode ?? form.errors.organization}
        placeholder="Selecione uma empresa"
        onSelect={handlers.handleChangeOrganization}
        inputWidth="90%"
        data={organizations}
      />

      <AuthInput
        control={form.control}
        errorMessage={form.errors.cpf}
        name="cpf"
        targetFocusField={form.focusedField}
        leftIcon="person"
        onEndEditing={() => form.setFocusedField('Senha')}
        leftColor="black"
        leftSize={25}
        placeholder="CPF"
        inputWidth="90%"
      />

      <AuthInput
        control={form.control}
        errorMessage={form.errors.password}
        name="password"
        targetFocusField={form.focusedField}
        leftIcon="lock-closed"
        password={form.showPassword}
        leftColor="black"
        leftSize={25}
        placeholder="Senha"
        inputWidth="90%"
        rightColor="black"
        rightSize={25}
        rightIcon={form.showPassword ? 'eye-outline' : 'eye-off'}
        onPressRightIcon={() => form.setShowPassword(!form.showPassword)}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            compactLayout && styles.submitButtonCompact,
          ]}
          onPress={handlers.handleLogin}>
          <Text style={styles.submitButtonText}>ENTRAR</Text>
        </TouchableOpacity>

        <ShowIf condition={shouldShowBiometricButton}>
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handlers.handleRestoreUser}>
            <Ionicons
              style={styles.iconSpacing}
              name="finger-print"
              size={18}
              color="white"
            />
            <Text style={styles.biometricButtonText}>Login com biometria</Text>
          </TouchableOpacity>
        </ShowIf>
      </View>
    </View>
  );
}
