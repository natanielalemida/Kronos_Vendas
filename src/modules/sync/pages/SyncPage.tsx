import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LottieView from 'lottie-react-native';

import {styles} from '../styles/syncPage.styles';
import {useSetupSyncPage} from '../hooks/useSetupSyncPage';
import {getSyncToneStyle} from '../helpers/sync-tone-style.helper';

export function SyncPage(): React.JSX.Element {
  const {
    progress,
    lastSyncLabel,
    isSyncing,
    errorMessage,
    steps,
    actionCards,
    animationRef,
  } = useSetupSyncPage();

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <LottieView
          ref={animationRef}
          source={require('../../../assets/sync/Animation - 1724678574908.json')}
          style={styles.heroAnimation}
        />
        <Text style={styles.title}>Synchronization Center</Text>
        <Text style={styles.subtitle}>
          Keep local data, product assets and offline storage aligned with the
          latest server state.
        </Text>

        {progress ? (
          <>
            <LottieView
              source={require('../../../assets/sync/Animation - 1724681567926.json')}
              progress={progress.progress / 100}
              style={styles.progressAnimation}
            />
            <Text style={styles.progressText}>{progress.message}</Text>
          </>
        ) : null}

        <Text style={styles.lastSyncText}>{`Last sync: ${lastSyncLabel}`}</Text>
        {errorMessage ? (
          <Text style={styles.progressText}>{errorMessage}</Text>
        ) : null}
      </View>

      <View style={styles.actionsContainer}>
        {actionCards.map(actionCard => (
          <TouchableOpacity
            key={actionCard.id}
            style={[
              styles.actionButton,
              getSyncToneStyle(actionCard.tone),
              isSyncing && styles.actionButtonDisabled,
            ]}
            disabled={isSyncing}
            onPress={() => {
              actionCard.onPress().catch(error => {
                console.error(`Failed to execute ${actionCard.id}:`, error);
              });
            }}>
            <Text style={styles.actionLabel}>{actionCard.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {steps.length > 0 ? (
        <View style={styles.actionsContainer}>
          {steps.map(step => (
            <Text key={step.id} style={styles.lastSyncText}>
              {`${step.label}: ${step.status}`}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
