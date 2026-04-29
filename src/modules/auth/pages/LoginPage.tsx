import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';

import Loading from '@/modules/components/loading/Loading';
import {LoadingLogin} from '@/modules/components/loading';
import {ShowIf} from '@/modules/components/showIf';
import {colors} from '@/modules/styles';

import {LoginBrand} from '../components/LoginBrand';
import {LoginForm} from '../components/LoginForm';
import {useSetupLoginPage} from '../hooks/useSetupLoginPage';
import {styles} from '../styles/loginPage.styles';
import {RootScreenProps} from '@/app/navigation/types/root-navigation.types';

export default function LoginPage({
  navigation,
}: RootScreenProps<'Login'>): React.JSX.Element {
  const {
    assets,
    derivedState,
    form,
    handlers,
    isLoadingOrganization,
    organizations,
    progress,
  } = useSetupLoginPage({navigation});

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}>
      <StatusBar translucent backgroundColor="transparent" />

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handlers.handleOpenSettings}>
        <Ionicons name="settings" size={25} color={colors.arcGreen400} />
      </TouchableOpacity>

      <LoginBrand
        compactLayout={derivedState.compactLayout}
        logo={assets.logo}
      />

      {progress ? <LoadingLogin progress={progress} /> : null}

      <ShowIf condition={isLoadingOrganization}>
        <Loading isModalLoadingActive={isLoadingOrganization} />
      </ShowIf>

      <ShowIf condition={!progress}>
        <LoginForm
          compactForm={derivedState.compactForm}
          compactLayout={derivedState.compactLayout}
          form={form}
          handlers={handlers}
          organizations={organizations}
          shouldShowBiometricButton={derivedState.shouldShowBiometricButton}
        />
      </ShowIf>

      <Text style={styles.footerText}>
        Arc Solution - {new Date().getFullYear()}
      </Text>
    </KeyboardAvoidingView>
  );
}
