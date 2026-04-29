import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import LottieView from 'lottie-react-native';

import {styles} from '../styles/syncPage.styles';
import {useSetupSyncPage} from '../hooks/useSetupSyncPage';
import {
  getSyncStatusDescription,
  getSyncStatusTitle,
  splitSyncActionCards,
} from '../helpers/sync-page-view.helper';
import {getSyncStepStatusLabel} from '../helpers/sync-step-status-label.helper';
import {getSyncToneStyle} from '../helpers/sync-tone-style.helper';

export function SyncPage(): React.JSX.Element {
  const {
    status,
    progress,
    lastSyncLabel,
    isSyncing,
    errorMessage,
    steps,
    actionCards,
    animationRef,
  } = useSetupSyncPage();
  const {primaryAction, secondaryActions} = splitSyncActionCards(actionCards);
  const shouldShowExecutionDetails = isSyncing || !!errorMessage;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusCopy}>
            <Text style={styles.statusTitle}>{getSyncStatusTitle(status)}</Text>
            <Text style={styles.statusDescription}>
              {getSyncStatusDescription(status)}
            </Text>
          </View>

          <LottieView
            ref={animationRef}
            source={require('../../../assets/sync/Animation - 1724678574908.json')}
            style={styles.statusAnimation}
          />
        </View>

        <Text style={styles.lastSyncText}>
          {`Última sincronização: ${lastSyncLabel}`}
        </Text>

        {progress ? (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{progress.message}</Text>
              <Text style={styles.progressPercentage}>
                {`${progress.progress}%`}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${Math.max(progress.progress, 6)}%`},
                ]}
              />
            </View>
          </View>
        ) : null}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>

      {primaryAction ? (
        <TouchableOpacity
          style={[
            styles.primaryActionCard,
            styles.actionCardSuccess,
            isSyncing && styles.actionCardDisabled,
          ]}
          disabled={isSyncing}
          onPress={() => {
            primaryAction.onPress().catch(() => {
              // The sync flow already handles alerting and screen state.
            });
          }}>
          <Text style={styles.primaryActionTitle}>Sincronizar tudo</Text>
          <Text style={styles.primaryActionDescription}>
            {primaryAction.description}
          </Text>
          <View style={styles.primaryActionFooter}>
            <Text style={styles.primaryActionFooterText}>
              {isSyncing ? 'Sincronizando...' : 'Executar'}
            </Text>
            <View style={[styles.secondaryActionDot, styles.actionBadgeSuccess]} />
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opções</Text>
        <View style={styles.secondaryActionsContainer}>
          {secondaryActions.map(actionCard => {
            const toneStyle = getSyncToneStyle(actionCard.tone);

            return (
              <TouchableOpacity
                key={actionCard.id}
                style={[
                  styles.secondaryActionCard,
                  toneStyle.card,
                  isSyncing && styles.actionCardDisabled,
                ]}
                disabled={isSyncing}
                onPress={() => {
                  actionCard.onPress().catch(() => {
                    // The sync flow already handles alerting and screen state.
                  });
                }}>
                <View style={styles.secondaryActionHeader}>
                  <Text style={styles.secondaryActionTitle}>
                    {actionCard.label}
                  </Text>
                  <View style={[styles.secondaryActionDot, toneStyle.badge]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {steps.length > 0 && shouldShowExecutionDetails ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acompanhamento</Text>
          <View style={styles.stepsContainer}>
            {steps.map(step => (
              <View key={step.id} style={styles.stepCard}>
                <View style={styles.stepCopy}>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                  {step.message ? (
                    <Text style={styles.stepMessage}>{step.message}</Text>
                  ) : null}
                </View>
                <View style={styles.stepStatusBadge}>
                  <Text style={styles.stepStatusText}>
                    {getSyncStepStatusLabel(step.status)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
